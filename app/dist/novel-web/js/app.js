/* ============================================
   NOVEL WEB - JAVASCRIPT UTAMA
   LocalStorage Based - Easy to Edit
   ============================================ */

// ============================================
// DATA STORAGE (LOCALSTORAGE)
// ============================================

// Struktur data novel:
// novels = [
//   {
//     id: "novel-001",
//     title: "Judul Novel",
//     author: "Nama Penulis",
//     genre: "Fantasi",
//     synopsis: "Deskripsi singkat...",
//     cover: "cover.jpg" atau "data:image...",
//     createdAt: "2024-01-01",
//     chapters: [
//       {
//         chapterId: "ch-1",
//         title: "Bab 1",
//         content: "Isi cerita...",
//         createdAt: "2024-01-01"
//       }
//     ]
//   }
// ]

// Ambil semua novel dari LocalStorage
function getNovels() {
  const novels = localStorage.getItem('novels');
  return novels ? JSON.parse(novels) : [];
}

// Simpan semua novel ke LocalStorage
function saveNovels(novels) {
  localStorage.setItem('novels', JSON.stringify(novels));
}

// Generate ID unik
function generateId() {
  return 'novel-' + Date.now();
}

// Generate chapter ID unik
function generateChapterId() {
  return 'ch-' + Date.now();
}

// ============================================
// NOVEL FUNCTIONS
// ============================================

// Simpan novel baru
function saveNovel(novelData) {
  const novels = getNovels();
  
  const newNovel = {
    id: generateId(),
    title: novelData.title,
    author: novelData.author || 'Anonymous',
    genre: novelData.genre,
    synopsis: novelData.synopsis,
    cover: novelData.cover || null,
    createdAt: new Date().toISOString(),
    chapters: []
  };
  
  novels.push(newNovel);
  saveNovels(novels);
  
  return newNovel;
}

// Update novel
function updateNovel(novelId, updateData) {
  const novels = getNovels();
  const index = novels.findIndex(n => n.id === novelId);
  
  if (index !== -1) {
    novels[index] = { ...novels[index], ...updateData };
    saveNovels(novels);
    return novels[index];
  }
  return null;
}

// Hapus novel
function deleteNovel(novelId) {
  const novels = getNovels();
  const filtered = novels.filter(n => n.id !== novelId);
  saveNovels(filtered);
}

// Ambil novel by ID
function getNovelById(novelId) {
  const novels = getNovels();
  return novels.find(n => n.id === novelId);
}

// ============================================
// CHAPTER FUNCTIONS
// ============================================

// Tambah chapter baru
function addChapter(novelId, chapterData) {
  const novels = getNovels();
  const novel = novels.find(n => n.id === novelId);
  
  if (novel) {
    const newChapter = {
      chapterId: generateChapterId(),
      title: chapterData.title,
      content: chapterData.content,
      createdAt: new Date().toISOString()
    };
    
    novel.chapters.push(newChapter);
    saveNovels(novels);
    return newChapter;
  }
  return null;
}

// Update chapter
function updateChapter(novelId, chapterId, updateData) {
  const novels = getNovels();
  const novel = novels.find(n => n.id === novelId);
  
  if (novel) {
    const chapterIndex = novel.chapters.findIndex(c => c.chapterId === chapterId);
    if (chapterIndex !== -1) {
      novel.chapters[chapterIndex] = { 
        ...novel.chapters[chapterIndex], 
        ...updateData 
      };
      saveNovels(novels);
      return novel.chapters[chapterIndex];
    }
  }
  return null;
}

// Hapus chapter
function deleteChapter(novelId, chapterId) {
  const novels = getNovels();
  const novel = novels.find(n => n.id === novelId);
  
  if (novel) {
    novel.chapters = novel.chapters.filter(c => c.chapterId !== chapterId);
    saveNovels(novels);
  }
}

// Ambil chapter by ID
function getChapterById(novelId, chapterId) {
  const novel = getNovelById(novelId);
  if (novel) {
    return novel.chapters.find(c => c.chapterId === chapterId);
  }
  return null;
}

// ============================================
// THEME FUNCTIONS
// ============================================

// Toggle dark/light mode
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  updateThemeIcon(newTheme);
}

// Update icon theme toggle
function updateThemeIcon(theme) {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }
}

// Load theme saat startup
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

// ============================================
// UI FUNCTIONS
// ============================================

// Toast notification
function showToast(message, type = 'success') {
  // Hapus toast yang sudah ada
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Buat toast baru
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '❌'}</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Toggle mobile menu
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Escape HTML untuk mencegah XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// COVER IMAGE HANDLING
// ============================================

