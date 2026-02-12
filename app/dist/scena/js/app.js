/**
 * ============================================
 * SCENA - Movie Streaming Platform
 * Main JavaScript File
 * ============================================
 */

// ============================================
// MOVIE DATA
// ============================================
const movies = [
  {
    id: 1,
    title: "The Last Horizon",
    genre: "Sci-Fi",
    year: 2026,
    rating: 8.9,
    duration: "2h 45m",
    poster: "assets/posters/horizon.jpg",
    backdrop: "assets/posters/horizon-bg.jpg",
    video: "assets/videos/horizon.mp4",
    description: "In a future where humanity's survival depends on finding a new home, a team of explorers embarks on an epic journey beyond the boundaries of space and time. Their mission: to discover a new horizon for mankind.",
    type: "movie",
    trending: true,
    popular: true,
    new: false
  },
  {
    id: 2,
    title: "Midnight Shadows",
    genre: "Thriller",
    year: 2025,
    rating: 8.5,
    duration: "2h 10m",
    poster: "assets/posters/shadows.jpg",
    backdrop: "assets/posters/shadows-bg.jpg",
    video: "assets/videos/shadows.mp4",
    description: "A detective unravels a conspiracy that threatens to plunge the city into eternal darkness. As the midnight hour approaches, secrets long buried begin to surface.",
    type: "movie",
    trending: true,
    popular: true,
    new: true
  },
  {
    id: 3,
    title: "Echoes of Tomorrow",
    genre: "Drama",
    year: 2026,
    rating: 8.7,
    duration: "2h 30m",
    poster: "assets/posters/echoes.jpg",
    backdrop: "assets/posters/echoes-bg.jpg",
    video: "assets/videos/echoes.mp4",
    description: "Two strangers connected across time must work together to prevent a catastrophe that will reshape the future. A touching story about love, loss, and second chances.",
    type: "movie",
    trending: false,
    popular: true,
    new: true
  },
  {
    id: 4,
    title: "Crimson Tide",
    genre: "Action",
    year: 2025,
    rating: 7.9,
    duration: "2h 5m",
    poster: "assets/posters/crimson.jpg",
    backdrop: "assets/posters/crimson-bg.jpg",
    video: "assets/videos/crimson.mp4",
    description: "An elite special forces team is sent on a suicide mission to stop a global threat. With time running out, they must confront their past to save the future.",
    type: "movie",
    trending: true,
    popular: false,
    new: true
  },
  {
    id: 5,
    title: "The Lost Kingdom",
    genre: "Adventure",
    year: 2025,
    rating: 8.2,
    duration: "2h 20m",
    poster: "assets/posters/kingdom.jpg",
    backdrop: "assets/posters/kingdom-bg.jpg",
    video: "assets/videos/kingdom.mp4",
    description: "An archaeologist discovers a map leading to an ancient kingdom hidden for millennia. But she's not the only one searching for its legendary treasure.",
    type: "movie",
    trending: false,
    popular: true,
    new: false
  },
  {
    id: 6,
    title: "Neon Dreams",
    genre: "Cyberpunk",
    year: 2026,
    rating: 8.4,
    duration: "2h 15m",
    poster: "assets/posters/neon.jpg",
    backdrop: "assets/posters/neon-bg.jpg",
    video: "assets/videos/neon.mp4",
    description: "In a neon-lit metropolis where dreams can be bought and sold, a memory thief discovers a conspiracy that goes to the highest levels of corporate power.",
    type: "movie",
    trending: true,
    popular: true,
    new: true
  },
  {
    id: 7,
    title: "Whispers in the Dark",
    genre: "Horror",
    year: 2025,
    rating: 7.6,
    duration: "1h 55m",
    poster: "assets/posters/whispers.jpg",
    backdrop: "assets/posters/whispers-bg.jpg",
    video: "assets/videos/whispers.mp4",
    description: "A family moves into an old mansion, unaware of the dark secrets that lurk within its walls. When night falls, the whispers begin.",
    type: "movie",
    trending: false,
    popular: true,
    new: false
  },
  {
    id: 8,
    title: "Rise of Legends",
    genre: "Fantasy",
    year: 2026,
    rating: 8.8,
    duration: "2h 50m",
    poster: "assets/posters/legends.jpg",
    backdrop: "assets/posters/legends-bg.jpg",
    video: "assets/videos/legends.mp4",
    description: "Ancient prophecies foretell the return of darkness. Five unlikely heroes must unite to prevent the end of all realms.",
    type: "movie",
    trending: true,
    popular: true,
    new: true
  },
  {
    id: 9,
    title: "Velocity",
    genre: "Action",
    year: 2025,
    rating: 7.8,
    duration: "2h",
    poster: "assets/posters/velocity.jpg",
    backdrop: "assets/posters/velocity-bg.jpg",
    video: "assets/videos/velocity.mp4",
    description: "The world's most dangerous race attracts the best drivers from around the globe. But this year, the stakes are higher than ever.",
    type: "movie",
    trending: false,
    popular: true,
    new: false
  },
  {
    id: 10,
    title: "The Last Garden",
    genre: "Romance",
    year: 2025,
    rating: 8.1,
    duration: "1h 50m",
    poster: "assets/posters/garden.jpg",
    backdrop: "assets/posters/garden-bg.jpg",
    video: "assets/videos/garden.mp4",
    description: "Two strangers meet in the last remaining garden of a dying city. As they nurture the plants back to life, they discover love blooming in unexpected places.",
    type: "movie",
    trending: false,
    popular: false,
    new: true
  },
  {
    id: 11,
    title: "Quantum Break",
    genre: "Sci-Fi",
    year: 2026,
    rating: 8.3,
    duration: "2h 25m",
    poster: "assets/posters/quantum.jpg",
    backdrop: "assets/posters/quantum-bg.jpg",
    video: "assets/videos/quantum.mp4",
    description: "A physicist accidentally opens a rift in spacetime, creating multiple parallel realities. Now she must navigate through them to find her way home.",
    type: "movie",
    trending: true,
    popular: true,
    new: false
  },
  {
    id: 12,
    title: "Street Kings",
    genre: "Crime",
    year: 2025,
    rating: 7.7,
    duration: "2h 8m",
    poster: "assets/posters/street.jpg",
    backdrop: "assets/posters/street-bg.jpg",
    video: "assets/videos/street.mp4",
    description: "In the underground world of illegal street racing, loyalty is everything. But when betrayal strikes, vengeance becomes the only currency that matters.",
    type: "movie",
    trending: false,
    popular: true,
    new: false
  }
];

