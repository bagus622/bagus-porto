// ============================================
// NEXASTORE - Data Produk Static
// Edit data produk di sini sesuai kebutuhan
// ============================================

const products = [
  {
    id: 1,
    name: "Sneakers Modern Premium",
    category: "Fashion",
    price: 450000,
    originalPrice: 650000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    description: "Sepatu sneakers modern dengan desain premium yang nyaman untuk aktivitas harian. Dibuat dengan material berkualitas tinggi yang tahan lama dan breathable.",
    stock: 15,
    rating: 4.8,
    reviewCount: 128,
    isNew: false,
    isSale: true,
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500"
    ]
  },
  {
    id: 2,
    name: "Smart Watch Pro X",
    category: "Electronics",
    price: 1200000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    description: "Jam pintar canggih dengan fitur kesehatan lengkap. Monitor detak jantung, tracking olahraga, notifikasi smartphone, dan baterai tahan hingga 7 hari.",
    stock: 8,
    rating: 4.9,
    reviewCount: 256,
    isNew: true,
    isSale: false,
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500"
    ]
  },
  {
    id: 3,
    name: "Tas Backpack Urban",
    category: "Fashion",
    price: 280000,
    originalPrice: 350000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    description: "Tas backpack stylish dengan kapasitas besar, cocok untuk kerja dan traveling. Dilengkapi kompartemen laptop dan banyak kantong organizer.",
    stock: 20,
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    isSale: true,
    gallery: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"
    ]
  },
  {
    id: 4,
    name: "Headphone Wireless Bass",
    category: "Electronics",
    price: 750000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    description: "Headphone wireless dengan suara bass powerful dan noise cancellation aktif. Nyaman dipakai berjam-jam dengan ear cushion premium.",
    stock: 12,
    rating: 4.7,
    reviewCount: 167,
    isNew: false,
    isSale: false,
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
    ]
  },
  {
    id: 5,
    name: "Kemeja Casual Flannel",
    category: "Fashion",
    price: 185000,
    originalPrice: 250000,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
    description: "Kemeja flannel premium dengan bahan katun lembut. Cocok untuk gaya casual sehari-hari atau acara semi-formal.",
    stock: 25,
    rating: 4.5,
    reviewCount: 78,
    isNew: false,
    isSale: true,
    gallery: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
      "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=500"
    ]
  },
  {
    id: 6,
    name: "Kamera Mirrorless 4K",
    category: "Electronics",
    price: 8500000,
    originalPrice: 9500000,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    description: "Kamera mirrorless profesional dengan video 4K, stabilisasi gambar, dan autofocus cepat. Sempurna untuk content creator dan fotografer.",
    stock: 5,
    rating: 4.9,
    reviewCount: 45,
    isNew: true,
    isSale: true,
    gallery: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
      "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500"
    ]
  },
  {
    id: 7,
    name: "Parfum Elegance 50ml",
    category: "Beauty",
    price: 320000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
    description: "Parfum premium dengan aroma woody yang elegan dan tahan lama. Cocok untuk acara formal maupun penggunaan sehari-hari.",
    stock: 18,
    rating: 4.7,
    reviewCount: 134,
    isNew: false,
    isSale: false,
    gallery: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500"
    ]
  },
  {
    id: 8,
    name: "Laptop Stand Aluminium",
    category: "Accessories",
    price: 145000,
    originalPrice: 200000,
    image: "https://images.unsplash.com/photo-1616353329437-9753a6975077?w=500",
    description: "Stand laptop premium dari aluminium dengan desain ergonomic. Adjustable height dan angle untuk kenyamanan kerja.",
    stock: 30,
    rating: 4.6,
    reviewCount: 92,
    isNew: false,
    isSale: true,
    gallery: [
      "https://images.unsplash.com/photo-1616353329437-9753a6975077?w=500",
      "https://images.unsplash.com/photo-1616353071588-708dcff912e2?w=500",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"
    ]
  },
  {
    id: 9,
    name: "Mouse Gaming RGB",
    category: "Electronics",
    price: 295000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    description: "Mouse gaming dengan sensor presisi tinggi, RGB lighting, dan desain ergonomic. 7 programmable buttons untuk gaming dan produktivitas.",
    stock: 22,
    rating: 4.8,
    reviewCount: 203,
    isNew: true,
    isSale: false,
    gallery: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500"
    ]
  },
  {
    id: 10,
    name: "Botol Minum Tumbler",
    category: "Lifestyle",
    price: 85000,
    originalPrice: 120000,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
    description: "Tumbler stainless steel dengan isolasi termos menjaga minuman tetap dingin 24 jam atau panas 12 jam. Desain minimalis dan stylish.",
    stock: 40,
    rating: 4.5,
    reviewCount: 156,
    isNew: false,
    isSale: true,
    gallery: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500"
    ]
  },
  {
    id: 11,
    name: "Dompet Kulit Asli",
    category: "Fashion",
    price: 195000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
    description: "Dompet premium dari kulit asli dengan jahitan rapi dan tahan lama. Banyak slot kartu dan kompartemen uang.",
    stock: 16,
    rating: 4.7,
    reviewCount: 67,
    isNew: false,
    isSale: false,
    gallery: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
      "https://images.unsplash.com/photo-1606503825008-909a6184af56?w=500",
      "https://images.unsplash.com/photo-1559563458-527698bf5295?w=500"
    ]
  },
  {
    id: 12,
    name: "Speaker Bluetooth Mini",
    category: "Electronics",
    price: 175000,
    originalPrice: 250000,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
    description: "Speaker bluetooth portable dengan suara jernih dan bass powerful. Tahan air IPX5 dan baterai tahan 12 jam.",
    stock: 14,
    rating: 4.4,
    reviewCount: 112,
    isNew: false,
    isSale: true,
    gallery: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
    ]
  }
];

// Kategori produk
const categories = [
  { id: "all", name: "Semua Kategori", icon: "🛍️" },
  { id: "Fashion", name: "Fashion", icon: "👕" },
  { id: "Electronics", name: "Elektronik", icon: "📱" },
  { id: "Beauty", name: "Kecantikan", icon: "💄" },
  { id: "Accessories", name: "Aksesoris", icon: "⌚" },
  { id: "Lifestyle", name: "Gaya Hidup", icon: "🏠" }
];

// Format harga ke Rupiah
function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

// Dapatkan produk berdasarkan ID
function getProductById(id) {
  return products.find(product => product.id === parseInt(id));
}

// Dapatkan produk berdasarkan kategori
function getProductsByCategory(category) {
  if (category === 'all' || !category) {
    return products;
  }
  return products.filter(product => product.category === category);
}

// Cari produk
function searchProducts(query) {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  );
}

// Urutkan produk
function sortProducts(products, sortBy) {
  const sorted = [...products];
  switch(sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

// Filter produk berdasarkan harga
function filterByPrice(products, min, max) {
  return products.filter(product => {
    if (min && product.price < min) return false;
    if (max && product.price > max) return false;
    return true;
  });
}

// Dapatkan produk unggulan (untuk homepage)
function getFeaturedProducts(count = 8) {
  return products.slice(0, count);
}

// Dapatkan produk terbaru
function getNewProducts(count = 4) {
  return products.filter(p => p.isNew).slice(0, count);
}

// Dapatkan produk diskon
function getSaleProducts(count = 4) {
  return products.filter(p => p.isSale).slice(0, count);
}

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    products,
    categories,
    formatPrice,
    getProductById,
    getProductsByCategory,
    searchProducts,
    sortProducts,
    filterByPrice,
    getFeaturedProducts,
    getNewProducts,
    getSaleProducts
  };
}
