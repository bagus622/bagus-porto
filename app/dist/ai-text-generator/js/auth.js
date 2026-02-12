/**
 * Lexora AI - Authentication Module
 * Handles user registration, login, logout, and session management
 * Uses LocalStorage for data persistence (demo purposes only)
 */

// Dummy Users Data
const DUMMY_USERS = [
  {
    id: '1',
    email: 'demo@lexora.ai',
    password: 'demo123', // Will be hashed
    name: 'Demo User',
    plan: 'Pro',
    createdAt: '2026-02-12T00:00:00.000Z',
    settings: {
      darkMode: false,
      language: 'en'
    }
  },
  {
    id: '2',
    email: 'admin@lexora.ai',
    password: 'admin123',
    name: 'Admin User',
    plan: 'Unlimited',
    createdAt: '2026-02-12T00:00:00.000Z',
    settings: {
      darkMode: true,
      language: 'en'
    }
  },
  {
    id: '3',
    email: 'user@lexora.ai',
    password: 'user123',
    name: 'Test User',
    plan: 'Free',
    createdAt: '2026-02-12T00:00:00.000Z',
    settings: {
      darkMode: false,
      language: 'id'
    }
  }
];

// Auth State
const Auth = {
  currentUser: null,
  
  // Initialize auth system
  init() {
    this.createDummyUsers();
    this.checkSession();
    this.setupEventListeners();
  },
  
  // Create dummy users if none exist
  createDummyUsers() {
    const existingUsers = localStorage.getItem('users');
    console.log('🔍 Checking users in localStorage:', existingUsers ? 'Found' : 'Not found');
    
    if (!existingUsers) {
      // Hash passwords and save dummy users
      const usersWithHashedPasswords = DUMMY_USERS.map(user => ({
        ...user,
        password: this.hashPassword(user.password)
      }));
      localStorage.setItem('users', JSON.stringify(usersWithHashedPasswords));
      console.log('✅ Dummy users created successfully!');
      console.log('📋 Users:', usersWithHashedPasswords);
    } else {
      console.log('📋 Existing users found:', JSON.parse(existingUsers).length);
    }
  },
  
  // Check if user is logged in
  checkSession() {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        this.currentUser = JSON.parse(session);
        return true;
      } catch (e) {
        localStorage.removeItem('session');
        return false;
      }
    }
    return false;
  },
  
  // Get current user
  getCurrentUser() {
    return this.currentUser;
  },
  
  // Check if authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  },
  
  // Register new user
  register(email, password, name = '') {
    // Get existing users
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: this.hashPassword(password), // Simple hash for demo
      name: name || email.split('@')[0],
      plan: 'Free',
      createdAt: new Date().toISOString(),
      settings: {
        darkMode: false,
        language: 'en'
      }
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Create session
    const session = { ...newUser };
    delete session.password;
    localStorage.setItem('session', JSON.stringify(session));
    this.currentUser = session;
    
    return { success: true, message: 'Registration successful' };
  },
  
  // Login user
  login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('🔍 Login attempt for:', email);
    console.log('📋 Total users in database:', users.length);
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log('❌ User not found');
      return { success: false, message: 'Email not found' };
    }
    
    console.log('👤 User found:', user.email);
    console.log('🔐 Stored password hash:', user.password);
    console.log('🔐 Input password hash:', this.hashPassword(password));
    
    if (user.password !== this.hashPassword(password)) {
      console.log('❌ Password mismatch');
      return { success: false, message: 'Invalid password' };
    }
    
    // Create session
    const session = { ...user };
    delete session.password;
    localStorage.setItem('session', JSON.stringify(session));
    this.currentUser = session;
    console.log('✅ Login successful!');
    
    return { success: true, message: 'Login successful' };
  },
  
  // Logout user
  logout() {
    localStorage.removeItem('session');
    this.currentUser = null;
    window.location.href = 'login.html';
  },
  
  // Update user profile
  updateProfile(updates) {
    if (!this.currentUser) return { success: false, message: 'Not authenticated' };
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === this.currentUser.id);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }
    
    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update session
    const session = { ...users[userIndex] };
    delete session.password;
    localStorage.setItem('session', JSON.stringify(session));
    this.currentUser = session;
    
    return { success: true, message: 'Profile updated' };
  },
  
  // Delete account
  deleteAccount() {
    if (!this.currentUser) return { success: false, message: 'Not authenticated' };
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(u => u.id !== this.currentUser.id);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Clear all user data
    localStorage.removeItem('session');
    localStorage.removeItem(`history_${this.currentUser.id}`);
    this.currentUser = null;
    
    return { success: true, message: 'Account deleted' };
  },
  
  // Simple password hash (for demo only - NOT secure)
  hashPassword(password) {
    let hash = 0;
    if (password.length === 0) return hash.toString();
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash >>> 0; // Ensure positive integer
    }
    return hash.toString();
  },
  
  // Setup event listeners
  setupEventListeners() {
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister();
      });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  },
  
  // Handle register form submission
  handleRegister() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    // Register
    const result = this.register(email, password, name);
    
    if (result.success) {
      showToast(result.message, 'success');
      setTimeout(() => {
        window.location.href = 'app.html';
      }, 1000);
    } else {
      showToast(result.message, 'error');
    }
  },
  
  // Handle login form submission
  handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked;
    
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    const result = this.login(email, password);
    
    if (result.success) {
      showToast(result.message, 'success');
      
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      setTimeout(() => {
        window.location.href = 'app.html';
      }, 1000);
    } else {
      showToast(result.message, 'error');
    }
  },
  
  // Protect route - redirect to login if not authenticated
  protectRoute() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },
  
  // Redirect if already authenticated
  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      window.location.href = 'app.html';
      return true;
    }
    return false;
  }
};

// Toast notification system
function showToast(message, type = 'info') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: 'check-circle',
    error: 'times-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  
  const titles = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
  };
  
  toast.innerHTML = `
    <i class="fas fa-${icons[type]} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${titles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Create toast container
function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
