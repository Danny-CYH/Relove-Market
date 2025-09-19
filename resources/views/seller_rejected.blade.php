<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Seller Application Rejected</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100">
    <div class="max-w-xl mx-auto my-10 bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-red-600 p-6 text-white text-center">
            <h1 class="text-2xl font-bold">❌ Application Update</h1>
        </div>
        <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-800">Hi {{ $sellerRegistered->name }},</h2>
            <p class="mt-4 text-gray-600">
                We regret to inform you that your seller application has been
                <span class="font-bold text-red-600">rejected</span>.
            </p>

            <p class="mt-4 text-gray-800 font-semibold">Reason for rejection:</p>
            <p class="mt-1 text-gray-600 italic">
                {{ $reason }}
            </p>

            <p class="mt-4 text-gray-600">
                You are welcome to re-apply after addressing the issues mentioned above.
            </p>

            <div class="mt-6 text-center">
                <a href="{{ route('seller-registration') }}" target="_blank"
                    class="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow">
                    Reapply Now
                </a>
            </div>

            <p class="mt-6 text-gray-500 text-sm">
                Thank you,<br>
                The Relove Market Team
            </p>
        </div>
    </div>
</body>

</html>