// Cast data for movie details
const castData = [
  { name: "Emma Stone", role: "Lead Actor", image: "assets/posters/cast1.jpg" },
  { name: "Ryan Gosling", role: "Supporting", image: "assets/posters/cast2.jpg" },
  { name: "Michael B. Jordan", role: "Lead Actor", image: "assets/posters/cast3.jpg" },
  { name: "Zendaya", role: "Lead Actress", image: "assets/posters/cast4.jpg" },
  { name: "Timothée Chalamet", role: "Supporting", image: "assets/posters/cast5.jpg" },
  { name: "Florence Pugh", role: "Lead Actress", image: "assets/posters/cast6.jpg" }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get URL parameters
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Generate star rating HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = (rating % 2) >= 1;
  let starsHTML = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHTML += '<i class="fas fa-star"></i>';
    } else if (i === fullStars && hasHalfStar) {
      starsHTML += '<i class="fas fa-star-half-alt"></i>';
    } else {
      starsHTML += '<i class="far fa-star"></i>';
    }
  }
  return starsHTML;
}

// Create ripple effect on button click
function createRipple(e, button) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
  ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
  
  button.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 600);
}

// ============================================
// ONBOARDING FUNCTIONS
// ============================================

function enterApp() {
  const onboarding = document.getElementById('onboarding');
  if (onboarding) {
    onboarding.classList.add('fade-out');
    
    // Store in localStorage to skip onboarding next time
    localStorage.setItem('scena_visited', 'true');
    
    setTimeout(() => {
      onboarding.style.display = 'none';
    }, 800);
  }
}

