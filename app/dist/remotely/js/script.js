/**
 * REMOTELY - Remote Job Platform
 * Main JavaScript File
 * 
 * Features:
 * - Dummy job data
 * - localStorage for saved jobs
 * - Search & filter functionality
 * - Dark mode toggle
 * - Toast notifications
 * - Responsive navigation
 */

// ============================================
// DUMMY DATA - Jobs
// ============================================

const jobsData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechFlow",
    companyId: 1,
    location: "Worldwide",
    type: "remote",
    salary: "$80,000 - $120,000",
    postedAt: "2 days ago",
    description: "We are looking for an experienced Frontend Developer to join our remote team. You will be responsible for building and maintaining modern web applications using React and TypeScript.",
    requirements: [
      "5+ years of experience with React",
      "Strong TypeScript skills",
      "Experience with state management (Redux/Zustand)",
      "Knowledge of modern CSS frameworks",
      "Excellent communication skills"
    ],
    benefits: [
      "Competitive salary",
      "Flexible working hours",
      "Annual team retreats",
      "Health insurance",
      "Learning budget"
    ],
    logo: "TF",
    color: "#4F46E5"
  },
  {
    id: 2,
    title: "Product Designer",
    company: "DesignStudio",
    companyId: 2,
    location: "US, Canada",
    type: "remote",
    salary: "$70,000 - $100,000",
    postedAt: "3 days ago",
    description: "Join our creative team as a Product Designer. You'll work on exciting projects for clients worldwide, creating beautiful and functional user interfaces.",
    requirements: [
      "3+ years of product design experience",
      "Proficiency in Figma",
      "Strong portfolio showcasing UI/UX work",
      "Experience with design systems",
      "Ability to work independently"
    ],
    benefits: [
      "Remote-first culture",
      "Unlimited PTO",
      "Home office stipend",
      "Professional development",
      "Team workshops"
    ],
    logo: "DS",
    color: "#EC4899"
  },
  {
    id: 3,
    title: "Full Stack Engineer",
    company: "CloudBase",
    companyId: 3,
    location: "Europe",
    type: "hybrid",
    salary: "€60,000 - €90,000",
    postedAt: "1 week ago",
    description: "CloudBase is seeking a talented Full Stack Engineer to help build scalable cloud infrastructure solutions. You'll work with cutting-edge technologies.",
    requirements: [
      "4+ years of full stack development",
      "Node.js and Python experience",
      "Cloud platform knowledge (AWS/GCP)",
      "Database design and optimization",
      "Microservices architecture"
    ],
    benefits: [
      "Stock options",
      "Flexible hybrid work",
      "Conference attendance",
      "Gym membership",
      "Mental health support"
    ],
    logo: "CB",
    color: "#06B6D4"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "ScaleUp",
    companyId: 4,
    location: "Worldwide",
    type: "remote",
    salary: "$90,000 - $140,000",
    postedAt: "4 days ago",
    description: "Help us scale our infrastructure! We're looking for a DevOps Engineer to automate deployments and improve our CI/CD pipelines.",
    requirements: [
      "Strong Linux administration skills",
      "Docker and Kubernetes expertise",
      "Terraform or CloudFormation experience",
      "CI/CD pipeline management",
      "Monitoring and logging tools"
    ],
    benefits: [
      "Competitive compensation",
      "Remote work allowance",
      "Latest tech equipment",
      "Education budget",
      "Wellness programs"
    ],
    logo: "SU",
    color: "#8B5CF6"
  },
  {
    id: 5,
    title: "Mobile Developer (React Native)",
    company: "AppWorks",
    companyId: 5,
    location: "Asia Pacific",
    type: "remote",
    salary: "$50,000 - $80,000",
    postedAt: "5 days ago",
    description: "Build amazing mobile experiences! We're looking for a React Native developer to create cross-platform mobile applications.",
    requirements: [
      "3+ years React Native experience",
      "iOS and Android deployment knowledge",
      "State management (Redux/MobX)",
      "API integration experience",
      "UI/UX sensibility"
    ],
    benefits: [
      "Flexible schedule",
      "Performance bonuses",
      "Team building events",
      "Health coverage",
      "Career growth path"
    ],
    logo: "AW",
    color: "#F59E0B"
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "DataDriven",
    companyId: 6,
    location: "US, UK",
    type: "hybrid",
    salary: "$100,000 - $150,000",
    postedAt: "1 day ago",
    description: "Join our data team to build machine learning models and extract insights from large datasets. You'll work on challenging problems.",
    requirements: [
      "MS/PhD in Data Science or related field",
      "Python and SQL proficiency",
      "Machine learning frameworks (TensorFlow/PyTorch)",
      "Statistical analysis skills",
      "Data visualization experience"
    ],
    benefits: [
      "Research time",
      "Conference travel",
      "Publication support",
      "Comprehensive benefits",
      "Equity package"
    ],
    logo: "DD",
    color: "#10B981"
  },
  {
    id: 7,
    title: "Backend Engineer (Go)",
    company: "FastAPI",
    companyId: 7,
    location: "Worldwide",
    type: "remote",
    salary: "$85,000 - $130,000",
    postedAt: "6 days ago",
    description: "We're building high-performance APIs with Go. Join us to work on scalable backend systems serving millions of requests.",
    requirements: [
      "Strong Go programming skills",
      "Experience with gRPC and REST APIs",
      "Database knowledge (PostgreSQL/MongoDB)",
      "Distributed systems understanding",
      "Testing and debugging skills"
    ],
    benefits: [
      "Fully remote",
      "Async work culture",
      "Generous PTO",
      "Home office setup",
      "Learning resources"
    ],
    logo: "FA",
    color: "#3B82F6"
  },
  {
    id: 8,
    title: "UX Researcher",
    company: "UserFirst",
    companyId: 8,
    location: "North America",
    type: "remote",
    salary: "$75,000 - $110,000",
    postedAt: "1 week ago",
    description: "Help us understand our users better! We're looking for a UX Researcher to conduct studies and inform product decisions.",
    requirements: [
      "3+ years UX research experience",
      "Qualitative and quantitative methods",
      "Usability testing expertise",
      "Data analysis skills",
      "Strong presentation abilities"
    ],
    benefits: [
      "User research tools budget",
      "Flexible hours",
      "Professional development",
      "Health and dental",
      "Parental leave"
    ],
    logo: "UF",
    color: "#EF4444"
  },
  {
    id: 9,
    title: "Technical Writer",
    company: "DocuPro",
    companyId: 9,
    location: "Worldwide",
    type: "remote",
    salary: "$60,000 - $90,000",
    postedAt: "3 days ago",
    description: "Create clear and comprehensive documentation for our developer tools. You'll make complex concepts easy to understand.",
    requirements: [
      "Technical writing experience",
      "Understanding of APIs and SDKs",
      "Markdown and documentation tools",
      "Ability to work with developers",
      "Strong editing skills"
    ],
    benefits: [
      "Remote-first",
      "Flexible schedule",
      "Writing tools provided",
      "Training opportunities",
      "Team retreats"
    ],
    logo: "DP",
    color: "#14B8A6"
  },
  {
    id: 10,
    title: "Security Engineer",
    company: "SecureNet",
    companyId: 10,
    location: "Europe, US",
    type: "hybrid",
    salary: "€80,000 - €120,000",
    postedAt: "2 days ago",
    description: "Protect our infrastructure and customers! We're seeking a Security Engineer to identify vulnerabilities and implement security measures.",
    requirements: [
      "Security certifications (CISSP/CEH)",
      "Penetration testing experience",
      "Cloud security knowledge",
      "Incident response skills",
      "Security tooling expertise"
    ],
    benefits: [
      "Security conference attendance",
      "Certification support",
      "Competitive salary",
      "Hybrid work model",
      "Wellness benefits"
    ],
    logo: "SN",
    color: "#6366F1"
  },
  {
    id: 11,
    title: "Customer Success Manager",
    company: "ClientFirst",
    companyId: 11,
    location: "US",
    type: "remote",
    salary: "$65,000 - $95,000",
    postedAt: "4 days ago",
    description: "Build lasting relationships with our enterprise clients. You'll ensure customer satisfaction and drive product adoption.",
    requirements: [
      "3+ years in customer success",
      "SaaS experience preferred",
      "Strong communication skills",
      "Problem-solving abilities",
      "Data-driven mindset"
    ],
    benefits: [
      "Uncapped commission",
      "Remote work",
      "Professional growth",
      "Health insurance",
      "Team events"
    ],
    logo: "CF",
    color: "#F97316"
  },
  {
    id: 12,
    title: "AI/ML Engineer",
    company: "BrainWave",
    companyId: 12,
    location: "Worldwide",
    type: "remote",
    salary: "$120,000 - $180,000",
    postedAt: "1 day ago",
    description: "Push the boundaries of AI! We're building next-generation language models and need talented ML engineers.",
    requirements: [
      "PhD in ML/AI or equivalent experience",
      "Deep learning frameworks expertise",
      "NLP experience",
      "Distributed training knowledge",
      "Research publications a plus"
    ],
    benefits: [
      "Top-tier compensation",
      "Research freedom",
      "GPU compute access",
      "Conference travel",
      "Equity participation"
    ],
    logo: "BW",
    color: "#8B5CF6"
  }
];

