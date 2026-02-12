// ============================================
// NEXASTORE - Aplikasi E-Commerce
// Fungsi Cart, Wishlist, dan LocalStorage
// ============================================

// ============================================
// LOCALSTORAGE UTILITIES
// ============================================

// Key untuk LocalStorage
const STORAGE_KEYS = {
  CART: 'nexastore_cart',
  WISHLIST: 'nexastore_wishlist',
  ORDERS: 'nexastore_orders',
  USER: 'nexastore_user'
};

// Ambil data dari LocalStorage
function getFromStorage(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error reading from LocalStorage:', error);
    return defaultValue;
  }
}

// Simpan data ke LocalStorage
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to LocalStorage:', error);
  }
}

// ============================================
// CART FUNCTIONS
// ============================================

// Ambil cart dari LocalStorage
function getCart() {
  return getFromStorage(STORAGE_KEYS.CART, []);
}

// Simpan cart ke LocalStorage
function saveCart(cart) {
  saveToStorage(STORAGE_KEYS.CART, cart);
  updateCartCount();
}

// Tambah produk ke cart
function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const product = products.find(p => p.id === parseInt(productId));
  
  if (!product) {
    showToast('Produk tidak ditemukan', 'error');
    return false;
  }
  
  if (product.stock < quantity) {
    showToast('Stok produk tidak mencukupi', 'error');
    return false;
  }
  
  const existingItem = cart.find(item => item.id === parseInt(productId));
  
  if (existingItem) {
    const newQty = existingItem.qty + quantity;
    if (newQty > product.stock) {
      showToast('Stok produk tidak mencukupi', 'error');
      return false;
    }
    existingItem.qty = newQty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      qty: quantity,
      stock: product.stock
    });
  }
  
  saveCart(cart);
  showToast('Produk berhasil ditambahkan ke keranjang', 'success');
  return true;
}

// Update quantity produk di cart
function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(item => item.id === parseInt(productId));
  
  if (item) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (qty > item.stock) {
      showToast('Stok produk tidak mencukupi', 'error');
      return;
    }
    
    item.qty = qty;
    saveCart(cart);
    
    // Update tampilan cart jika di halaman cart
    if (document.querySelector('.cart-page')) {
      renderCart();
    }
  }
}

// Hapus produk dari cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== parseInt(productId));
  saveCart(cart);
  showToast('Produk dihapus dari keranjang', 'info');
  
  // Update tampilan cart jika di halaman cart
  if (document.querySelector('.cart-page')) {
    renderCart();
  }
}

// Kosongkan cart
function clearCart() {
  saveToStorage(STORAGE_KEYS.CART, []);
  updateCartCount();
}

// Hitung total item di cart
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.qty, 0);
}

// Hitung total harga cart
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

// Update cart count di navbar
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  const count = getCartItemCount();
  
  cartCountElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ============================================
// WISHLIST FUNCTIONS
// ============================================

// Ambil wishlist dari LocalStorage
function getWishlist() {
  return getFromStorage(STORAGE_KEYS.WISHLIST, []);
}

// Simpan wishlist ke LocalStorage
function saveWishlist(wishlist) {
  saveToStorage(STORAGE_KEYS.WISHLIST, wishlist);
  updateWishlistCount();
}

// Tambah/hapus produk dari wishlist (toggle)
function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(parseInt(productId));
  
  if (index > -1) {
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
    showToast('Produk dihapus dari wishlist', 'info');
    return false; // Removed
  } else {
    wishlist.push(parseInt(productId));
    saveWishlist(wishlist);
    showToast('Produk ditambahkan ke wishlist', 'success');
    return true; // Added
  }
}

// Cek apakah produk di wishlist
function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(parseInt(productId));
}

// Update wishlist count di navbar
function updateWishlistCount() {
  const wishlistCountElements = document.querySelectorAll('.wishlist-count');
  const count = getWishlist().length;
  
  wishlistCountElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ============================================
// ORDER FUNCTIONS
// ============================================

// Ambil orders dari LocalStorage
function getOrders() {
  return getFromStorage(STORAGE_KEYS.ORDERS, []);
}

// Simpan order baru
function placeOrder(orderData) {
  const orders = getOrders();
  const cart = getCart();
  
  if (cart.length === 0) {
    showToast('Keranjang belanja kosong', 'error');
    return false;
  }
  
  const newOrder = {
    id: 'ORD-' + Date.now(),
    items: [...cart],
    customer: orderData,
    status: 'Processing',
    date: new Date().toISOString(),
    total: getCartTotal()
  };
  
  orders.unshift(newOrder);
  saveToStorage(STORAGE_KEYS.ORDERS, orders);
  clearCart();
  
  showToast('Pesanan berhasil dibuat!', 'success');
  return true;
}

// Update status order (untuk demo)
function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (order) {
    order.status = status;
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return true;
  }
  return false;
}

// ============================================
// UI RENDER FUNCTIONS
// ============================================