// Check if user has visited before
function checkFirstVisit() {
  const onboarding = document.getElementById('onboarding');
  if (onboarding && localStorage.getItem('scena_visited')) {
    onboarding.style.display = 'none';
  }
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function goHome() {
  window.location.href = 'index.html';
}

function goBack() {
  window.history.back();
}

// Navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}

// ============================================
// MOVIE CARD FUNCTIONS
// ============================================

// Create movie card HTML
function createMovieCard(movie, isSlider = false) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.onclick = () => goToMovie(movie.id);
  
  // Use placeholder if poster doesn't exist
  const posterUrl = movie.poster || 'assets/posters/default.jpg';
  
  card.innerHTML = `
    <div class="movie-card-glow"></div>
    <img src="${posterUrl}" alt="${movie.title}" loading="lazy" onerror="this.src='assets/posters/default.jpg'">
    <div class="movie-card-overlay">
      <h3 class="movie-card-title">${movie.title}</h3>
      <div class="movie-card-meta">
        <span><i class="fas fa-star" style="color: var(--accent-emerald);"></i> ${movie.rating}</span>
        <span>${movie.year}</span>
        <span>${movie.genre}</span>
      </div>
    </div>
  `;
  
  return card;
}

// Create cast card HTML
function createCastCard(cast) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.style.width = '150px';
  
  card.innerHTML = `
    <div class="movie-card-glow"></div>
    <img src="${cast.image || 'assets/posters/default.jpg'}" alt="${cast.name}" loading="lazy" onerror="this.src='assets/posters/default.jpg'">
    <div class="movie-card-overlay">
      <h3 class="movie-card-title">${cast.name}</h3>
      <div class="movie-card-meta">
        <span>${cast.role}</span>
      </div>
    </div>
  `;
  
  return card;
}

// Navigate to movie detail page
function goToMovie(movieId) {
  window.location.href = `movie.html?id=${movieId}`;
}

// Navigate to watch page
function watchMovie(movieId) {
  window.location.href = `watch.html?id=${movieId}`;
}

// ============================================
// SLIDER FUNCTIONS
// ============================================

function scrollSlider(sliderId, direction) {
  const slider = document.getElementById(sliderId);
  if (slider) {
    const scrollAmount = 220; // card width + gap
    slider.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
}

// ============================================
// SEARCH FUNCTIONS
// ============================================

function toggleSearch() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('searchInput');
  
  if (modal) {
    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    } else {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      if (input) input.focus();
    }
  }
}

function searchMovies(query) {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(lowerQuery) ||
    movie.genre.toLowerCase().includes(lowerQuery) ||
    movie.year.toString().includes(lowerQuery)
  );
}

function displaySearchResults(results) {
  const container = document.getElementById('searchResults');
  if (!container) return;
  
  if (results.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No movies found</p>';
    return;
  }
  
  container.innerHTML = '';
  results.forEach(movie => {
    const resultItem = document.createElement('div');
    resultItem.style.cssText = 'display: flex; align-items: center; gap: 1rem; padding: 1rem; cursor: pointer; border-radius: 8px; transition: background 0.3s;';
    resultItem.innerHTML = `
      <img src="${movie.poster || 'assets/posters/default.jpg'}" alt="${movie.title}" style="width: 60px; height: 90px; object-fit: cover; border-radius: 4px;" onerror="this.src='assets/posters/default.jpg'">
      <div>
        <h4 style="margin-bottom: 0.3rem;">${movie.title}</h4>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">${movie.genre} • ${movie.year} • <i class="fas fa-star" style="color: var(--accent-emerald);"></i> ${movie.rating}</p>
      </div>
    `;
    resultItem.onmouseenter = () => resultItem.style.background = 'var(--bg-secondary)';
    resultItem.onmouseleave = () => resultItem.style.background = 'transparent';
    resultItem.onclick = () => goToMovie(movie.id);
    container.appendChild(resultItem);
  });
}

