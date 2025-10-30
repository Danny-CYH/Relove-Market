<?php

namespace App\Http\Controllers\SellerPage;

use App\Http\Controllers\Controller;

use App\Models\Order;

use Exception;

use Illuminate\Http\Request;

use Barryvdh\DomPDF\Facade\Pdf;

class SellerManageEarningController extends Controller
{
    protected $user_id;

    protected $seller_id;

    public function __construct()
    {
        $this->user_id = session('user_id');
        $this->seller_id = session('seller_id');
    }

    public function getEarnings(Request $request)
    {
        try {
            $sellerId = $this->seller_id;
            $filter = $request->input('filter', 'monthly');
            $page = $request->input('page', 1);
            $perPage = 5;

            // Total earnings from completed/delivered orders
            $totalEarnings = Order::where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->sum('amount');

            // Pending payouts (orders that are delivered but not paid out yet)
            $pendingPayouts = Order::where('seller_id', $sellerId)
                ->where('order_status', 'Delivered')
                ->sum('amount');

            // This month earnings
            $thisMonth = Order::where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->sum('amount');

            // Last month earnings
            $lastMonth = Order::where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->whereYear('created_at', now()->subMonth()->year)
                ->whereMonth('created_at', now()->subMonth()->month)
                ->sum('amount');

            // Today's earnings
            $today = Order::where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->whereDate('created_at', today())
                ->sum('amount');

            // Chart data based on filter
            $chartData = [];
            $chartLabels = [];

            switch ($filter) {
                case 'daily':
                    // Last 7 days
                    for ($i = 6; $i >= 0; $i--) {
                        $date = now()->subDays($i);
                        $dailyEarnings = Order::where('seller_id', $sellerId)
                            ->whereIn('order_status', ['Delivered', 'completed'])
                            ->whereDate('created_at', $date->format('Y-m-d'))
                            ->sum('amount');

                        $chartData[] = $dailyEarnings;
                        $chartLabels[] = $date->format('D, M d');
                    }
                    break;

                case 'monthly':
                    // Last 6 months
                    for ($i = 5; $i >= 0; $i--) {
                        $date = now()->subMonths($i);
                        $monthlyEarnings = Order::where('seller_id', $sellerId)
                            ->whereIn('order_status', ['Delivered', 'completed'])
                            ->whereYear('created_at', $date->year)
                            ->whereMonth('created_at', $date->month)
                            ->sum('amount');

                        $chartData[] = $monthlyEarnings;
                        $chartLabels[] = $date->format('M Y');
                    }
                    break;

                case 'yearly':
                    // Last 5 years
                    for ($i = 4; $i >= 0; $i--) {
                        $year = now()->subYears($i)->year;
                        $yearlyEarnings = Order::where('seller_id', $sellerId)
                            ->whereIn('order_status', ['Delivered', 'completed'])
                            ->whereYear('created_at', $year)
                            ->sum('amount');

                        $chartData[] = $yearlyEarnings;
                        $chartLabels[] = $year;
                    }
                    break;
            }

            // Recent transactions with pagination
            $transactionsQuery = Order::with(["orderItems.product"])
                ->where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->orderBy('created_at', 'desc');

            $paginatedTransactions = $transactionsQuery->paginate($perPage, ['*'], 'page', $page);

            $recentTransactions = $paginatedTransactions->map(function ($order) {
                $productName = $order->orderItems->first()->product->product_name ?? 'N/A';

                return [
                    'id' => $order->id,
                    'order_id' => $order->order_id,
                    'date' => $order->created_at,
                    'ref' => $order->order_id,
                    'product_name' => $productName,
                    'amount' => $order->amount,
                    'order_status' => $order->order_status,
                    'payment_status' => $order->is_paid ? 'Paid' : 'Pending',
                ];
            });

            return response()->json([
                'total_earnings' => $totalEarnings,
                'pending_payouts' => $pendingPayouts,
                'this_month' => $thisMonth,
                'last_month' => $lastMonth,
                'today' => $today,
                'chart_data' => [
                    'labels' => $chartLabels,
                    'data' => $chartData,
                ],
                'recent_transactions' => $recentTransactions,
                'pagination' => [
                    'current_page' => $paginatedTransactions->currentPage(),
                    'last_page' => $paginatedTransactions->lastPage(),
                    'per_page' => $paginatedTransactions->perPage(),
                    'total' => $paginatedTransactions->total(),
                    'from' => $paginatedTransactions->firstItem(),
                    'to' => $paginatedTransactions->lastItem(),
                ]
            ]);

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Error fetching earnings data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function generateIncomeReport(Request $request)
    {
        try {
            $sellerId = $this->seller_id;
            $period = $request->input('period', 'monthly');
            $startDate = $request->input('startDate');
            $endDate = $request->input('endDate');
            $format = $request->input('format', 'pdf');
            $includeChart = $request->input('includeChart', true);
            $includeTransactions = $request->input('includeTransactions', true);

            // Set date range based on period
            switch ($period) {
                case 'weekly':
                    $startDate = now()->startOfWeek()->format('Y-m-d');
                    $endDate = now()->format('Y-m-d');
                    break;
                case 'monthly':
                    $startDate = now()->startOfMonth()->format('Y-m-d');
                    $endDate = now()->format('Y-m-d');
                    break;
                case 'quarterly':
                    $startDate = now()->startOfQuarter()->format('Y-m-d');
                    $endDate = now()->format('Y-m-d');
                    break;
                case 'yearly':
                    $startDate = now()->startOfYear()->format('Y-m-d');
                    $endDate = now()->format('Y-m-d');
                    break;
                case 'custom':
                    // Use provided dates
                    break;
            }

            // Fetch earnings data for the period
            $query = Order::with(['user', 'orderItems.product'])
                ->where('seller_id', $sellerId)
                ->whereIn('order_status', ['Delivered', 'completed'])
                ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

            $transactions = $query->get();
            $totalEarnings = $transactions->sum('amount');
            $transactionCount = $transactions->count();

            // Prepare report data
            $reportData = [
                'period' => $period,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'generated_at' => now()->toDateTimeString(),
                'seller_info' => [
                    'name' => auth()->user()->name,
                    'email' => auth()->user()->email,
                ],
                'summary' => [
                    'total_earnings' => $totalEarnings,
                    'transaction_count' => $transactionCount,
                    'average_order_value' => $transactionCount > 0 ? $totalEarnings / $transactionCount : 0,
                ],
                'transactions' => $includeTransactions ? $transactions->map(function ($order) {
                    return [
                        'order_id' => $order->order_id,
                        'date' => $order->created_at->format('Y-m-d H:i:s'),
                        'customer_name' => $order->user->name ?? 'N/A',
                        'product_name' => $order->orderItems->first()->product->product_name ?? 'N/A',
                        'amount' => $order->amount,
                        'status' => $order->order_status,
                    ];
                }) : [],
            ];

            // Generate report based on format
            switch ($format) {
                case 'pdf':
                    return $this->generatePdfReport($reportData);
                default:
                    return response()->json(['error' => 'Unsupported format'], 400);
            }

        } catch (Exception $e) {
            return response()->json([
                'error' => 'Error generating report: ' . $e->getMessage()
            ], 500);
        }
    }

    private function generatePdfReport($data)
    {
        $html = view('reports.income-pdf', compact('data'))->render();

        $pdf = Pdf::loadHTML($html);
        return $pdf->download('income-report.pdf');
    }
}
