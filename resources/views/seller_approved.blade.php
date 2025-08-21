<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Seller Approval</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100">
    <div class="max-w-xl mx-auto my-10 bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-green-600 p-6 text-white text-center">
            <h1 class="text-2xl font-bold">🎉 Congratulations!</h1>
        </div>
        <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-800">Hi {{ $seller->name }},</h2>
            <p class="mt-4 text-gray-600">
                Your seller registration has been <span class="font-bold text-green-600">approved</span>!
            </p>
            <p class="mt-2 text-gray-600">
                You can now start listing your products and grow your business with us.
            </p>

            <div class="mt-6 text-center">
                <a href="{{ route('homepage') }}"
                    class="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow">
                    Go to Relove Market
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
