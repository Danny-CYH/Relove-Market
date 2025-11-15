<?php

namespace App\Http\Controllers\AdminPage;

use App\Events\PaymentReleased;
use App\Http\Controllers\Controller;
use App\Models\SellerEarning;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionManagementController extends Controller
{
    public function releasePayment($orderId)
    {
        try {
            DB::beginTransaction();

            // Find the transaction by order_id
            $transaction = SellerEarning::with(['seller', 'order'])
                ->where("order_id", $orderId)
                ->firstOrFail();

            \Log::info('Releasing payment for order', [
                'order_id' => $orderId,
                'transaction_id' => $transaction->id,
                'current_status' => $transaction->status
            ]);

            // Check if payment can be released - Enhanced validations
            if ($transaction->order->payment_status !== 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment cannot be released. Transaction payment status is not paid.'
                ], 400);
            }

            if ($transaction->order->order_status !== 'Completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment cannot be released. Order is not completed.'
                ], 400);
            }

            // Check if payment is already released in seller_earnings
            if ($transaction->status === 'Released') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment has already been released to seller.'
                ], 400);
            }

            // Update transaction status
            $transaction->update([
                'status' => 'Released',
                'paid_at' => now(),
            ]);

            DB::commit();

            // Broadcast payment released event with proper data
            try {
                event(new PaymentReleased(
                    orderId: $orderId,
                    amount: $transaction->payout_amount,
                    sellerId: $transaction->seller->seller_id,
                    releasedAt: now()->toISOString()
                ));

                \Log::info('Payment released event broadcasted', [
                    'order_id' => $orderId,
                    'seller_id' => $transaction->seller->seller_id,
                    'amount' => $transaction->payout_amount
                ]);
            } catch (\Throwable $e) {
                \Log::error('Broadcast failed: ' . $e->getMessage(), [
                    'order_id' => $orderId,
                    'seller_id' => $transaction->seller->seller_id
                ]);
                // Don't fail the whole request if broadcast fails
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment successfully released to seller.',
                'data' => $transaction->fresh(['seller', 'order'])
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            \Log::error('Transaction not found: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Transaction not found for this order.'
            ], 404);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Payment release failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to release payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update order status
     */
    public function updateOrderStatus($orderId, Request $request)
    {
        try {
            DB::beginTransaction();

            $transaction = Transaction::where('order_id', $orderId)->firstOrFail();
            $newStatus = $request->input('status');

            $validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];

            if (!in_array($newStatus, $validStatuses)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid order status.'
                ], 400);
            }

            // Update order status
            $transaction->update([
                'order_status' => $newStatus,
                'status_updated_at' => now()
            ]);

            $response = [
                'success' => true,
                'message' => 'Order status updated successfully.',
                'data' => $transaction
            ];

            // Auto-release payment when order is completed
            if ($newStatus === 'Completed' && $transaction->payment_status === 'paid') {
                $releaseResponse = $this->releasePayment($orderId);

                if ($releaseResponse->getData()->success) {
                    $response['message'] = 'Order completed and payment released to seller.';
                    $response['payment_released'] = true;
                }
            }

            DB::commit();

            return response()->json($response);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order status update failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get order tracking information
     */
    public function getOrderTracking($orderId)
    {
        try {
            $transaction = Transaction::with(['user', 'seller', 'sellerEarnings'])
                ->where('order_id', $orderId)
                ->firstOrFail();

            $orderStatusSteps = [
                ['status' => 'Pending', 'description' => 'Order placed', 'completed' => false],
                ['status' => 'Confirmed', 'description' => 'Buyer confirmed order', 'completed' => false],
                ['status' => 'Processing', 'description' => 'Seller processing order', 'completed' => false],
                ['status' => 'Shipped', 'description' => 'Order shipped to buyer', 'completed' => false],
                ['status' => 'Delivered', 'description' => 'Order delivered successfully', 'completed' => false],
                ['status' => 'Completed', 'description' => 'Order completed', 'completed' => false],
                ['status' => 'Payment Released', 'description' => 'Payment released to seller', 'completed' => false],
            ];

            // Mark completed steps based on current status
            $currentStatusIndex = array_search($transaction->order_status, array_column($orderStatusSteps, 'status'));

            if ($currentStatusIndex !== false) {
                foreach ($orderStatusSteps as $index => &$step) {
                    $step['completed'] = $index <= $currentStatusIndex;
                    $step['current'] = $index === $currentStatusIndex;
                }
            }

            // Check payment release status
            $sellerEarning = $transaction->sellerEarnings->first();
            $isPaymentReleased = $sellerEarning && $sellerEarning->status === 'Released';

            // Check if order is complete
            $isOrderComplete = in_array($transaction->order_status, ['Completed', 'Payment Released']);

            return response()->json([
                'success' => true,
                'data' => [
                    'transaction' => $transaction,
                    'tracking_steps' => $orderStatusSteps,
                    'is_order_complete' => $isOrderComplete,
                    'is_payment_complete' => $isPaymentReleased,
                    'completion_message' => $isOrderComplete ?
                        'This order has been completed successfully.' :
                        'Order is in progress.'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Order tracking failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to get order tracking information.'
            ], 500);
        }
    }

    /**
     * Manual payment release for admin
     */
    public function manualReleasePayment($orderId)
    {
        return $this->releasePayment($orderId);
    }

    /**
     * Get transactions statistics
     */
    public function getTransactionStats()
    {
        $totalRevenue = Transaction::where('order_status', 'Completed')
            ->get()
            ->sum(function ($transaction) {
                $earning = $transaction->sellerEarnings->first();
                return $earning ? floatval($earning->commission_deducted) : 0;
            });

        $completedTransactions = Transaction::where('order_status', 'Completed')->count();

        $pendingRelease = Transaction::where('order_status', 'Completed')
            ->whereHas('sellerEarnings', function ($query) {
                $query->where('status', 'Pending');
            })
            ->count();

        $releasedPayments = Transaction::where('payment_status', 'released')->count();

        $totalAmountPending = Transaction::where('order_status', 'Completed')
            ->whereHas('sellerEarnings', function ($query) {
                $query->where('status', 'Pending');
            })
            ->get()
            ->sum(function ($transaction) {
                $earning = $transaction->sellerEarnings->first();
                return $earning ? floatval($earning->payout_amount) : 0;
            });

        return response()->json([
            'success' => true,
            'data' => [
                'total_revenue' => $totalRevenue,
                'completed_transactions' => $completedTransactions,
                'pending_release' => $pendingRelease,
                'released_payments' => $releasedPayments,
                'total_amount_pending' => $totalAmountPending
            ]
        ]);
    }
}