/**
 * ========================================
 * LAPOR WARGA - JAVASCRIPT
 * LocalStorage-based Citizen Reporting System
 * ========================================
 * 
 * Fitur:
 * - Simpan laporan ke LocalStorage
 * - Tampilkan daftar laporan
 * - Filter & Search
 * - Edit & Hapus laporan
 * - Dark Mode toggle
 * - Export ke JSON
 * - Statistik laporan
 * - Upload foto (base64)
 */

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Generate unique ID berdasarkan timestamp
 */
function generateId() {
    return Date.now();
}

/**
 * Format tanggal ke format Indonesia
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}

/**
 * Get current date string
 */
function getCurrentDate() {
    return new Date().toISOString();
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        
        // Update icon based on type
        const icon = toast.querySelector('i');
        if (icon) {
            icon.className = type === 'success' ? 'fas fa-check-circle' : 
                            type === 'error' ? 'fas fa-exclamation-circle' : 
                            'fas fa-info-circle';
        }
        
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

// ========================================
// LOCALSTORAGE FUNCTIONS
// ========================================

const STORAGE_KEY = 'laporan_warga';

/**
 * Get all laporan from LocalStorage
 */
function getLaporan() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading from LocalStorage:', error);
        return [];
    }
}

/**
 * Save laporan to LocalStorage
 */
function saveLaporan(laporan) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(laporan));
        return true;
    } catch (error) {
        console.error('Error saving to LocalStorage:', error);
        showToast('Gagal menyimpan data. Storage mungkin penuh.', 'error');
        return false;
    }
}

/**
 * Add new laporan
 */
function addLaporan(data) {
    const laporan = getLaporan();
    const newLaporan = {
        id: generateId(),
        ...data,
        status: 'Menunggu',
        tanggal: getCurrentDate()
    };
    
    laporan.push(newLaporan);
    return saveLaporan(laporan);
}

/**
 * Update laporan by ID
 */
function updateLaporan(id, data) {
    const laporan = getLaporan();
    const index = laporan.findIndex(item => item.id === id);
    
    if (index !== -1) {
        laporan[index] = { ...laporan[index], ...data };
        return saveLaporan(laporan);
    }
    return false;
}

/**
 * Delete laporan by ID
 */
function deleteLaporan(id) {
    const laporan = getLaporan();
    const filtered = laporan.filter(item => item.id !== id);
    return saveLaporan(filtered);
}

/**
 * Get laporan by ID
 */
function getLaporanById(id) {
    const laporan = getLaporan();
    return laporan.find(item => item.id === id);
}

// ========================================
// IMAGE HANDLING
// ========================================

let currentImageBase64 = null;

/**
 * Handle file upload and convert to base64
 */
function handleFileUpload(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null);
            return;
        }
        
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            reject('Ukuran file terlalu besar. Maksimal 2MB.');
            return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            reject('File harus berupa gambar.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.onerror = () => {
            reject('Gagal membaca file.');
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Setup file upload preview
 */
function setupFileUpload() {
    const fileInput = document.getElementById('foto');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const removeButton = document.getElementById('removeImage');
    
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    currentImageBase64 = await handleFileUpload(file);
                    if (currentImageBase64 && previewImage && previewContainer) {
                        previewImage.src = currentImageBase64;
                        previewContainer.style.display = 'block';
                    }
                } catch (error) {
                    showToast(error, 'error');
                    fileInput.value = '';
                }
            }
        });
    }
    
    if (removeButton) {
        removeButton.addEventListener('click', () => {
            currentImageBase64 = null;
            if (fileInput) fileInput.value = '';
            if (previewContainer) previewContainer.style.display = 'none';
            if (previewImage) previewImage.src = '';
        });
    }
}

// ========================================
// FORM HANDLING
// ========================================

/**
 * Kirim laporan baru
 */
