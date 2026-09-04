// Management Keranjang Belanja via LocalStorage

// Mengambil keranjang dari localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart_rizki_store')) || [];
}

// Menyimpan keranjang ke localStorage
function saveCart(cart) {
    localStorage.setItem('cart_rizki_store', JSON.stringify(cart));
    updateCartCount();
}

// Mengubah Format Angka ke Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}

// Memperbarui Badge Hitungan Keranjang pada Navbar
function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.innerText = totalCount;
    }
}

// Menambahkan Produk ke Keranjang
function addToCart(id, name, price, image) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    saveCart(cart);
    alert(`${name} telah ditambahkan ke keranjang!`);
}

// Mengubah Kuantitas Barang
function updateQuantity(id, change) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }

    saveCart(cart);
    renderCartPage();
}

// Menghapus Item dari Keranjang
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCartPage();
}

// Melakukan Render Isi Halaman Keranjang Belanja (cart.html)
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return; // Jika tidak di halaman cart.html, hentikan

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fa-solid fa-cart-shopping text-5xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 font-semibold">Keranjang belanja Anda masih kosong.</p>
                <a href="index.html" class="inline-block mt-4 text-indigo-600 font-medium hover:underline">Mulai Belanja</a>
            </div>
        `;
        document.getElementById('subtotal').innerText = formatRupiah(0);
        document.getElementById('total-price').innerText = formatRupiah(0);
        return;
    }

    let html = '<div class="divide-y divide-gray-200">';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div class="py-4 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                    <div>
                        <h4 class="font-bold text-gray-800">${item.name}</h4>
                        <p class="text-indigo-600 text-sm font-semibold">${formatRupiah(item.price)}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex items-center border rounded">
                        <button onclick="updateQuantity('${item.id}', -1)" class="px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200">-</button>
                        <span class="px-3 py-1 font-semibold">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" class="px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200">+</button>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" class="text-red-500 hover:text-red-700">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;

    document.getElementById('subtotal').innerText = formatRupiah(total);
    document.getElementById('total-price').innerText = formatRupiah(total);
}

// Simulasi Checkout
function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }

    alert('Terima kasih! Pesanan Anda berhasil diproses.');
    localStorage.removeItem('cart_rizki_store');
    window.location.href = 'index.html';
}

// Simulasi Kirim Form Kontak
function handleContactSubmit(event) {
    event.preventDefault();
    alert('Pesan Anda telah berhasil dikirim! Kami akan merespons secepatnya.');
    document.getElementById('contactForm').reset();
}

// Inisialisasi saat Halaman Dimuat
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});