// ============================================
// DUMMY DATA - Companies
// ============================================

const companiesData = [
  {
    id: 1,
    name: "TechFlow",
    description: "TechFlow is a leading software development company specializing in building scalable web applications for startups and enterprises. We believe in remote-first culture and work-life balance.",
    website: "https://techflow.example.com",
    founded: "2018",
    employees: "50-200",
    location: "San Francisco, CA (Remote)",
    logo: "TF",
    color: "#4F46E5"
  },
  {
    id: 2,
    name: "DesignStudio",
    description: "Award-winning design agency creating beautiful digital experiences for global brands. We combine creativity with strategy to deliver exceptional results.",
    website: "https://designstudio.example.com",
    founded: "2015",
    employees: "20-50",
    location: "New York, NY (Remote)",
    logo: "DS",
    color: "#EC4899"
  },
  {
    id: 3,
    name: "CloudBase",
    description: "Cloud infrastructure solutions provider helping businesses scale with confidence. We build the foundation for modern applications.",
    website: "https://cloudbase.example.com",
    founded: "2019",
    employees: "100-500",
    location: "London, UK (Hybrid)",
    logo: "CB",
    color: "#06B6D4"
  },
  {
    id: 4,
    name: "ScaleUp",
    description: "Fast-growing tech startup revolutionizing how companies scale their operations. Join us on our mission to change the world.",
    website: "https://scaleup.example.com",
    founded: "2020",
    employees: "50-200",
    location: "Austin, TX (Remote)",
    logo: "SU",
    color: "#8B5CF6"
  },
  {
    id: 5,
    name: "AppWorks",
    description: "Mobile-first development studio creating innovative apps for iOS and Android. We turn ideas into reality.",
    website: "https://appworks.example.com",
    founded: "2017",
    employees: "20-50",
    location: "Singapore (Remote)",
    logo: "AW",
    color: "#F59E0B"
  },
  {
    id: 6,
    name: "DataDriven",
    description: "Data science consultancy helping organizations make better decisions through analytics and machine learning.",
    website: "https://datadriven.example.com",
    founded: "2016",
    employees: "50-200",
    location: "Boston, MA (Hybrid)",
    logo: "DD",
    color: "#10B981"
  },
  {
    id: 7,
    name: "FastAPI",
    description: "API infrastructure company building the fastest and most reliable APIs in the industry. Speed is our middle name.",
    website: "https://fastapi.example.com",
    founded: "2019",
    employees: "20-50",
    location: "Berlin, Germany (Remote)",
    logo: "FA",
    color: "#3B82F6"
  },
  {
    id: 8,
    name: "UserFirst",
    description: "User experience consultancy putting users at the center of every product decision. Research-driven design.",
    website: "https://userfirst.example.com",
    founded: "2018",
    employees: "10-20",
    location: "Toronto, Canada (Remote)",
    logo: "UF",
    color: "#EF4444"
  },
  {
    id: 9,
    name: "DocuPro",
    description: "Developer tools company creating documentation solutions that make developers' lives easier.",
    website: "https://docupro.example.com",
    founded: "2020",
    employees: "10-20",
    location: "Remote",
    logo: "DP",
    color: "#14B8A6"
  },
  {
    id: 10,
    name: "SecureNet",
    description: "Cybersecurity firm protecting businesses from digital threats. Security is not just our job, it's our passion.",
    website: "https://securenet.example.com",
    founded: "2017",
    employees: "50-200",
    location: "Amsterdam, Netherlands (Hybrid)",
    logo: "SN",
    color: "#6366F1"
  },
  {
    id: 11,
    name: "ClientFirst",
    description: "Customer success platform helping SaaS companies retain and grow their customer base.",
    website: "https://clientfirst.example.com",
    founded: "2019",
    employees: "50-200",
    location: "Denver, CO (Remote)",
    logo: "CF",
    color: "#F97316"
  },
  {
    id: 12,
    name: "BrainWave",
    description: "AI research lab pushing the boundaries of artificial intelligence. Building the future, one model at a time.",
    website: "https://brainwave.example.com",
    founded: "2021",
    employees: "20-50",
    location: "Palo Alto, CA (Remote)",
    logo: "BW",
    color: "#8B5CF6"
  }
];

