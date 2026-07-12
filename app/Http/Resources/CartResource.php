<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'selected_quantity' => $this->selected_quantity,

            'selected_variant' => $this->selected_variant ? json_decode($this->selected_variant, true) : null,

            'product' => [
                'product_id' => $this->product->product_id,
                'product_name' => $this->product->product_name,
                'product_price' => $this->product->product_price,
                'product_quantity' => $this->product->product_quantity,
                'product_condition' => $this->product->product_condition,
                'product_image' => $this->product->productImage()->first()->image_path ?? null,
                'featured' => $this->product->featured,
                'total_ratings' => $this->product->total_ratings,

                'seller' => $this->product->seller ? [
                    'seller_id' => $this->product->seller->seller_id ?? null,
                    'seller_store' => $this->product->seller->sellerStore ? [
                        'store_name' => $this->product->seller->sellerStore->store_name ?? null,
                    ] : null,
                ] : null,

                'category' => $this->product->category ? [
                    'category_id' => $this->product->category->category_id ?? null,
                    'category_name' => $this->product->category->category_name ?? null,
                ] : null,

                // Product Variants（只选需要的）
                'product_variant' => $this->productVariant->map(function ($variant) {
                    return [
                        'variant_id' => $variant->variant_id,
                        'variant_combination' => $variant->variant_combination ? json_decode($variant->variant_combination, true) : null,
                        'variant_key' => $variant->variant_key,
                        'quantity' => $variant->quantity,
                        'price' => $variant->price,
                    ];
                }),

                // 时间戳（可选）
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ]
        ];
    }
}
