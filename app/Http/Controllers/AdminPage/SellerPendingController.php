<?php

namespace App\Http\Controllers\AdminPage;

use App\Events\BuyerPage\SellerRegistration\SellerRegistered;
use App\Http\Controllers\Controller;
use App\Mail\SellerApprovedMail;
use App\Mail\SellerRejectedMail;
use App\Models\Seller;
use App\Models\SellerRegistration;
use App\Models\SellerStore;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SellerPendingController extends Controller
{
    public function getSellerList(Request $request)
    {
        $query = SellerRegistration::with('business');

        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('store_name', 'like', "%{$search}%")
                    ->orWhere('registration_id', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')
                ->paginate($request->integer('per_page', 5))
        );
    }

    public function handleAction(Request $request, string $id)
    {
        $validated = $request->validate([
            'action' => ['required', 'in:Approved,Rejected'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $registration = SellerRegistration::where('registration_id', $id)->firstOrFail();

        if ($validated['action'] === 'Approved') {
            return $this->approveSeller($registration);
        }

        return $this->rejectSeller($registration, $validated['reason'] ?? null);
    }

    private function approveSeller(SellerRegistration $registration)
    {
        DB::transaction(function () use ($registration) {
            $storeId = $this->nextStoreId();

            SellerStore::firstOrCreate(
                ['store_id' => $storeId],
                [
                    'store_name' => $registration->store_name,
                    'store_description' => $registration->store_description,
                    'store_address' => $registration->store_address,
                    'store_phone' => $registration->phone_number,
                    'store_image' => $registration->verification_image ?? 'image/seller_bg.jpg',
                ]
            );

            Seller::updateOrCreate(
                ['seller_id' => $registration->registration_id],
                [
                    'seller_name' => $registration->name,
                    'seller_email' => $registration->email,
                    'seller_phone' => $registration->phone_number,
                    'store_id' => $storeId,
                    'business_id' => $registration->business_id,
                    'is_verified' => true,
                ]
            );

            User::where('email', $registration->email)->update([
                'role_id' => 'ReLo-S0001',
                'seller_id' => $registration->registration_id,
                'phone' => $registration->phone_number,
            ]);

            $registration->update(['status' => 'Approved']);
        });

        $registration->refresh()->load('business');
        $this->sendSellerMail($registration, 'Approved');
        broadcast(new SellerRegistered($registration, 'Approved'));

        return response()->json([
            'successMessage' => 'Seller request approved successfully.',
            'seller' => $registration,
        ]);
    }

    private function rejectSeller(SellerRegistration $registration, ?string $reason)
    {
        $registration->update(['status' => 'Rejected']);
        $registration->refresh()->load('business');

        $this->sendSellerMail($registration, 'Rejected', $reason);
        broadcast(new SellerRegistered($registration, 'Rejected'));

        return response()->json([
            'successMessage' => 'Seller request rejected successfully.',
            'seller' => $registration,
        ]);
    }

    private function nextStoreId(): string
    {
        $lastStore = SellerStore::orderBy('store_id', 'desc')->first();
        $lastNumber = 0;

        if ($lastStore && preg_match('/STORE(\d+)/', $lastStore->store_id, $matches)) {
            $lastNumber = (int) $matches[1];
        }

        return 'STORE' . str_pad($lastNumber + 1, 5, '0', STR_PAD_LEFT);
    }

    private function sendSellerMail(SellerRegistration $registration, string $action, ?string $reason = null): void
    {
        try {
            if ($action === 'Approved') {
                Mail::to($registration->email)->send(new SellerApprovedMail($registration));
                return;
            }

            Mail::to($registration->email)->send(new SellerRejectedMail($registration, $reason));
        } catch (\Throwable $exception) {
            Log::warning('Seller registration email failed', [
                'registration_id' => $registration->registration_id,
                'action' => $action,
                'message' => $exception->getMessage(),
            ]);
        }
    }
}
