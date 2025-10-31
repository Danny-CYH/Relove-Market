<?php

namespace App\Http\Controllers\SellerPage;

use App\Events\OrderCompleted;
use App\Http\Controllers\Controller;

use App\Models\Order;
use Exception;
use Illuminate\Http\Request;

class SellerManageOrderController extends Controller
{
    protected $user_id;

    protected $seller_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
        $this->seller_id = session('seller_id');
    }

    public function get_listOrder(Request $request)
    {
        try {
            $search = $request->input('search', '');
            $status = $request->input('status', '');
            $sort = $request->input('sort', 'created_at');
            $order = $request->input('order', 'desc');
            $page = $request->input('page', 1); // Get the page number

            $query = Order::with(['user', 'orderItems.product', "orderItems.productImage"])
                ->where('seller_id', $this->seller_id);

            // Apply search filter
            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_id', 'LIKE', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'LIKE', "%{$search}%")
                                ->orWhere('email', 'LIKE', "%{$search}%");
                        })
                        ->orWhereHas('orderItems.product', function ($productQuery) use ($search) {
                            $productQuery->where('product_name', 'LIKE', "%{$search}%");
                        })
                        ->orWhere('amount', 'LIKE', "%{$search}%");
                });
            }

            // Apply status filter
            if (!empty($status)) {
                $query->where('order_status', $status);
            }

            // Apply sorting
            $query->orderBy($sort, $order);

            // ALWAYS use pagination, regardless of search
            $paginated = $query->paginate(5, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $paginated->items(),
                'total' => $paginated->total(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'is_search' => !empty($search) // Just indicate if it's a search, but still paginated
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching orders: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, $orderId)
    {
        try {
            $order = Order::where('seller_id', $this->seller_id)
                ->findOrFail($orderId);

            $validated = $request->validate([
                'status' => 'required|in:Processing,Shipped,Delivered,Cancelled'
            ]);

            $order->update(['order_status' => $validated['status']]);

            if ($validated['status'] === 'Delivered') {
                // Trigger earnings update
                event(new OrderCompleted($order));
            }

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'order' => $order->load('user', 'orderItems.product', 'orderItems.productImage')
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating order status: ' . $e->getMessage()
            ], 500);
        }
    }
}