// ============================================
// LOCAL STORAGE MANAGEMENT
// ============================================

const StorageKeys = {
  SAVED_JOBS: 'remotely_saved_jobs',
  DARK_MODE: 'remotely_dark_mode',
  SEARCH_HISTORY: 'remotely_search_history'
};

// Get saved jobs from localStorage
function getSavedJobs() {
  try {
    const saved = localStorage.getItem(StorageKeys.SAVED_JOBS);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error reading saved jobs:', e);
    return [];
  }
}

// Save job to localStorage
function saveJob(jobId) {
  try {
    const savedJobs = getSavedJobs();
    if (!savedJobs.includes(jobId)) {
      savedJobs.push(jobId);
      localStorage.setItem(StorageKeys.SAVED_JOBS, JSON.stringify(savedJobs));
      showToast('Job saved successfully!', 'success');
      updateSaveButtonState(jobId, true);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error saving job:', e);
    showToast('Failed to save job', 'error');
    return false;
  }
}

// Remove job from saved
function unsaveJob(jobId) {
  try {
    const savedJobs = getSavedJobs();
    const index = savedJobs.indexOf(jobId);
    if (index > -1) {
      savedJobs.splice(index, 1);
      localStorage.setItem(StorageKeys.SAVED_JOBS, JSON.stringify(savedJobs));
      showToast('Job removed from saved', 'info');
      updateSaveButtonState(jobId, false);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error unsaving job:', e);
    showToast('Failed to remove job', 'error');
    return false;
  }
}

// Check if job is saved
function isJobSaved(jobId) {
  return getSavedJobs().includes(jobId);
}

// Toggle save/unsave
function toggleSaveJob(jobId) {
  if (isJobSaved(jobId)) {
    unsaveJob(jobId);
  } else {
    saveJob(jobId);
  }
}

// Update save button visual state
function updateSaveButtonState(jobId, isSaved) {
  const buttons = document.querySelectorAll(`[data-job-id="${jobId}"].save-btn`);
  buttons.forEach(btn => {
    if (isSaved) {
      btn.classList.add('saved');
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
    } else {
      btn.classList.remove('saved');
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
    }
  });
}

// ============================================
// DARK MODE
// ============================================

function initDarkMode() {
  const savedTheme = localStorage.getItem(StorageKeys.DARK_MODE);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  // Update toggle button icon
  updateThemeToggleIcon();
}

function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(StorageKeys.DARK_MODE, 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(StorageKeys.DARK_MODE, 'dark');
  }
  
  updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  if (isDark) {
    toggle.innerHTML = `
      <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  } else {
    toggle.innerHTML = `
      <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info', title = '') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconMap = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };
  
  const titleMap = {
    success: 'Success',
    error: 'Error',
    info: 'Info'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type]}</span>
    <div class="toast-content">
      <div class="toast-title">${title || titleMap[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse, fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
  
  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
  
  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleDarkMode);
  }
  
  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// ============================================
// JOB CARDS RENDERING
// ============================================

function createJobCard(job) {
  const isSaved = isJobSaved(job.id);
  
  return `
    <div class="card job-card" data-job-id="${job.id}">
      <div class="card-header">
        <div class="flex gap-md items-center">
          <div class="company-logo" style="background: ${job.color}20; color: ${job.color}">
            ${job.logo}
          </div>
          <div>
            <h3 class="card-title">${job.title}</h3>
            <a href="company.html?id=${job.companyId}" class="card-subtitle hover:text-primary">${job.company}</a>
          </div>
        </div>
        <button class="save-btn ${isSaved ? 'saved' : ''}" data-job-id="${job.id}" onclick="toggleSaveJob(${job.id})">
          ${isSaved 
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>'
          }
        </button>
      </div>
      <div class="card-body">
        <div class="job-meta">
          <span class="job-tag ${job.type}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${job.type === 'remote' 
                ? '<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><circle cx="12" cy="12" r="3"/>'
                : '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
              }
            </svg>
            ${job.type === 'remote' ? 'Remote' : 'Hybrid'}
          </span>
          <span class="job-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            ${job.location}
          </span>
          ${job.salary ? `
            <span class="job-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              ${job.salary}
            </span>
          ` : ''}
        </div>
      </div>
      <div class="card-footer">
        <span class="text-muted text-sm">${job.postedAt}</span>
        <a href="job-detail.html?id=${job.id}" class="btn btn-primary btn-sm">View Detail</a>
      </div>
    </div>
  `;
}

function renderJobs(jobs, container) {
  if (!container) return;
  
  if (jobs.length === 0) {
    container.innerHTML = `
      <div class="jobs-empty">
        <div class="jobs-empty-icon">🔍</div>
        <h3>No jobs found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = jobs.map(job => createJobCard(job)).join('');
}

// ============================================
// SEARCH & FILTER
// ============================================

function filterJobs(jobs, searchTerm, jobType) {
  return jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !jobType || jobType === 'all' || job.type === jobType;
    
    return matchesSearch && matchesType;
  });
}

function initSearchAndFilter() {
  const searchInput = document.getElementById('searchInput');
  const typeFilter = document.getElementById('typeFilter');
  const jobsContainer = document.getElementById('jobsContainer');
  
  if (!searchInput || !jobsContainer) return;
  
  function updateJobs() {
    const searchTerm = searchInput.value.trim();
    const jobType = typeFilter ? typeFilter.value : 'all';
    
    const filtered = filterJobs(jobsData, searchTerm, jobType);
    renderJobs(filtered, jobsContainer);
  }
  
  // Real-time search
  searchInput.addEventListener('input', debounce(updateJobs, 300));
  
  // Type filter
  if (typeFilter) {
    typeFilter.addEventListener('change', updateJobs);
  }
  
  // Clear search button
  const clearBtn = document.querySelector('.clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      updateJobs();
      searchInput.focus();
    });
  }
}

// Debounce helper
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

// ============================================
// PAGE-SPECIFIC FUNCTIONS
// ============================================

// Jobs Page
function initJobsPage() {
  const jobsContainer = document.getElementById('jobsContainer');
  if (jobsContainer) {
    renderJobs(jobsData, jobsContainer);
  }
  initSearchAndFilter();
}

// Job Detail Page
function initJobDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = parseInt(urlParams.get('id'));
  
  const job = jobsData.find(j => j.id === jobId);
  if (!job) {
    document.querySelector('.job-detail-section').innerHTML = `
      <div class="container">
        <div class="jobs-empty">
          <div class="jobs-empty-icon">❓</div>
          <h3>Job not found</h3>
          <p>The job you're looking for doesn't exist.</p>
          <a href="jobs.html" class="btn btn-primary mt-lg">Browse Jobs</a>
        </div>
      </div>
    `;
    return;
  }
  
  // Update page title
  document.title = `${job.title} at ${job.company} - Remotely`;
  
  // Render job details
  const header = document.querySelector('.job-detail-header');
  if (header) {
    const isSaved = isJobSaved(job.id);
    header.innerHTML = `
      <div class="job-detail-company">
        <div class="job-detail-logo" style="background: ${job.color}20; color: ${job.color}">
          ${job.logo}
        </div>
        <div class="job-detail-title-section">
          <h1>${job.title}</h1>
          <a href="company.html?id=${job.companyId}" class="text-lg text-secondary hover:text-primary">${job.company}</a>
          <div class="job-detail-meta mt-md">
            <span class="job-detail-meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              ${job.location}
            </span>
            <span class="job-detail-meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${job.type === 'remote' 
                  ? '<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><circle cx="12" cy="12" r="3"/>'
                  : '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
                }
              </svg>
              ${job.type === 'remote' ? 'Remote' : 'Hybrid'}
            </span>
            ${job.salary ? `
              <span class="job-detail-meta-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                ${job.salary}
              </span>
            ` : ''}
            <span class="job-detail-meta-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Posted ${job.postedAt}
            </span>
          </div>
        </div>
      </div>
      <div class="job-detail-actions">
        <button class="btn btn-primary btn-lg" onclick="showToast('Application feature coming soon!', 'info')">
          Apply Now
        </button>
        <button class="btn btn-secondary btn-lg save-btn ${isSaved ? 'saved' : ''}" data-job-id="${job.id}" onclick="toggleSaveJob(${job.id})">
          ${isSaved ? 'Saved' : 'Save Job'}
        </button>
      </div>
    `;
  }
  
  // Render description
  const descriptionContainer = document.getElementById('jobDescription');
  if (descriptionContainer) {
    descriptionContainer.innerHTML = `
      <h2 class="job-detail-section-title">About the Role</h2>
      <div class="job-detail-description">
        <p>${job.description}</p>
      </div>
      
      <h2 class="job-detail-section-title mt-xl">Requirements</h2>
      <ul class="job-detail-list">
        ${job.requirements.map(req => `<li>${req}</li>`).join('')}
      </ul>
      
      <h2 class="job-detail-section-title mt-xl">Benefits</h2>
      <ul class="job-detail-list">
        ${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
      </ul>
    `;
  }
}

// Company Page
function initCompanyPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const companyId = parseInt(urlParams.get('id'));
  
  const company = companiesData.find(c => c.id === companyId);
  if (!company) {
    document.querySelector('.company-header').innerHTML = `
      <div class="container">
        <div class="jobs-empty">
          <div class="jobs-empty-icon">❓</div>
          <h3>Company not found</h3>
          <p>The company you're looking for doesn't exist.</p>
          <a href="jobs.html" class="btn btn-primary mt-lg">Browse Jobs</a>
        </div>
      </div>
    `;
    return;
  }
  
  // Update page title
  document.title = `${company.name} - Remotely`;
  
  // Count company jobs
  const companyJobs = jobsData.filter(j => j.companyId === companyId);
  
  // Render company header
  const header = document.querySelector('.company-header-content');
  if (header) {
    header.innerHTML = `
      <div class="company-logo-large" style="background: ${company.color}20; color: ${company.color}">
        ${company.logo}
      </div>
      <div class="company-info">
        <h1>${company.name}</h1>
        <p>${company.description}</p>
        <div class="company-stats">
          <div class="company-stat">
            <div class="company-stat-value">${companyJobs.length}</div>
            <div class="company-stat-label">Open Jobs</div>
          </div>
          <div class="company-stat">
            <div class="company-stat-value">${company.employees}</div>
            <div class="company-stat-label">Employees</div>
          </div>
          <div class="company-stat">
            <div class="company-stat-value">${company.founded}</div>
            <div class="company-stat-label">Founded</div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Render company about
  const aboutContainer = document.getElementById('companyAbout');
  if (aboutContainer) {
    aboutContainer.innerHTML = `
      <h2 class="job-detail-section-title">About ${company.name}</h2>
      <p class="text-secondary">${company.description}</p>
      
      <h3 class="mt-lg mb-md">Company Details</h3>
      <div class="grid grid-2 gap-md">
        <div class="sidebar-card">
          <div class="flex items-center gap-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div>
              <div class="text-muted text-sm">Location</div>
              <div>${company.location}</div>
            </div>
          </div>
        </div>
        <div class="sidebar-card">
          <div class="flex items-center gap-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <div>
              <div class="text-muted text-sm">Website</div>
              <a href="#" class="text-primary hover:underline" onclick="showToast('External link coming soon!', 'info')">${company.website}</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Render company jobs
  const jobsContainer = document.getElementById('companyJobs');
  if (jobsContainer) {
    if (companyJobs.length > 0) {
      jobsContainer.innerHTML = `
        <h2 class="job-detail-section-title">Open Positions (${companyJobs.length})</h2>
        <div class="jobs-grid">
          ${companyJobs.map(job => createJobCard(job)).join('')}
        </div>
      `;
    } else {
      jobsContainer.innerHTML = `
        <h2 class="job-detail-section-title">Open Positions</h2>
        <div class="jobs-empty">
          <p class="text-secondary">No open positions at the moment.</p>
        </div>
      `;
    }
  }
}

// Saved Jobs Page
function initSavedJobsPage() {
  const savedJobsContainer = document.getElementById('savedJobsContainer');
  const savedCount = document.getElementById('savedCount');
  
  if (!savedJobsContainer) return;
  
  const savedJobIds = getSavedJobs();
  const savedJobs = jobsData.filter(job => savedJobIds.includes(job.id));
  
  if (savedCount) {
    savedCount.textContent = savedJobs.length;
  }
  
  if (savedJobs.length === 0) {
    savedJobsContainer.innerHTML = `
      <div class="jobs-empty">
        <div class="jobs-empty-icon">💼</div>
        <h3>No saved jobs yet</h3>
        <p>Browse jobs and click the heart icon to save them here.</p>
        <a href="jobs.html" class="btn btn-primary mt-lg">Browse Jobs</a>
      </div>
    `;
    return;
  }
  
  renderJobs(savedJobs, savedJobsContainer);
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => observer.observe(el));
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize dark mode
  initDarkMode();
  
  // Initialize navigation
  initNavigation();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize page-specific functions
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  switch (currentPage) {
    case 'jobs.html':
      initJobsPage();
      break;
    case 'job-detail.html':
      initJobDetailPage();
      break;
    case 'company.html':
      initCompanyPage();
      break;
    case 'saved.html':
      initSavedJobsPage();
      break;
  }
});

// ============================================
// EXPORTS (for module usage if needed)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    jobsData,
    companiesData,
    getSavedJobs,
    saveJob,
    unsaveJob,
    isJobSaved,
    toggleSaveJob,
    filterJobs
  };
}
