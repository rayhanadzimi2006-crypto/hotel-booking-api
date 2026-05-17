<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Customer</title>

    @vite('resources/css/app.css')
</head>
<body class="bg-gray-100">

<div class="max-w-2xl mx-auto p-6">

    <!-- BACK BUTTON -->
    <a href="{{ url('/customers') }}"
       class="inline-block mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
        ← Back
    </a>

    <h1 class="text-3xl font-bold mb-6">Add Customer</h1>

    <!-- ERROR TOAST -->
    @if ($errors->any())
        <div id="toast"
             class="mb-4 p-4 bg-red-500 text-white rounded shadow-lg">
            <ul class="list-disc pl-5">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>

        <script>
            setTimeout(() => {
                const toast = document.getElementById('toast');
                if (toast) toast.style.display = 'none';
            }, 3000);
        </script>
    @endif

    <!-- FORM -->
    <form action="/customers" method="POST"
          class="bg-white p-6 rounded shadow">

        @csrf

        <div class="mb-4">
            <label class="block mb-2">Name</label>
            <input type="text"
                   name="name"
                   value="{{ old('name') }}"
                   class="w-full border p-2 rounded">
        </div>

        <div class="mb-4">
            <label class="block mb-2">Email</label>
            <input type="email"
                   name="email"
                   value="{{ old('email') }}"
                   class="w-full border p-2 rounded">
        </div>

        <div class="mb-4">
            <label class="block mb-2">Phone</label>
            <input type="text"
                   name="phone"
                   value="{{ old('phone') }}"
                   class="w-full border p-2 rounded">
        </div>

        <div class="mb-4">
            <label class="block mb-2">Address</label>
            <textarea name="address"
                      class="w-full border p-2 rounded">{{ old('address') }}</textarea>
        </div>

        <button type="submit"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save
        </button>

    </form>

</div>

</body>
</html>