// ============================================
// MY LIST FUNCTIONS (LOCALSTORAGE)
// ============================================

function getMyList() {
  const list = localStorage.getItem('scena_mylist');
  return list ? JSON.parse(list) : [];
}

function addToList(movieId) {
  const myList = getMyList();
  if (!myList.includes(movieId)) {
    myList.push(movieId);
    localStorage.setItem('scena_mylist', JSON.stringify(myList));
    showNotification('Added to My List');
    renderMyList();
  } else {
    showNotification('Already in My List');
  }
}

function addToListFromWatch() {
  const movieId = parseInt(getUrlParam('id'));
  if (movieId) {
    addToList(movieId);
  }
}

function removeFromList(movieId) {
  const myList = getMyList();
  const index = myList.indexOf(movieId);
  if (index > -1) {
    myList.splice(index, 1);
    localStorage.setItem('scena_mylist', JSON.stringify(myList));
    showNotification('Removed from My List');
    renderMyList();
  }
}

function renderMyList() {
  const container = document.getElementById('myListGrid');
  if (!container) return;
  
  const myList = getMyList();
  
  if (myList.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--text-muted); grid-column: 1/-1;">
        <i class="fas fa-film" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>Your list is empty. Add movies to watch later!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = '';
  myList.forEach(movieId => {
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
      const card = createMovieCard(movie);
      // Add remove button
      const removeBtn = document.createElement('button');
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.style.cssText = 'position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); border: none; color: white; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; z-index: 10;';
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        removeFromList(movieId);
      };
      card.appendChild(removeBtn);
      container.appendChild(card);
    }
  });
}

// ============================================
// NOTIFICATION
// ============================================

