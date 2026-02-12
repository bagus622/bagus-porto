/**
 * Lexora AI - Main Application Module
 * Handles dashboard functionality, UI interactions, and state management
 */

// App State
const App = {
  currentSection: 'generate',
  isGenerating: false,
  currentOutput: null,
  sidebarCollapsed: false,
  darkMode: false,
  
  // Initialize app
  init() {
    // Check authentication
    if (!Auth.isAuthenticated()) {
      window.location.href = 'login.html';
      return;
    }
    
    this.loadUserData();
    this.setupEventListeners();
    this.setupTheme();
    this.renderUserInfo();
    this.loadHistory();
    this.loadTemplates();
  },
  
  // Load user data
  loadUserData() {
    const user = Auth.getCurrentUser();
    if (user) {
      this.darkMode = user.settings?.darkMode || false;
    }
  },
  
  // Setup theme
  setupTheme() {
    if (this.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.checked = this.darkMode;
    }
  },
  
  // Toggle dark mode
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    
    if (this.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Save preference
    Auth.updateProfile({
      settings: { ...Auth.getCurrentUser().settings, darkMode: this.darkMode }
    });
  },
  
  // Render user info in UI
  renderUserInfo() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    
    // Update user name displays
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => el.textContent = user.name);
    
    // Update user plan displays
    const userPlanElements = document.querySelectorAll('.user-plan');
    userPlanElements.forEach(el => el.textContent = user.plan + ' Plan');
    
    // Update avatar
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(el => {
      el.textContent = user.name.charAt(0).toUpperCase();
    });
  },
  
  // Setup event listeners
  setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Navigation items
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const section = item.dataset.section;
        if (section) {
          this.navigateTo(section);
        }
      });
    });
    
    // Generate form
    const generateForm = document.getElementById('generateForm');
    if (generateForm) {
      generateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleGenerate();
      });
    }
    
    // Regenerate button
    const regenerateBtn = document.getElementById('regenerateBtn');
    if (regenerateBtn) {
      regenerateBtn.addEventListener('click', () => this.handleRegenerate());
    }
    
    // Copy button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyOutput());
    }
    
    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadOutput());
    }
    
    // Template items
    const templateItems = document.querySelectorAll('.template-item');
    templateItems.forEach(item => {
      item.addEventListener('click', () => {
        const template = item.dataset.template;
        this.applyTemplate(template);
      });
    });
    
    // Quick action buttons
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleQuickAction(action);
      });
    });
    
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', () => this.toggleDarkMode());
    }
    
    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSettings();
      });
    }
    
    // Reset history button
    const resetHistoryBtn = document.getElementById('resetHistoryBtn');
    if (resetHistoryBtn) {
      resetHistoryBtn.addEventListener('click', () => this.resetHistory());
    }
    
    // Delete account button
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
      deleteAccountBtn.addEventListener('click', () => this.showDeleteAccountModal());
    }
    
    // Range sliders
    const rangeSliders = document.querySelectorAll('.range-slider');
    rangeSliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const valueDisplay = document.getElementById(slider.dataset.valueDisplay);
        if (valueDisplay) {
          valueDisplay.textContent = e.target.value;
        }
      });
    });
    
    // Close modal buttons
    const closeModalBtns = document.querySelectorAll('.modal-close, .modal-cancel');
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', () => this.closeModals());
    });
    
    // Confirm delete account
    const confirmDeleteBtn = document.getElementById('confirmDeleteAccount');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', () => this.deleteAccount());
    }
  },
  
  // Toggle sidebar
  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    this.sidebarCollapsed = !this.sidebarCollapsed;
    
    if (this.sidebarCollapsed) {
      sidebar.classList.add('collapsed');
    } else {
      sidebar.classList.remove('collapsed');
    }
  },
  
  // Toggle mobile menu
  toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
  },
  
  // Navigate to section
  navigateTo(section) {
    this.currentSection = section;
    
    // Update active nav item
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.section === section) {
        item.classList.add('active');
      }
    });
    
    // Show corresponding content
    document.querySelectorAll('.page-content').forEach(content => {
      content.classList.add('hidden');
    });
    
    const targetContent = document.getElementById(`${section}Page`);
    if (targetContent) {
      targetContent.classList.remove('hidden');
    }
    
    // Close mobile menu
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('mobile-open');
    
    // Update page title
    this.updatePageTitle(section);
  },
  
  // Update page title
  updatePageTitle(section) {
    const titles = {
      dashboard: 'Dashboard',
      generate: 'Generate Text',
      history: 'History',
      templates: 'Templates',
      settings: 'Settings'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
      pageTitle.textContent = titles[section] || section;
    }
  },
  
  // Handle generate form submission
  async handleGenerate() {
    if (this.isGenerating) return;
    
    const topic = document.getElementById('topic').value.trim();
    const tone = document.getElementById('tone').value;
    const type = document.getElementById('contentType').value;
    const keywords = document.getElementById('keywords').value.trim();
    const wordCount = document.getElementById('wordCount').value;
    const language = document.getElementById('language').value;
    const creativity = document.getElementById('creativity').value;
    
    if (!topic) {
      showToast('Please enter a topic', 'error');
      return;
    }
    
    this.isGenerating = true;
    this.showLoadingState();
    
    try {
      const result = await AI.generate({
        topic,
        tone,
        type,
        keywords,
        wordCount,
        language,
        creativity
      });
      
      if (result.success) {
        this.currentOutput = result;
        this.displayOutput(result.content);
        this.saveToHistory(result);
        showToast('Content generated successfully!', 'success');
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Generation failed. Please try again.', 'error');
    } finally {
      this.isGenerating = false;
      this.hideLoadingState();
    }
  },
  
  // Handle regenerate
  async handleRegenerate() {
    if (this.currentOutput) {
      const topic = document.getElementById('topic').value.trim();
      const tone = document.getElementById('tone').value;
      const type = document.getElementById('contentType').value;
      
      // Add variation to topic for different output
      const variations = ['advanced', 'complete', 'ultimate', 'essential'];
      const randomVariation = variations[Math.floor(Math.random() * variations.length)];
      
      document.getElementById('topic').value = `${randomVariation} ${topic}`;
      await this.handleGenerate();
      document.getElementById('topic').value = topic;
    }
  },
  
  // Show loading state
  showLoadingState() {
    const outputContent = document.getElementById('outputContent');
    const generateBtn = document.getElementById('generateBtn');
    
    if (outputContent) {
      outputContent.innerHTML = `
        <div class="skeleton-container">
          <div class="skeleton skeleton-text" style="width: 100%;"></div>
          <div class="skeleton skeleton-text" style="width: 90%;"></div>
          <div class="skeleton skeleton-text" style="width: 95%;"></div>
          <div class="skeleton skeleton-text" style="width: 85%;"></div>
          <div class="skeleton skeleton-text" style="width: 100%;"></div>
          <div class="skeleton skeleton-text" style="width: 80%;"></div>
        </div>
      `;
    }
    
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }
  },
  
  // Hide loading state
  hideLoadingState() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate';
    }
  },
  
  // Display generated output
  displayOutput(content) {
    const outputContent = document.getElementById('outputContent');
    if (outputContent) {
      outputContent.innerHTML = `<div class="output-text">${this.escapeHtml(content)}</div>`;
      
      // Animate text appearance
      const textElement = outputContent.querySelector('.output-text');
      textElement.style.opacity = '0';
      textElement.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        textElement.style.transition = 'all 0.5s ease';
        textElement.style.opacity = '1';
        textElement.style.transform = 'translateY(0)';
      }, 100);
    }
  },
  
  // Escape HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
  
  // Copy output to clipboard
  async copyOutput() {
    if (!this.currentOutput) {
      showToast('No content to copy', 'warning');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(this.currentOutput.content);
      showToast('Copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
  },
  
  // Download output as .txt file
  downloadOutput() {
    if (!this.currentOutput) {
      showToast('No content to download', 'warning');
      return;
    }
    
    const blob = new Blob([this.currentOutput.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexora-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Downloaded successfully!', 'success');
  },
  
  // Save to history
  saveToHistory(result) {
    const user = Auth.getCurrentUser();
    if (!user) return;
    
    const historyKey = `history_${user.id}`;
    let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    const historyItem = {
      id: Date.now().toString(),
      content: result.content,
      meta: result.meta,
      date: new Date().toISOString()
    };
    
    history.unshift(historyItem);
    
    // Keep only last 50 items
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history));
    this.loadHistory();
  },
  
  // Load history
  loadHistory() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    
    const historyKey = `history_${user.id}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    // Update history list in sidebar
    const historyList = document.getElementById('historyList');
    if (historyList) {
      if (history.length === 0) {
        historyList.innerHTML = `
          <div class="history-empty">
            <i class="fas fa-history"></i>
            <p>No history yet</p>
          </div>
        `;
      } else {
        historyList.innerHTML = history.slice(0, 5).map(item => {
          const preview = item.content.substring(0, 60) + '...';
          const date = new Date(item.date).toLocaleDateString();
          return `
            <div class="history-item" data-id="${item.id}">
              <div class="history-preview">${this.escapeHtml(preview)}</div>
              <div class="history-meta">
                <span><i class="fas fa-file-alt"></i> ${item.meta.type}</span>
                <span><i class="fas fa-calendar"></i> ${date}</span>
              </div>
            </div>
          `;
        }).join('');
        
        // Add click handlers
        historyList.querySelectorAll('.history-item').forEach(item => {
          item.addEventListener('click', () => {
            this.loadHistoryItem(item.dataset.id);
          });
        });
      }
    }
    
    // Update history page if exists
    this.renderHistoryPage(history);
  },
  
  // Render history page
  renderHistoryPage(history) {
    const historyItemsContainer = document.getElementById('historyItems');
    if (historyItemsContainer) {
      if (history.length === 0) {
        historyItemsContainer.innerHTML = `
          <div class="history-empty" style="padding: 64px;">
            <i class="fas fa-history" style="font-size: 48px;"></i>
            <p style="margin-top: 16px;">No generation history yet</p>
            <p style="font-size: 13px;">Start generating content to see your history here</p>
          </div>
        `;
      } else {
        historyItemsContainer.innerHTML = history.map(item => {
          const preview = item.content.substring(0, 100) + '...';
          const date = new Date(item.date).toLocaleString();
          return `
            <div class="history-item" data-id="${item.id}">
              <div class="history-preview">${this.escapeHtml(preview)}</div>
              <div class="history-meta">
                <span><i class="fas fa-file-alt"></i> ${item.meta.type}</span>
                <span><i class="fas fa-magic"></i> ${item.meta.tone}</span>
                <span><i class="fas fa-clock"></i> ${date}</span>
              </div>
            </div>
          `;
        }).join('');
        
        // Add click handlers
        historyItemsContainer.querySelectorAll('.history-item').forEach(item => {
          item.addEventListener('click', () => {
            this.loadHistoryItem(item.dataset.id);
          });
        });
      }
    }
  },
  
  // Load history item
  loadHistoryItem(id) {
    const user = Auth.getCurrentUser();
    if (!user) return;
    
    const historyKey = `history_${user.id}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const item = history.find(h => h.id === id);
    
    if (item) {
      this.currentOutput = item;
      this.displayOutput(item.content);
      this.navigateTo('generate');
      showToast('History item loaded', 'info');
    }
  },
  
  // Reset history
  resetHistory() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      const historyKey = `history_${user.id}`;
      localStorage.removeItem(historyKey);
      this.loadHistory();
      showToast('History cleared', 'success');
    }
  },
  
  // Load templates
  loadTemplates() {
    const templatesContainer = document.getElementById('templatesGrid');
    if (templatesContainer) {
      const templates = Object.entries(AI.templates).map(([key, template]) => ({
        key,
        ...template
      }));
      
      templatesContainer.innerHTML = templates.map(template => `
        <div class="template-card" data-template="${template.key}">
          <div class="template-card-image">${template.icon}</div>
          <div class="template-card-content">
            <h3 class="template-card-title">${template.name}</h3>
            <p class="template-card-desc">${template.description}</p>
            <div class="template-card-meta">
              <span><i class="fas fa-bolt"></i> Quick</span>
              <span><i class="fas fa-star"></i> Popular</span>
            </div>
          </div>
        </div>
      `).join('');
      
      // Add click handlers
      templatesContainer.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
          this.applyTemplate(card.dataset.template);
        });
      });
    }
  },
  
  // Apply template
  applyTemplate(templateKey) {
    const template = AI.templates[templateKey];
    if (!template) return;
    
    // Map template to content type
    const typeMap = {
      blog: 'blog',
      caption: 'caption',
      script: 'script',
      email: 'email',
      product: 'product',
      outline: 'blog'
    };
    
    const contentType = document.getElementById('contentType');
    if (contentType && typeMap[templateKey]) {
      contentType.value = typeMap[templateKey];
    }
    
    // Set a sample topic
    const topicInput = document.getElementById('topic');
    if (topicInput) {
      const sampleTopics = {
        blog: 'digital marketing strategies',
        caption: 'morning coffee routine',
        script: 'productivity tips for entrepreneurs',
        email: 'new product launch announcement',
        product: 'wireless noise-canceling headphones',
        outline: 'content marketing best practices'
      };
      topicInput.value = sampleTopics[templateKey] || 'your topic here';
    }
    
    this.navigateTo('generate');
    showToast(`Template "${template.name}" applied!`, 'success');
    
    // Focus on topic input
    setTimeout(() => {
      topicInput?.focus();
    }, 100);
  },
  
  // Handle quick actions
  handleQuickAction(action) {
    if (!this.currentOutput) {
      showToast('Generate content first', 'warning');
      return;
    }
    
    const result = AI.rewrite(this.currentOutput.content, action, 'casual');
    
    if (result.success) {
      this.currentOutput = { ...this.currentOutput, content: result.content };
      this.displayOutput(result.content);
      
      const actionNames = {
        shorten: 'Shortened',
        expand: 'Expanded',
        rewrite: 'Rewritten',
        emotional: 'Made more emotional',
        seo: 'SEO optimized'
      };
      
      showToast(`${actionNames[action]} successfully!`, 'success');
    }
  },
  
  // Save settings
  saveSettings() {
    const name = document.getElementById('settingsName').value.trim();
    
    if (name) {
      const result = Auth.updateProfile({ name });
      if (result.success) {
        this.renderUserInfo();
        showToast('Settings saved!', 'success');
      }
    }
  },
  
  // Show delete account modal
  showDeleteAccountModal() {
    const modal = document.getElementById('deleteAccountModal');
    if (modal) {
      modal.classList.add('active');
    }
  },
  
  // Close all modals
  closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.classList.remove('active');
    });
  },
  
  // Delete account
  deleteAccount() {
    const result = Auth.deleteAccount();
    if (result.success) {
      showToast('Account deleted. Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    }
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

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on the app page
  if (document.getElementById('appLayout')) {
    App.init();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