// Handle upload cover image (convert ke base64)
function handleCoverUpload(file, callback) {
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

// Generate random gradient cover
function generateRandomCover() {
  const colors = [
    ['#6366f1', '#8b5cf6'],
    ['#ec4899', '#8b5cf6'],
    ['#3b82f6', '#06b6d4'],
    ['#f59e0b', '#ef4444'],
    ['#10b981', '#3b82f6'],
    ['#8b5cf6', '#ec4899'],
    ['#ef4444', '#f59e0b'],
    ['#06b6d4', '#10b981']
  ];
  
  const randomColors = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(135deg, ${randomColors[0]}, ${randomColors[1]})`;
}

// ============================================
// SAMPLE DATA (Untuk Demo)
// ============================================

// Tambah sample data jika belum ada
function initSampleData() {
  const novels = getNovels();
  
  if (novels.length === 0) {
    const sampleNovels = [
      {
        id: 'novel-1',
        title: 'Sang Pemimpin',
        author: 'Anonymous',
        genre: 'Fantasi',
        synopsis: 'Seorang pemuda biasa menemukan kekuatan tersembunyi dalam dirinya. Dalam perjalanan untuk menguasai kekuatan tersebut, ia harus menghadapi berbagai tantangan dan musuh yang mengancam dunia.',
        cover: 'assets/cover/cover-1.jpg',
        createdAt: new Date().toISOString(),
        chapters: [
          {
            chapterId: 'ch-1',
            title: 'Bab 1 - Awal Mula',
            content: `Di sebuah desa terpencil, hiduplah seorang pemuda bernama Aria. Ia adalah anak yatim piatu yang dibesarkan oleh kakeknya, seorang penjaga hutan tua yang bijaksana.

Setiap hari, Aria membantu kakeknya mengumpulkan kayu bakar dan berburu di hutan. Hidupnya sederhana, namun penuh dengan kedamaian. Namun, segalanya berubah pada malam itu.

Malam dengan bulan purnama yang terang, Aria terbangun oleh suara gemuruh dari dalam hutan. Suara itu seperti raungan sesuatu yang besar, sesuatu yang bukan manusia.

"Kakek!" seru Aria, bergegas ke kamar kakeknya.

Namun kakeknya sudah berdiri di depan pintu, wajahnya serius. "Aria, dengarkan baik-baik. Ambil pedang di lemari dan lari ke gua di belakang rumah. Jangan keluar sampai matahari terbit."

"Tapi kakek-"

"Lakukan!" suara kakeknya tegas.

Aria mengambil pedang tua yang selalu tergantung di dinding. Pedang itu berkarat, namun terasa aneh hangat di tangannya. Ia berlari ke gua, hatinya berdebar kencang.

Dari dalam gua, ia mendengar suara pertarungan. Raungan, teriakan, dan dentang logam. Kemudian, keheningan.

Aria menunggu sampai matahari terbit. Ketika ia keluar dari gua, apa yang dilihatnya mengubah hidupnya selamanya...`,
            createdAt: new Date().toISOString()
          },
          {
            chapterId: 'ch-2',
            title: 'Bab 2 - Kekuatan Terbangun',
            content: `Rumah mereka hancur berantakan. Di tengah puing-puing, kakeknya terbaring tak berdaya. Namun yang mengejutkan Aria adalah mayat makhluk besar di samping kakeknya—seekor monster berbulu dengan taring tajam.

"Kakek!" Aria berlari menghampiri.

Kakeknya membuka mata. "Aria... pedang itu..."

"Apa kakek?"

"Pedang itu memilihmu." Kakeknya batuk darah. "Aku selalu tahu... kau berbeda. Ibumu... dia adalah seorang penyihir kuat. Kau mewarisi darahnya."

Aria terkejut. "Penyihir? Tapi-"

"Sentuh pedang itu. Rasakan kekuatanmu." Kakeknya memegang tangannya. "Jadilah pemimpin yang dunia butuhkan."

Kakeknya menutup mata untuk selamanya.

Aria menangis sejadi-jadinya. Namun di tengah kesedihan, ia merasakan sesuatu—panas dari pedang di tangannya mulai menyebar ke seluruh tubuhnya.

Cahaya biru keluar dari pedang, menyelimuti Aria. Ia merasakan energi yang tak pernah ia rasakan sebelumnya mengalir dalam dirinya.

Ketika cahaya memudar, Aria tahu hidupnya telah berubah selamanya. Ia bukan lagi pemuda desa biasa. Ia adalah pewaris kekuatan kuno, dan takdirnya menunggu.`,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'novel-2',
        title: 'Cinta di Musim Hujan',
        author: 'Anonymous',
        genre: 'Romansa',
        synopsis: 'Dua orang asing bertemu di sebuah kafe saat hujan deras. Percakapan singkat berubah menjadi pertemuan tak terlupakan yang mengubah hidup mereka.',
        cover: 'assets/cover/cover-2.jpg',
        createdAt: new Date().toISOString(),
        chapters: [
          {
            chapterId: 'ch-1',
            title: 'Bab 1 - Pertemuan',
            content: `Hujan turun dengan derasnya di kota itu. Lana berlari masuk ke kafe kecil di sudut jalan, pakaiannya basah kuyup.

"Sial," gumamnya, melihat hujan yang tak kunjung reda.

"Tempat duduk sini kosong."

Lana menoleh. Seorang pria dengan buku di tangan menunjuk kursi di depannya. Meja itu memang untuk dua orang, dan kafe itu hampir penuh.

"Terima kasih," kata Lana, duduk.

Pria itu mengangguk, kembali ke bukunya. Lana memesan kopi panas, berusaha menghangatkan diri.

"Kau suka hujan?" tanya pria itu tiba-tiba.

Lana terkejut. "Maaf?"

"Kau menatap hujan sejak tadi." Pria itu tersenyum. "Aku Reza."

"Lana. Dan tidak, aku benci hujan. Hari ini saja aku lupa payung."

Reza tertawa. "Hujan itu indah kalau kau tahu cara menikmatinya."

"Oh? Bagaimana caranya?"

Reza menutup bukunya. "Dengan secangkir kopi panas, dan percakapan dengan orang asing."

Lana tersenyum untuk pertama kalinya hari itu. Mungkin hujan tidak seburuk yang ia kira.`,
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        id: 'novel-3',
        title: 'Misteri Rumah Tua',
        author: 'Anonymous',
        genre: 'Misteri',
        synopsis: 'Sebuah rumah tua di ujung jalan menyimpan rahasia kelam. Ketika seorang detektif amatir memutuskan untuk menyelidikinya, ia menemukan lebih dari yang ia barga.',
        cover: 'assets/cover/cover-3.jpg',
        createdAt: new Date().toISOString(),
        chapters: [
          {
            chapterId: 'ch-1',
            title: 'Bab 1 - Rumah Itu',
            content: `Rumah di ujung Jalan Elm selalu membuat orang merasa tidak nyaman. Dindingnya yang menghitam, jendela yang tertutup papan, dan keheningan yang menggantung di sekitarnya.

"Kau yakin tentang ini, Dan?" tanya Rina, sahabatku.

"Seseorang harus mencari tahu apa yang terjadi pada keluarga Hartono," jawabku, menatap rumah itu. "Mereka tidak pergi begitu saja."

Tiga bulan lalu, keluarga Hartono—ayah, ibu, dan dua anak mereka—menghilang tanpa jejak. Polisi menyimpulkan mereka pindah secara diam-diam, tapi tidak ada yang percaya.

Mereka meninggalkan semua barang berharga. Mobil masih di garasi. Pakaian masih di lemari. Dan yang paling aneh: makanan masih di meja makan, sudah membusuk.

"Aku masuk sendiri," kataku pada Rina. "Kau tunggu di sini."

"Dan, ini gila-"

"Seseorang harus melakukannya."

Aku berjalan menuju pintu depan. Kunci sudah rusak—mungkin polisi yang melakukannya. Aku mendorong, dan pintu berbunyi mencicit terbuka.

Bau lapuk dan jamur menyambutku. Debu beterbangan di cahaya matahari yang masuk dari pintu.

"Halo?" panggilku.

Tidak ada jawaban. Hanya keheningan yang terlalu tebal, seolah rumah itu menahan napas.

Aku mengambil langkah pertama ke dalam, dan pintu tertutup dengan sendirinya di belakangku.

"Rina?" seruku, panik.

Tidak ada suara dari luar. Hanya keheningan.

Aku berada di dalam, sendirian. Dan sesuatu memberitahuku bahwa aku tidak sendirian.`,
            createdAt: new Date().toISOString()
          }
        ]
      }
    ];
    
    saveNovels(sampleNovels);
  }
}

// ============================================
// INITIALIZATION
// ============================================

// Jalankan saat DOM loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load theme
  loadTheme();
  
  // Init sample data
  initSampleData();
  
  // Setup theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Setup mobile menu
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
});

// ============================================
// EXPORT/IMPORT DATA (Opsional)
// ============================================

// Export data ke JSON file
function exportData() {
  const novels = getNovels();
  const dataStr = JSON.stringify(novels, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'novel-backup-' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Data berhasil diexport!');
}

// Import data dari JSON file
function importData(file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const novels = JSON.parse(e.target.result);
      saveNovels(novels);
      showToast('Data berhasil diimport!');
      if (callback) callback();
    } catch (error) {
      showToast('File tidak valid!', 'error');
    }
  };
  reader.readAsText(file);
}