function showNotification(message) {
  // Remove existing notification
  const existing = document.querySelector('.scena-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = 'scena-notification';
  notification.style.cssText = 'position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: var(--accent-red); color: white; padding: 1rem 2rem; border-radius: 50px; font-weight: 600; z-index: 9999; animation: slideUp 0.3s ease;';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// ============================================
// PAGE RENDERING FUNCTIONS
// ============================================

// Render home page sections
function renderHomePage() {
  // Render Trending slider
  const trendingSlider = document.getElementById('trendingSlider');
  if (trendingSlider) {
    const trendingMovies = movies.filter(m => m.trending);
    trendingMovies.forEach(movie => {
      trendingSlider.appendChild(createMovieCard(movie, true));
    });
  }
  
  // Render Popular grid
  const popularGrid = document.getElementById('popularGrid');
  if (popularGrid) {
    const popularMovies = movies.filter(m => m.popular);
    popularMovies.forEach(movie => {
      popularGrid.appendChild(createMovieCard(movie));
    });
  }
  
  // Render New Release slider
  const newSlider = document.getElementById('newSlider');
  if (newSlider) {
    const newMovies = movies.filter(m => m.new);
    newMovies.forEach(movie => {
      newSlider.appendChild(createMovieCard(movie, true));
    });
  }
  
  // Render My List
  renderMyList();
}

// Load movie details page
function loadMovieDetails() {
  const movieId = parseInt(getUrlParam('id'));
  if (!movieId) return;
  
  const movie = movies.find(m => m.id === movieId);
  if (!movie) return;
  
  // Update page title
  document.title = `${movie.title} - SCENA`;
  
  // Update backdrop
  const backdrop = document.getElementById('detailBackdrop');
  if (backdrop) {
    backdrop.style.backgroundImage = `url('${movie.backdrop || movie.poster}')`;
  }
  
  // Update poster
  const poster = document.getElementById('detailPoster');
  if (poster) {
    poster.src = movie.poster || 'assets/posters/default.jpg';
    poster.onerror = () => { poster.src = 'assets/posters/default.jpg'; };
  }
  
  // Update info
  const title = document.getElementById('detailTitle');
  if (title) title.textContent = movie.title;
  
  const rating = document.getElementById('detailRating');
  if (rating) rating.innerHTML = `<i class="fas fa-star"></i> ${movie.rating}`;
  
  const year = document.getElementById('detailYear');
  if (year) year.textContent = movie.year;
  
  const genre = document.getElementById('detailGenre');
  if (genre) genre.textContent = movie.genre;
  
  const duration = document.getElementById('detailDuration');
  if (duration) duration.textContent = movie.duration;
  
  const desc = document.getElementById('detailDesc');
  if (desc) desc.textContent = movie.description;
  
  // Update buttons
  const watchBtn = document.getElementById('watchBtn');
  if (watchBtn) {
    watchBtn.onclick = () => window.location.href = `watch.html?id=${movie.id}`;
  }
  
  const addListBtn = document.getElementById('addListBtn');
  if (addListBtn) {
    addListBtn.onclick = () => addToList(movie.id);
  }
  
  // Render similar movies (same genre)
  const similarContainer = document.getElementById('similarMovies');
  if (similarContainer) {
    const similarMovies = movies.filter(m => m.genre === movie.genre && m.id !== movie.id).slice(0, 4);
    if (similarMovies.length === 0) {
      similarContainer.innerHTML = '<p style="color: var(--text-muted);">No similar movies found</p>';
    } else {
      similarMovies.forEach(m => {
        similarContainer.appendChild(createMovieCard(m));
      });
    }
  }
  
  // Render cast
  const castContainer = document.getElementById('castSlider');
  if (castContainer) {
    castData.forEach(cast => {
      castContainer.appendChild(createCastCard(cast));
    });
  }
}

// Load watch page
function loadWatchPage() {
  const movieId = parseInt(getUrlParam('id'));
  if (!movieId) return;
  
  const movie = movies.find(m => m.id === movieId);
  if (!movie) return;
  
  // Update page title
  document.title = `Watch ${movie.title} - SCENA`;
  
  // Update video source
  const video = document.getElementById('mainVideo');
  if (video) {
    video.innerHTML = `<source src="${movie.video}" type="video/mp4">`;
    video.load();
  }
  
  // Update info
  const title = document.getElementById('watchTitle');
  if (title) title.textContent = movie.title;
  
  const genre = document.getElementById('watchGenre');
  if (genre) genre.textContent = movie.genre;
  
  const year = document.getElementById('watchYear');
  if (year) year.textContent = movie.year;
  
  const duration = document.getElementById('watchDuration');
  if (duration) duration.textContent = movie.duration;
  
  // Render up next (random movies excluding current)
  const upNextContainer = document.getElementById('upNextSlider');
  if (upNextContainer) {
    const upNext = movies.filter(m => m.id !== movie.id).slice(0, 6);
    upNext.forEach(m => {
      upNextContainer.appendChild(createMovieCard(m, true));
    });
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Check first visit for onboarding
  checkFirstVisit();
  
  // Navbar scroll effect
  window.addEventListener('scroll', handleNavbarScroll);
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Add ripple effect to all buttons
  document.querySelectorAll('.btn, .enter-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      createRipple(e, this);
    });
  });
  
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const results = searchMovies(e.target.value);
      displaySearchResults(results);
    });
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleSearch();
      }
    });
  }
  
  // Close search modal on backdrop click
  const searchModal = document.getElementById('searchModal');
  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        toggleSearch();
      }
    });
  }
  
  // Render home page if on index
  if (document.getElementById('trendingSlider')) {
    renderHomePage();
  }
});

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;
document.head.appendChild(style);
