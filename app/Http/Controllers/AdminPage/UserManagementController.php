<?php

namespace App\Http\Controllers\AdminPage;

use App\Http\Controllers\Controller;

use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserManagementController extends Controller
{
    public function getUserList(Request $request)
    {
        try {
            $query = User::with('role');

            // Filter by role
            if ($request->has('role') && $request->role !== 'All') {
                $query->whereHas('role', function ($q) use ($request) {
                    $q->where('role_name', $request->role);
                });
            }

            // Filter by status
            if ($request->has('status') && $request->status !== 'All') {
                $query->where('status', $request->status);
            }

            // Search by name or email
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 10);
            $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json($users);

        } catch (\Exception $e) {
            \Log::error('Error fetching users: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch users'], 500);
        }
    }

    public function handleUserActions(Request $request)
    {
        try {
            $request->validate([
                'action' => 'required|in:block,unblock,delete',
                'user_ids' => 'required|array',
                'user_ids.*' => 'exists:users,user_id'
            ]);

            DB::beginTransaction();

            $userIds = $request->user_ids;
            $action = $request->action;

            switch ($action) {
                case 'block':
                    User::whereIn('user_id', $userIds)->update(['status' => 'Blocked']);
                    $message = count($userIds) . ' user(s) blocked successfully';
                    break;

                case 'unblock':
                    User::whereIn('user_id', $userIds)->update(['status' => 'Active']);
                    $message = count($userIds) . ' user(s) unblocked successfully';
                    break;

                case 'delete':
                    User::whereIn('user_id', $userIds)->delete();
                    $message = count($userIds) . ' user(s) deleted successfully';
                    break;

                default:
                    throw new \Exception('Invalid action');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $message
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error performing user action: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to perform action'
            ], 500);
        }
    }

    public function getUserStats()
    {
        try {
            $stats = [
                'total' => User::count(),
                'active' => User::where('status', 'Active')->count(),
                'blocked' => User::where('status', 'Blocked')->count(),
                'pending' => User::where('status', 'Pending')->count(),
                'buyers' => User::whereHas('role', function ($q) {
                    $q->where('role_name', 'Buyer');
                })->count(),
                'sellers' => User::whereHas('role', function ($q) {
                    $q->where('role_name', 'Seller');
                })->count(),
                'admins' => User::whereHas('role', function ($q) {
                    $q->where('role_name', 'Admin');
                })->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            \Log::error('Error fetching user stats: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch stats'], 500);
        }
    }
}