// Render bintang rating
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let starsHTML = '';
  
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  }
  
  if (hasHalfStar) {
    starsHTML += `<svg fill="currentColor" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="#e2e8f0"/></linearGradient></defs><path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  }
  
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<svg fill="#e2e8f0" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  }
  
  return starsHTML;
}

// Render product card
function renderProductCard(product) {
  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  
  return `
    <div class="product-card slide-up">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.isSale ? `<span class="product-badge badge-sale">-${discount}%</span>` : ''}
        ${product.isNew ? `<span class="product-badge badge-new">NEW</span>` : ''}
        <button class="wishlist-btn ${inWishlist ? 'active' : ''}" onclick="handleWishlistClick(event, ${product.id})" title="${inWishlist ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}">
          <svg fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
        <div class="product-rating">
          <div class="stars">${renderStars(product.rating)}</div>
          <span class="rating-count">(${product.reviewCount})</span>
        </div>
        <div class="product-price">
          <span class="current-price">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <button class="add-to-cart" onclick="addToCart(${product.id}); return false;">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  `;
}

// Render produk grid
function renderProductGrid(containerId, productsList) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (productsList.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" style="margin-bottom: 20px;">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <h3>Tidak ada produk</h3>
        <p style="color: #64748b;">Produk yang Anda cari tidak ditemukan</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = productsList.map(product => renderProductCard(product)).join('');
}

// Handle wishlist click
function handleWishlistClick(event, productId) {
  event.preventDefault();
  event.stopPropagation();
  
  const isAdded = toggleWishlist(productId);
  const btn = event.currentTarget;
  
  if (isAdded) {
    btn.classList.add('active');
    btn.querySelector('svg').setAttribute('fill', 'currentColor');
  } else {
    btn.classList.remove('active');
    btn.querySelector('svg').setAttribute('fill', 'none');
  }
  
  // Refresh wishlist page if on wishlist page
  if (document.querySelector('.wishlist-page')) {
    renderWishlist();
  }
}

// ============================================
// TOAST NOTIFICATION
// ============================================

// Tampilkan toast notification
function showToast(message, type = 'info') {
  // Buat container jika belum ada
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  // Icon berdasarkan type
  const icons = {
    success: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`,
    error: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`,
    info: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
  };
  
  const titles = {
    success: 'Berhasil!',
    error: 'Error!',
    info: 'Info'
  };
  
  // Buat toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-content">
      <div class="toast-title">${titles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  `;
  
  container.appendChild(toast);
  
  // Auto remove setelah 3 detik
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ============================================
// NAVBAR & FOOTER
// ============================================

// Render navbar
function renderNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navbar.innerHTML = `
    <div class="container">
      <a href="index.html" class="logo">NexaStore</a>
      
      <nav class="nav-links">
        <a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a>
        <a href="shop.html" class="${currentPage === 'shop.html' ? 'active' : ''}">Shop</a>
        <a href="wishlist.html" class="${currentPage === 'wishlist.html' ? 'active' : ''}">Wishlist</a>
        <a href="orders.html" class="${currentPage === 'orders.html' ? 'active' : ''}">Pesanan</a>
      </nav>
      
      <div class="nav-actions">
        <a href="wishlist.html" class="nav-icon" title="Wishlist">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          <span class="cart-count wishlist-count" style="display: none;">0</span>
        </a>
        <a href="cart.html" class="nav-icon" title="Keranjang">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span class="cart-count" style="display: none;">0</span>
        </a>
        <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <div class="mobile-menu" style="display: none; position: absolute; top: 70px; left: 0; right: 0; background: white; box-shadow: var(--shadow); padding: 20px;">
      <nav style="display: flex; flex-direction: column; gap: 16px;">
        <a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a>
        <a href="shop.html" class="${currentPage === 'shop.html' ? 'active' : ''}">Shop</a>
        <a href="wishlist.html" class="${currentPage === 'wishlist.html' ? 'active' : ''}">Wishlist</a>
        <a href="orders.html" class="${currentPage === 'orders.html' ? 'active' : ''}">Pesanan</a>
      </nav>
    </div>
  `;
  
  updateCartCount();
  updateWishlistCount();
}

// Toggle mobile menu
function toggleMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu) {
    mobileMenu.style.display = mobileMenu.style.display === 'none' ? 'block' : 'none';
  }
}

// Render footer
function renderFooter() {
  const footer = document.querySelector('.footer');
  if (!footer) return;
  
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo" style="color: white; -webkit-text-fill-color: white;">NexaStore</a>
          <p>Toko online terpercaya dengan produk berkualitas. Nikmati pengalaman belanja yang mudah, aman, dan nyaman.</p>
          <div class="social-links">
            <a href="#" title="Facebook"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a href="#" title="Instagram"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
            <a href="#" title="Twitter"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
          </div>
        </div>
        
        <div class="footer-links">
          <h4>Menu</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="cart.html">Keranjang</a></li>
            <li><a href="wishlist.html">Wishlist</a></li>
          </ul>
        </div>
        
        <div class="footer-links">
          <h4>Bantuan</h4>
          <ul>
            <li><a href="#">Cara Belanja</a></li>
            <li><a href="#">Pengiriman</a></li>
            <li><a href="#">Pengembalian</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        
        <div class="footer-links">
          <h4>Kontak</h4>
          <ul>
            <li><a href="#">support@nexastore.com</a></li>
            <li><a href="#">+62 812-3456-7890</a></li>
            <li><a href="#">Jakarta, Indonesia</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 NexaStore. All rights reserved.</p>
      </div>
    </div>
  `;
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize saat DOM ready
document.addEventListener('DOMContentLoaded', function() {
  renderNavbar();
  renderFooter();
  updateCartCount();
  updateWishlistCount();
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get URL parameter
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Format tanggal
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Debounce function untuk search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
