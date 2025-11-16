<?php

namespace App\Http\Controllers\BuyerPage;

use App\Http\Controllers\Controller;

use App\Models\Product;

use DB;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class HomePageController extends Controller
{
    public function cameraSearch(Request $request)
    {
        // Validate uploaded image
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        try {
            \Log::info('Starting camera search');

            // Send image to ML service
            $response = Http::timeout(60)
                ->attach('image', file_get_contents($request->file('image')->getRealPath()), 'photo.jpg')
                ->post(env('ML_SERVICE_URL') . '/camera_recommend/', ['top_k' => 10]);

            if (!$response->successful()) {
                \Log::error('ML service error: ' . $response->body());
                return response()->json(['error' => 'Image processing service unavailable'], 500);
            }

            $data = $response->json();
            \Log::info('ML service response', $data);

            // Check if ML service returned an error
            if (isset($data['error'])) {
                return response()->json([
                    'error' => 'No similar products found',
                    'detected_category' => $data['detected_category'] ?? 'unknown',
                    'category_confidence' => $data['category_confidence'] ?? 0
                ], 404);
            }

            $recommendations = $data['recommendations'] ?? [];

            if (empty($recommendations)) {
                return response()->json([
                    'error' => 'No similar products found',
                    'detected_category' => $data['detected_category'] ?? 'unknown',
                    'category_confidence' => $data['category_confidence'] ?? 0
                ], 404);
            }

            \Log::info('Found ML recommendations', ['count' => count($recommendations)]);

            // ✅ ADD SIMILARITY THRESHOLD - Filter out low similarity matches
            $similarityThreshold = 0.70; // 70% similarity threshold
            $filteredRecommendations = collect($recommendations)
                ->filter(function ($rec) use ($similarityThreshold) {
                    $similarity = $rec['similarity'] ?? 0;
                    \Log::info("Similarity check", [
                        'product' => $rec['name'] ?? $rec['product_id'],
                        'similarity' => $similarity,
                        'passes_threshold' => $similarity >= $similarityThreshold
                    ]);
                    return $similarity >= $similarityThreshold;
                })
                ->values()
                ->toArray();

            \Log::info('After similarity filtering', [
                'original_count' => count($recommendations),
                'filtered_count' => count($filteredRecommendations),
                'threshold' => $similarityThreshold
            ]);

            // ✅ If no products pass the similarity threshold, return "not found"
            if (empty($filteredRecommendations)) {
                $topSimilarity = collect($recommendations)->max('similarity') ?? 0;
                return response()->json([
                    'error' => 'No similar products found',
                    'message' => 'The uploaded image does not match any products in our database',
                    'detected_category' => $data['detected_category'] ?? 'unknown',
                    'category_confidence' => $data['category_confidence'] ?? 0,
                    'closest_match_similarity' => round($topSimilarity, 4),
                    'similarity_threshold' => $similarityThreshold,
                    'note' => 'Try uploading a clearer image or different product'
                ], 404);
            }

            // Use the filtered recommendations
            $recommendations = $filteredRecommendations;

            // Extract product IDs from filtered ML recommendations
            $productIds = collect($recommendations)->pluck('product_id')->filter()->toArray();

            \Log::info('Product IDs to fetch after filtering', $productIds);

            // Fetch products from Laravel
            $products = Product::with([
                'productImage',
                'productVideo',
                'productFeature',
                'productIncludeItem',
                'productVariant',
                'ratings',
                'category',
                'seller.sellerStore'
            ])
                ->whereIn('product_id', $productIds)
                ->get();

            \Log::info('Products found in Laravel', ['count' => $products->count()]);

            // Manually get the first image for each product
            $productImages = [];
            if ($products->isNotEmpty()) {
                $imageResults = DB::table('product_images')
                    ->whereIn('product_id', $productIds)
                    ->get()
                    ->groupBy('product_id');

                foreach ($imageResults as $productId => $images) {
                    $productImages[$productId] = $images->first();
                }
            }

            foreach ($products as $product) {
                \Log::info('Product seller info', [
                    'product_id' => $product->product_id,
                    'seller' => $product->seller ? $product->seller->toArray() : null,
                    'sellerStore' => $product->seller && $product->seller->sellerStore ? $product->seller->sellerStore->toArray() : null
                ]);
            }

            // Combine ML similarity data with Laravel product data
            $finalResults = collect($recommendations)
                ->map(function ($rec) use ($products, $productImages) {
                    $product = $products->firstWhere('product_id', $rec['product_id']);

                    if (!$product) {
                        \Log::warning('Product not found in database', ['product_id' => $rec['product_id']]);
                        return null;
                    }

                    // Get the first product image manually
                    $productImage = $productImages[$rec['product_id']] ?? null;
                    $imagePath = $productImage ? $productImage->image_path : null;

                    return [
                        'product_id' => $product->product_id,
                        'name' => $product->product_name,
                        'category' => $product->category->category_name ?? 'unknown',
                        'similarity' => $rec['similarity'],
                        'similarity_percentage' => round($rec['similarity'] * 100, 1), // Add percentage
                        'image_path' => $imagePath,
                        'product' => [
                            'product_id' => $product->product_id,
                            'product_name' => $product->product_name,
                            'product_price' => $product->product_price,
                            'product_quantity' => $product->product_quantity,
                            'product_status' => $product->product_status,
                            'total_ratings' => $product->total_ratings,
                            "ratings" => $product->ratings,
                            'category' => $product->category ? [
                                'category_id' => $product->category->category_id,
                                'category_name' => $product->category->category_name
                            ] : null,
                            'seller' => $product->seller ? [
                                'seller_id' => $product->seller->seller_id,
                                'store_name' => $product->seller->seller_store->store_name
                                    ?? $product->seller->sellerStore->store_name
                                    ?? 'Unknown Store'
                            ] : null,
                            'images' => $product->productImage->map(function ($image) {
                                return [
                                    'image_path' => $image->image_path,
                                ];
                            })->toArray(),
                            'main_image' => $imagePath,
                        ],

                    ];
                })
                ->filter()
                ->values();

            \Log::info('Final results after filtering', ['count' => $finalResults->count()]);

            if ($finalResults->isEmpty()) {
                return response()->json([
                    'error' => 'Products not found in database',
                    'detected_category' => $data['detected_category'] ?? 'unknown',
                    'category_confidence' => $data['category_confidence'] ?? 0,
                    'debug' => [
                        'ml_recommendations' => count($recommendations),
                        'searched_ids' => $productIds,
                        'available_products' => $products->pluck('product_id')
                    ]
                ], 404);
            }

            return response()->json([
                'detected_category' => $data['detected_category'] ?? 'unknown',
                'category_confidence' => $data['category_confidence'] ?? 0,
                'recommendations' => $finalResults,
                'total_found' => $finalResults->count(),
                'search_metrics' => $data['search_metrics'] ?? [],
                'similarity_threshold' => $similarityThreshold, // Include threshold in response
                'top_similarity' => collect($finalResults)->max('similarity') ?? 0
            ]);

        } catch (Exception $e) {
            \Log::error('Camera search error: ' . $e->getMessage());
            return response()->json(['error' => 'Search failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Manual vector search using raw SQL
     */
    private function manualVectorSearch($embeddingArray)
    {
        try {
            // Convert array to pgvector string format: [1.0, 2.0, 3.0, ...]
            $vectorString = '[' . implode(',', $embeddingArray) . ']';

            // Use raw SQL with proper casting
            $results = DB::select("
            SELECT 
                product_id,
                name,
                category,
                (1 - (embedding <=> ?::vector)) as similarity
            FROM product_embeddings 
            WHERE (1 - (embedding <=> ?::vector)) >= 0.6
            ORDER BY similarity DESC
            LIMIT 10
        ", [$vectorString, $vectorString]);

            return $results;

        } catch (Exception $e) {
            \Log::error('Manual vector search failed: ' . $e->getMessage());

            // Fallback to PHP-based similarity calculation
            return $this->phpSimilaritySearch($embeddingArray);
        }
    }

    /**
     * PHP-based similarity search as fallback
     */
    private function phpSimilaritySearch($queryEmbedding, $threshold = 0.6, $limit = 10)
    {
        // Get all embeddings
        $embeddings = DB::table('product_embeddings')
            ->select('product_id', 'name', 'category', 'embedding')
            ->get();

        $similarProducts = [];

        foreach ($embeddings as $embedding) {
            $productVector = json_decode($embedding->embedding, true);

            if (!is_array($productVector)) {
                continue;
            }

            $similarity = $this->cosineSimilarity($queryEmbedding, $productVector);

            if ($similarity >= $threshold) {
                $similarProducts[] = [
                    'product_id' => $embedding->product_id,
                    'name' => $embedding->name,
                    'category' => $embedding->category,
                    'similarity' => $similarity
                ];
            }
        }

        // Sort by similarity
        usort($similarProducts, function ($a, $b) {
            return $b['similarity'] <=> $a['similarity'];
        });

        return array_slice($similarProducts, 0, $limit);
    }

    /**
     * Convert hex string to float array
     */
    private function hexToFloatArray($hexString)
    {
        $binaryData = hex2bin($hexString);
        $floatArray = [];

        // Convert every 4 bytes to a float
        for ($i = 0; $i < strlen($binaryData); $i += 4) {
            $float = unpack('f', substr($binaryData, $i, 4));
            $floatArray[] = $float[1];
        }

        return $floatArray;
    }

    /**
     * Calculate cosine similarity
     */
    private function cosineSimilarity($vecA, $vecB)
    {
        $dotProduct = 0;
        $normA = 0;
        $normB = 0;

        $length = min(count($vecA), count($vecB));

        for ($i = 0; $i < $length; $i++) {
            $dotProduct += $vecA[$i] * $vecB[$i];
            $normA += $vecA[$i] * $vecA[$i];
            $normB += $vecB[$i] * $vecB[$i];
        }

        if ($normA == 0 || $normB == 0) {
            return 0;
        }

        return $dotProduct / (sqrt($normA) * sqrt($normB));
    }

    /**
     * Helper function to add embeddings to database
     */
    public function addProductEmbedding($productId, $name, $category, $embeddingArray)
    {
        $vectorString = '[' . implode(',', $embeddingArray) . ']';

        DB::table('product_embeddings')->updateOrInsert(
            ['product_id' => $productId],
            [
                'name' => $name,
                'category' => $category,
                'embedding' => json_encode($embeddingArray),
                'updated_at' => now()
            ]
        );
    }

    public static function testPgVector()
    {
        try {
            // Test 1: Check if extension exists
            $extension = DB::select("SELECT * FROM pg_extension WHERE extname = 'vector'");
            if (empty($extension)) {
                return response()->json(['error' => 'Vector extension not installed'], 500);
            }

            // Test 2: Simple vector operation
            $test = DB::select("SELECT vector '[1,1,1]' <=> vector '[1,1,1]' as distance");
            $distance = $test[0]->distance;

            // Test 3: Check our table structure
            $tableInfo = DB::select("
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'product_embeddings' 
            AND column_name = 'embedding'
        ");

            return response()->json([
                'vector_extension' => 'installed',
                'vector_test' => $distance === 0.0 ? 'working' : 'problem',
                'table_column_type' => $tableInfo[0]->data_type ?? 'not_found'
            ]);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Code for fetching the featured product on home page.
    public function get_featuredProducts()
    {
        try {
            $featured_products = Product::with([
                "seller.sellerStore",
                "ratings",
                'category',
                "productImage",
                "productVariant",
                "orderItems"
            ])
                ->where("featured", true)
                ->get();

            return response()->json([
                "featured_products" => $featured_products
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }

    // Code for fetching the flash sale product on home page.
    public function get_flashSaleProducts()
    {
        try {
            $flash_sale_products = Product::with([
                "productImage"
            ])
                ->where("flash_sale", true)
                ->get();

            return response()->json([
                "flash_sale_products" => $flash_sale_products
            ]);
        } catch (Exception $e) {
            return response()->json([
                "errorMessage" => $e->getMessage()
            ]);
        }
    }
}