async function kirimLaporan() {
    const nama = document.getElementById('nama');
    const kategori = document.getElementById('kategori');
    const lokasi = document.getElementById('lokasi');
    const deskripsi = document.getElementById('deskripsi');
    
    // Validasi
    if (!nama.value.trim()) {
        showToast('Nama pelapor wajib diisi!', 'error');
        nama.focus();
        return;
    }
    
    if (!kategori.value) {
        showToast('Kategori wajib dipilih!', 'error');
        kategori.focus();
        return;
    }
    
    if (!lokasi.value.trim()) {
        showToast('Lokasi wajib diisi!', 'error');
        lokasi.focus();
        return;
    }
    
    if (!deskripsi.value.trim()) {
        showToast('Deskripsi wajib diisi!', 'error');
        deskripsi.focus();
        return;
    }
    
    // Buat data laporan
    const data = {
        nama: nama.value.trim(),
        kategori: kategori.value,
        lokasi: lokasi.value.trim(),
        deskripsi: deskripsi.value.trim(),
        foto: currentImageBase64
    };
    
    // Simpan ke LocalStorage
    if (addLaporan(data)) {
        showToast('Laporan berhasil dikirim!');
        
        // Reset form
        nama.value = '';
        kategori.value = '';
        lokasi.value = '';
        deskripsi.value = '';
        currentImageBase64 = null;
        
        const fileInput = document.getElementById('foto');
        const previewContainer = document.getElementById('previewContainer');
        const previewImage = document.getElementById('previewImage');
        
        if (fileInput) fileInput.value = '';
        if (previewContainer) previewContainer.style.display = 'none';
        if (previewImage) previewImage.src = '';
        
        // Update stats on homepage
        updateHomeStats();
        
        // Redirect ke halaman laporan setelah 1 detik
        setTimeout(() => {
            window.location.href = 'laporan.html';
        }, 1000);
    } else {
        showToast('Gagal mengirim laporan. Coba lagi.', 'error');
    }
}

// ========================================
// REPORTS LIST (laporan.html)
// ========================================

let currentLaporan = [];
let editingId = null;
let deletingId = null;

/**
 * Get category color class
 */
function getCategoryClass(kategori) {
    const map = {
        'Jalan Rusak': 'jalan',
        'Sampah': 'sampah',
        'Lampu Jalan': 'lampu',
        'Keamanan': 'keamanan',
        'Lainnya': 'lainnya'
    };
    return map[kategori] || 'lainnya';
}

/**
 * Get status class
 */
function getStatusClass(status) {
    const map = {
        'Menunggu': 'menunggu',
        'Diproses': 'diproses',
        'Selesai': 'selesai'
    };
    return map[status] || 'menunggu';
}

/**
 * Render laporan cards
 */
