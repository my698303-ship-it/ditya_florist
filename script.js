// State Management untuk Keranjang Belanja
let cart = [];

// Data Nomor WhatsApp Florist
const PHONE_NUMBER = "6285184046709";

// Toggle Cart Drawer Display
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    drawer.classList.toggle('hidden');
}

// Filter Katalog Berdasarkan Kategori
function filterCategory(category) {
    const buttons = document.querySelectorAll('.cat-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Tambah Produk Ke Keranjang
function addToCart(id, name, price, image) {
    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ id, name, price, image, qty: 1 });
    }
    updateCartUI();
    toggleCart();
}

// Hapus atau Kurangi Item dari Keranjang
function updateQty(id, delta) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].qty += delta;
        if (cart[itemIndex].qty <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartUI();
}

// Update Render UI Keranjang & Badge Counter
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const cartTotal = document.getElementById('cart-total');

    let totalItemCount = 0;
    let totalPrice = 0;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-12 text-slate-400">
                <i class="fa-solid fa-basket-shopping text-4xl mb-3 text-rose-200"></i>
                <p class="text-sm">Keranjang Anda masih kosong.</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            totalItemCount += item.qty;
            totalPrice += item.price * item.qty;

            const itemEl = document.createElement('div');
            itemEl.className = 'flex items-center justify-between p-3 bg-rose-50/60 rounded-xl border border-rose-100';
            itemEl.innerHTML = `
                <div class="flex items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg border border-rose-200">
                    <div>
                        <h4 class="text-xs font-bold text-slate-800 line-clamp-1">${item.name}</h4>
                        <p class="text-xs font-semibold text-rose-600">Rp ${item.price.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="updateQty(${item.id}, -1)" class="w-7 h-7 bg-white border border-rose-200 rounded-full text-slate-600 text-xs hover:bg-rose-100 flex items-center justify-center font-bold">-</button>
                    <span class="text-xs font-bold text-slate-800">${item.qty}</span>
                    <button onclick="updateQty(${item.id}, 1)" class="w-7 h-7 bg-white border border-rose-200 rounded-full text-slate-600 text-xs hover:bg-rose-100 flex items-center justify-center font-bold">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    cartBadge.innerText = totalItemCount;
    cartTotal.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
}

// Checkout & Generasi Formatted Text ke WhatsApp
function checkoutWA() {
    if (cart.length === 0) {
        alert('Keranjang Anda masih kosong. Silahkan pilih rangkaian bunga terlebih dahulu.');
        return;
    }

    const name = document.getElementById('cust-name').value.trim() || 'Pelanggan';
    const notes = document.getElementById('cust-notes').value.trim() || 'Tidak ada catatan ucapan';

    let message = `Halo Bunga Ditya Florist, saya ingin melakukan pemesanan bunga dengan rincian berikut:\n\n`;
    message += `*Nama Pemesan:* ${name}\n`;
    message += `*Catatan/Ucapan Pita:* ${notes}\n\n`;
    message += `*Rincian Pesanan:*\n`;

    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        message += `${index + 1}. ${item.name} x${item.qty} - Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*Total Pembayaran:* Rp ${total.toLocaleString('id-ID')}\n`;
    message += `*Alamat Pengiriman:* Gulai Bancah, Bukittinggi (atau konfirmasi rute)\n\n`;
    message += `Mohon diproses, terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;

    window.open(waUrl, '_blank');
}