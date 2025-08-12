<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

use App\Mail\SellerApprovedMail;
use App\Mail\SellerRejectedMail;

use App\Models\SellerRegistration;

class AdminController extends Controller
{
    public function adminDashboard()
    {
        $list_sellerRegistration = SellerRegistration::with('business')
            ->where('status', 'Pending')
            ->take(3)
            ->get();

        return Inertia::render("AdminPage/AdminDashboard", ['list_sellerRegistration' => $list_sellerRegistration]);
    }

    public function transactionPage()
    {
        return Inertia::render("AdminPage/Transactions");
    }

    public function pendingSellerTable()
    {
        $list_sellerRegistration = SellerRegistration::with('business')
            ->where('status', 'Pending')
            ->paginate(10);

        return Inertia::render("AdminPage/PendingSellerTable", ['list_sellerRegistration' => $list_sellerRegistration]);
    }

    public function profilePage()
    {
        return Inertia::render("AdminPage/ProfilePage");
    }

    public function subscriptionManagement()
    {
        return Inertia::render("AdminPage/SubscriptionManagement");
    }

    public function subscriptionPolicy()
    {
        return Inertia::render("AdminPage/SubscriptionPolicy");
    }

    public function getSellerList()
    {
        $list_sellerRegistration = SellerRegistration::with('business')
            ->where('status', 'Pending')
            ->paginate(3);

        return response()->json($list_sellerRegistration);
    }

    public function handleAction(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:Approved,Rejected',
        ]);

        $seller = SellerRegistration::where('registration_id', $id)->firstOrFail();

        $seller->status = $request->action;
        $reason = $request->reason;

        $seller->save();

        // Send email based on action
        if ($request->action === 'Approved') {
            Mail::to($seller->email)->send(new SellerApprovedMail($seller));
        } else {
            Mail::to($seller->email)->send(new SellerRejectedMail($seller, $reason));
        }

        return response()->json([
            'successMessage' => "Seller has been {$request->action} successfully.",
        ]);
    }
}