function renderLaporan(laporan = null) {
    const container = document.getElementById('reportsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!container) return;
    
    const data = laporan || getLaporan();
    currentLaporan = data;
    
    // Sort by newest first
    data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    
    if (data.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    container.innerHTML = data.map(item => `
        <div class="report-card">
            <div class="report-card-image">
                ${item.foto ? 
                    `<img src="${item.foto}" alt="Foto laporan">` : 
                    `<div class="no-image"><i class="fas fa-image"></i></div>`
                }
                <span class="report-card-category ${getCategoryClass(item.kategori)}">${item.kategori}</span>
                <span class="report-card-status ${getStatusClass(item.status)}">${item.status}</span>
            </div>
            <div class="report-card-content">
                <h3>${item.deskripsi.substring(0, 50)}${item.deskripsi.length > 50 ? '...' : ''}</h3>
                <div class="report-card-meta">
                    <div class="report-card-meta-item">
                        <i class="fas fa-user"></i>
                        <span>${item.nama}</span>
                    </div>
                    <div class="report-card-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${item.lokasi}</span>
                    </div>
                </div>
                <p class="report-card-description">${item.deskripsi}</p>
                <div class="report-card-footer">
                    <span class="report-card-date">${formatDate(item.tanggal)}</span>
                    <div class="report-card-actions">
                        <button class="btn-edit" onclick="openEditModal(${item.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="openDeleteModal(${item.id})" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Update statistics
 */
function updateStats() {
    const laporan = getLaporan();
    
    const total = laporan.length;
    const menunggu = laporan.filter(item => item.status === 'Menunggu').length;
    const diproses = laporan.filter(item => item.status === 'Diproses').length;
    const selesai = laporan.filter(item => item.status === 'Selesai').length;
    
    // Update stat elements
    const statTotal = document.getElementById('statTotal');
    const statMenunggu = document.getElementById('statMenunggu');
    const statDiproses = document.getElementById('statDiproses');
    const statSelesai = document.getElementById('statSelesai');
    
    if (statTotal) statTotal.textContent = total;
    if (statMenunggu) statMenunggu.textContent = menunggu;
    if (statDiproses) statDiproses.textContent = diproses;
    if (statSelesai) statSelesai.textContent = selesai;
    
    // Update category stats
    updateCategoryStats(laporan);
}

/**
 * Update category statistics
 */
function updateCategoryStats(laporan) {
    const container = document.getElementById('categoryBars');
    if (!container) return;
    
    const categories = ['Jalan Rusak', 'Sampah', 'Lampu Jalan', 'Keamanan', 'Lainnya'];
    const categoryColors = {
        'Jalan Rusak': '#ef4444',
        'Sampah': '#f59e0b',
        'Lampu Jalan': '#eab308',
        'Keamanan': '#3b82f6',
        'Lainnya': '#6b7280'
    };
    
    const total = laporan.length || 1; // Avoid division by zero
    
    const stats = categories.map(cat => ({
        name: cat,
        count: laporan.filter(item => item.kategori === cat).length
    }));
    
    container.innerHTML = stats.map(stat => {
        const percentage = (stat.count / total) * 100;
        return `
            <div class="category-bar">
                <span class="category-label">${stat.name}</span>
                <div class="category-progress">
                    <div class="category-progress-fill" style="width: ${percentage}%; background-color: ${categoryColors[stat.name]}"></div>
                </div>
                <span class="category-count">${stat.count}</span>
            </div>
        `;
    }).join('');
}

/**
 * Filter and search laporan
 */
function filterLaporan() {
    const searchInput = document.getElementById('searchInput');
    const filterKategori = document.getElementById('filterKategori');
    const filterStatus = document.getElementById('filterStatus');
    const sortBy = document.getElementById('sortBy');
    
    let laporan = getLaporan();
    
    // Search
    if (searchInput && searchInput.value.trim()) {
        const search = searchInput.value.toLowerCase();
        laporan = laporan.filter(item => 
            item.nama.toLowerCase().includes(search) ||
            item.lokasi.toLowerCase().includes(search) ||
            item.deskripsi.toLowerCase().includes(search) ||
            item.kategori.toLowerCase().includes(search)
        );
    }
    
    // Filter kategori
    if (filterKategori && filterKategori.value) {
        laporan = laporan.filter(item => item.kategori === filterKategori.value);
    }
    
    // Filter status
    if (filterStatus && filterStatus.value) {
        laporan = laporan.filter(item => item.status === filterStatus.value);
    }
    
    // Sort
    if (sortBy) {
        if (sortBy.value === 'newest') {
            laporan.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        } else if (sortBy.value === 'oldest') {
            laporan.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
        }
    }
    
    renderLaporan(laporan);
}

/**
 * Setup filter listeners
 */
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterKategori = document.getElementById('filterKategori');
    const filterStatus = document.getElementById('filterStatus');
    const sortBy = document.getElementById('sortBy');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterLaporan);
    }
    
    if (filterKategori) {
        filterKategori.addEventListener('change', filterLaporan);
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', filterLaporan);
    }
    
    if (sortBy) {
        sortBy.addEventListener('change', filterLaporan);
    }
}

// ========================================
// EDIT & DELETE MODALS
// ========================================

/**
 * Open edit modal
 */
function openEditModal(id) {
    const item = getLaporanById(id);
    if (!item) return;
    
    editingId = id;
    
    const modal = document.getElementById('editModal');
    const editNama = document.getElementById('editNama');
    const editKategori = document.getElementById('editKategori');
    const editLokasi = document.getElementById('editLokasi');
    const editStatus = document.getElementById('editStatus');
    const editDeskripsi = document.getElementById('editDeskripsi');
    
    if (editNama) editNama.value = item.nama;
    if (editKategori) editKategori.value = item.kategori;
    if (editLokasi) editLokasi.value = item.lokasi;
    if (editStatus) editStatus.value = item.status;
    if (editDeskripsi) editDeskripsi.value = item.deskripsi;
    
    if (modal) modal.classList.add('active');
}

/**
 * Close edit modal
 */
function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.classList.remove('active');
    editingId = null;
}

/**
 * Simpan edit
 */
function simpanEdit() {
    if (!editingId) return;
    
    const editNama = document.getElementById('editNama');
    const editKategori = document.getElementById('editKategori');
    const editLokasi = document.getElementById('editLokasi');
    const editStatus = document.getElementById('editStatus');
    const editDeskripsi = document.getElementById('editDeskripsi');
    
    if (!editNama.value.trim() || !editLokasi.value.trim() || !editDeskripsi.value.trim()) {
        showToast('Semua field wajib diisi!', 'error');
        return;
    }
    
    const data = {
        nama: editNama.value.trim(),
        kategori: editKategori.value,
        lokasi: editLokasi.value.trim(),
        status: editStatus.value,
        deskripsi: editDeskripsi.value.trim()
    };
    
    if (updateLaporan(editingId, data)) {
        showToast('Laporan berhasil diupdate!');
        closeEditModal();
        renderLaporan();
        updateStats();
    } else {
        showToast('Gagal mengupdate laporan.', 'error');
    }
}

/**
 * Open delete modal
 */
function openDeleteModal(id) {
    deletingId = id;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.classList.add('active');
}

/**
 * Close delete modal
 */
function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.classList.remove('active');
    deletingId = null;
}

/**
 * Konfirmasi hapus
 */
function konfirmasiHapus() {
    if (!deletingId) return;
    
    if (deleteLaporan(deletingId)) {
        showToast('Laporan berhasil dihapus!');
        closeDeleteModal();
        renderLaporan();
        updateStats();
    } else {
        showToast('Gagal menghapus laporan.', 'error');
    }
}

// ========================================
// EXPORT FUNCTION
// ========================================

/**
 * Export laporan to JSON file
 */
function exportToJSON() {
    const laporan = getLaporan();
    
    if (laporan.length === 0) {
        showToast('Tidak ada data untuk diexport!', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(laporan, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-warga-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Data berhasil diexport!');
}

// ========================================
// DARK MODE
// ========================================

const DARK_MODE_KEY = 'dark_mode';

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(DARK_MODE_KEY, 'false');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(DARK_MODE_KEY, 'true');
    }
    
    updateDarkModeIcon();
}

/**
 * Update dark mode icon
 */
function updateDarkModeIcon() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const icon = toggle.querySelector('i');
    
    if (icon) {
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
}

/**
 * Load dark mode preference
 */
function loadDarkMode() {
    const isDark = localStorage.getItem(DARK_MODE_KEY) === 'true';
    
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    updateDarkModeIcon();
}

/**
 * Setup dark mode toggle
 */
function setupDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.addEventListener('click', toggleDarkMode);
    }
    loadDarkMode();
}

// ========================================
// MOBILE MENU
// ========================================

function setupMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// ========================================
// HOMEPAGE STATS
// ========================================

function updateHomeStats() {
    const laporan = getLaporan();
    
    const totalEl = document.getElementById('totalLaporan');
    const selesaiEl = document.getElementById('laporanSelesai');
    const menungguEl = document.getElementById('laporanMenunggu');
    
    if (totalEl) totalEl.textContent = laporan.length;
    if (selesaiEl) selesaiEl.textContent = laporan.filter(item => item.status === 'Selesai').length;
    if (menungguEl) menungguEl.textContent = laporan.filter(item => item.status === 'Menunggu').length;
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Setup common features
    setupDarkMode();
    setupMobileMenu();
    setupFileUpload();
    
    // Page-specific initialization
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '') {
        // Homepage
        updateHomeStats();
    } else if (currentPage === 'laporan.html') {
        // Laporan page
        renderLaporan();
        updateStats();
        setupFilters();
    }
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    
    if (e.target === editModal) {
        closeEditModal();
    }
    
    if (e.target === deleteModal) {
        closeDeleteModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEditModal();
        closeDeleteModal();
    }
});
