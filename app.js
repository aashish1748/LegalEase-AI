// Application Data
const appData = {
  sample_documents: {
    rental_agreement: {
      title: "Residential Lease Agreement",
      type: "Rental Agreement",
      parties: {
        landlord: "Property Management Co.",
        tenant: "You (Sample User)"
      },
      key_terms: {
        monthly_rent: 2500,
        security_deposit: 5000,
        lease_term: "12 months",
        early_termination_fee: "3 months rent ($7,500)",
        notice_to_vacate: "60 days"
      },
      clauses: [
        {
          id: "rent_increase",
          original: "Landlord may increase rent with thirty (30) days written notice to Tenant for any reason deemed appropriate by Landlord in their sole discretion.",
          simplified: "Your landlord can raise your rent with only 30 days notice, for any reason they want.",
          risk_level: "high",
          explanation: "This gives the landlord unlimited power to increase rent. Most tenant-friendly leases limit increases to once per year or tie them to market rates."
        },
        {
          id: "repair_responsibility",
          original: "Tenant shall be responsible for all repairs, maintenance, and replacement of any item within the demised premises exceeding One Hundred Dollars ($100) in cost.",
          simplified: "You must pay for any repairs that cost more than $100, even if it's not your fault.",
          risk_level: "high",
          explanation: "This is unusual and unfair. Typically, landlords are responsible for major repairs and maintenance unless damage is caused by tenant negligence."
        },
        {
          id: "entry_rights",
          original: "Lessor reserves the right to enter the demised premises at any reasonable time with twenty-four (24) hours prior written notice for inspection, repair, or showing to prospective tenants or purchasers.",
          simplified: "Your landlord can enter your home with 24 hours notice for inspections, repairs, or to show the property.",
          risk_level: "medium",
          explanation: "While 24-hour notice is standard, the broad reasons for entry may exceed what's legally required in your area. Check local tenant rights laws."
        },
        {
          id: "guest_policy",
          original: "No person other than Tenant may occupy the premises for more than seven (7) consecutive days without prior written consent of Landlord, which consent may be withheld in Landlord's sole discretion.",
          simplified: "Guests can't stay more than 7 days without your landlord's written permission, which they can refuse for any reason.",
          risk_level: "medium",
          explanation: "This is quite restrictive. Many leases allow 14-30 days for guests. The 7-day limit could impact family visits or temporary situations."
        }
      ]
    }
  },
  chat_responses: {
    common_questions: [
      {
        question: "What happens if I want to move out early?",
        answer: "According to your lease, you would need to pay an early termination fee of 3 months' rent ($7,500). This is quite high compared to typical leases. You should also give 60 days written notice. Consider negotiating this fee down - many leases charge 1-2 months' rent instead."
      },
      {
        question: "Can my landlord raise my rent whenever they want?",
        answer: "Unfortunately, yes. Your lease allows rent increases with just 30 days notice 'for any reason.' This is concerning because it gives your landlord unlimited power to raise rent. Most tenant-friendly leases limit increases to once per year or require justification. Check your local tenant protection laws as they may override this clause."
      },
      {
        question: "Who pays for repairs if something breaks?",
        answer: "You're responsible for any repairs over $100, even if it's not your fault. This is unusual and unfavorable to tenants. Typically, landlords pay for repairs unless the tenant caused the damage through negligence. This could cost you thousands if major appliances or systems break down."
      },
      {
        question: "Can I have friends or family stay overnight?",
        answer: "Yes, but only for up to 7 consecutive days without written permission from your landlord. This is quite restrictive - most leases allow 14-30 days for guests. The 7-day limit could be problematic for family visits or if you need temporary help during illness or emergencies."
      }
    ]
  }
};

// Application State
let currentSection = 'home';
let currentTab = 'overview';
let isAnalyzing = false;
let currentDocument = null;

// DOM Elements
const sections = {
  home: null,
  upload: null,
  loading: null,
  dashboard: null
};

const elements = {
  tryDemoBtn: null,
  uploadDocBtn: null,
  browseBtn: null,
  sendChatBtn: null,
  closeModalBtn: null,
  downloadPdfBtn: null,
  shareBtn: null,
  fileInput: null,
  chatInput: null,
  clauseModal: null,
  chatMessages: null,
  dropzone: null
};

// Utility Functions
function showSection(sectionName) {
  console.log('Switching to section:', sectionName);
  
  // Hide all sections
  Object.values(sections).forEach(section => {
    if (section) {
      section.classList.add('hidden');
    }
  });
  
  // Show target section
  if (sections[sectionName]) {
    sections[sectionName].classList.remove('hidden');
    currentSection = sectionName;
    
    // Initialize dashboard animations if switching to dashboard
    if (sectionName === 'dashboard') {
      setTimeout(initializeDashboardAnimations, 300);
    }
  }
}

function showTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeTabBtn) {
    activeTabBtn.classList.add('active');
  }
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  const activeTabContent = document.getElementById(tabName);
  if (activeTabContent) {
    activeTabContent.classList.add('active');
  }
  
  currentTab = tabName;
}

function simulateAnalysis() {
  console.log('Starting analysis simulation');
  
  if (isAnalyzing) return;
  
  isAnalyzing = true;
  showSection('loading');
  
  const steps = document.querySelectorAll('.step');
  let currentStep = 0;
  
  const progressInterval = setInterval(() => {
    if (currentStep < steps.length) {
      steps[currentStep].classList.add('active');
      currentStep++;
    }
    
    if (currentStep >= steps.length) {
      clearInterval(progressInterval);
      setTimeout(() => {
        isAnalyzing = false;
        loadSampleDocument();
        showSection('dashboard');
      }, 1000);
    }
  }, 1500);
}

function loadSampleDocument() {
  currentDocument = appData.sample_documents.rental_agreement;
  console.log('Sample document loaded:', currentDocument.title);
  
  // Set up clause click handlers after document is loaded
  setTimeout(() => {
    setupClauseHandlers();
  }, 100);
}

function setupClauseHandlers() {
  document.querySelectorAll('.clause-item').forEach(item => {
    item.addEventListener('click', () => {
      const clauseId = item.dataset.clause;
      showClauseModal(clauseId);
    });
  });
}

function showClauseModal(clauseId) {
  if (!currentDocument) return;
  
  const clause = currentDocument.clauses.find(c => c.id === clauseId);
  if (!clause) return;
  
  // Populate modal content
  const modalTitle = document.getElementById('modalTitle');
  const modalRiskLevel = document.getElementById('modalRiskLevel');
  const modalOriginal = document.getElementById('modalOriginal');
  const modalSimplified = document.getElementById('modalSimplified');
  const modalExplanation = document.getElementById('modalExplanation');
  
  if (modalTitle) modalTitle.textContent = getClauseTitle(clauseId);
  if (modalRiskLevel) {
    modalRiskLevel.textContent = `${clause.risk_level.charAt(0).toUpperCase() + clause.risk_level.slice(1)} Risk`;
    modalRiskLevel.className = `risk-badge ${clause.risk_level}`;
  }
  if (modalOriginal) modalOriginal.textContent = clause.original;
  if (modalSimplified) modalSimplified.textContent = clause.simplified;
  if (modalExplanation) modalExplanation.textContent = clause.explanation;
  
  // Show modal
  if (elements.clauseModal) {
    elements.clauseModal.classList.remove('hidden');
  }
}

function getClauseTitle(clauseId) {
  const titles = {
    rent_increase: 'Rent Increase Clause',
    repair_responsibility: 'Repair Responsibility',
    entry_rights: 'Landlord Entry Rights',
    guest_policy: 'Guest Policy'
  };
  return titles[clauseId] || 'Clause Analysis';
}

function hideModal() {
  if (elements.clauseModal) {
    elements.clauseModal.classList.add('hidden');
  }
}

function addChatMessage(message, isUser = false) {
  if (!elements.chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.innerHTML = `<p>${message}</p>`;
  
  messageDiv.appendChild(contentDiv);
  elements.chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function handleChatQuestion(question) {
  // Add user message
  addChatMessage(question, true);
  
  // Find matching response or provide generic response
  const commonQ = appData.chat_responses.common_questions.find(q => 
    question.toLowerCase().includes('rent') && q.question.toLowerCase().includes('rent') ||
    question.toLowerCase().includes('repair') && q.question.toLowerCase().includes('repair') ||
    question.toLowerCase().includes('early') && q.question.toLowerCase().includes('early') ||
    question.toLowerCase().includes('guest') && q.question.toLowerCase().includes('guest') ||
    question.toLowerCase().includes('cancel') && q.question.toLowerCase().includes('early') ||
    question.toLowerCase().includes('fee') && q.question.toLowerCase().includes('fee') ||
    question.toLowerCase().includes('increase') && q.question.toLowerCase().includes('increase') ||
    question.toLowerCase().includes('break') && q.question.toLowerCase().includes('repair')
  );
  
  let response;
  if (commonQ) {
    response = commonQ.answer;
  } else {
    response = "That's a great question! Based on your rental agreement analysis, I can see several areas of concern. For specific questions about clauses not covered in my analysis, I'd recommend consulting with a local tenant rights organization or attorney who can review the complete document and local laws that may apply.";
  }
  
  // Simulate typing delay
  setTimeout(() => {
    addChatMessage(response);
  }, 1000);
}

function downloadSummary() {
  alert('Summary report would be downloaded as PDF. This is a demo - the feature would generate a comprehensive PDF report with all findings and recommendations.');
}

function shareWithLawyer() {
  alert('In the full version, this would allow you to securely share your analysis with a lawyer or legal professional.');
}

// Initialize DOM elements
function initializeElements() {
  // Initialize sections
  sections.home = document.getElementById('home');
  sections.upload = document.getElementById('upload');
  sections.loading = document.getElementById('loading');
  sections.dashboard = document.getElementById('dashboard');
  
  // Initialize other elements
  elements.tryDemoBtn = document.getElementById('tryDemoBtn');
  elements.uploadDocBtn = document.getElementById('uploadDocBtn');
  elements.browseBtn = document.getElementById('browseBtn');
  elements.sendChatBtn = document.getElementById('sendChatBtn');
  elements.closeModalBtn = document.getElementById('closeModal');
  elements.downloadPdfBtn = document.getElementById('downloadPdfBtn');
  elements.shareBtn = document.getElementById('shareBtn');
  elements.fileInput = document.getElementById('fileInput');
  elements.chatInput = document.getElementById('chatInput');
  elements.clauseModal = document.getElementById('clauseModal');
  elements.chatMessages = document.getElementById('chatMessages');
  elements.dropzone = document.getElementById('dropzone');
}

// Set up event listeners
function setupEventListeners() {
  // Navigation buttons
  if (elements.tryDemoBtn) {
    elements.tryDemoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Try Demo button clicked');
      simulateAnalysis();
    });
  }
  
  if (elements.uploadDocBtn) {
    elements.uploadDocBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Upload Doc button clicked');
      showSection('upload');
    });
  }
  
  if (elements.browseBtn) {
    elements.browseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (elements.fileInput) {
        elements.fileInput.click();
      }
    });
  }
  
  // File upload
  if (elements.fileInput) {
    elements.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        simulateAnalysis();
      }
    });
  }
  
  // Drag and drop
  if (elements.dropzone) {
    elements.dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      elements.dropzone.classList.add('dragover');
    });
    
    elements.dropzone.addEventListener('dragleave', () => {
      elements.dropzone.classList.remove('dragover');
    });
    
    elements.dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      elements.dropzone.classList.remove('dragover');
      simulateAnalysis();
    });
  }
  
  // Sample document buttons
  document.querySelectorAll('.sample-doc-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const docType = btn.dataset.doc;
      if (docType === 'rental') {
        simulateAnalysis();
      } else {
        alert(`This is a demo focusing on rental agreements. In the full version, ${docType === 'loan' ? 'loan contracts' : 'terms of service'} would also be supported.`);
      }
    });
  });
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabName = btn.dataset.tab;
      showTab(tabName);
    });
  });
  
  // Modal functionality
  if (elements.closeModalBtn) {
    elements.closeModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      hideModal();
    });
  }
  
  // Click outside modal to close
  if (elements.clauseModal) {
    elements.clauseModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        hideModal();
      }
    });
  }
  
  // Chat functionality
  if (elements.sendChatBtn && elements.chatInput) {
    const sendMessage = () => {
      const message = elements.chatInput.value.trim();
      if (message) {
        handleChatQuestion(message);
        elements.chatInput.value = '';
      }
    };
    
    elements.sendChatBtn.addEventListener('click', sendMessage);
    elements.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
  
  // Quick question buttons
  document.querySelectorAll('.quick-question-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.textContent;
      handleChatQuestion(question);
      showTab('chat'); // Switch to chat tab
    });
  });
  
  // Action buttons
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.textContent;
      if (text.includes('Ask About Rent')) {
        handleChatQuestion('Can my landlord raise my rent whenever they want?');
        showTab('chat');
      } else if (text.includes('Clarify Repair')) {
        handleChatQuestion('Who pays for repairs if something breaks?');
        showTab('chat');
      } else if (text.includes('Download')) {
        downloadSummary();
      }
    });
  });
  
  // Summary actions
  if (elements.downloadPdfBtn) {
    elements.downloadPdfBtn.addEventListener('click', downloadSummary);
  }
  
  if (elements.shareBtn) {
    elements.shareBtn.addEventListener('click', shareWithLawyer);
  }
  
  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      
      // Update active nav link
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Handle navigation
      if (href === '#home') {
        showSection('home');
      } else if (href === '#demo') {
        simulateAnalysis();
      }
    });
  });
}

// Animation utilities
function animateValue(element, start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    element.textContent = Math.floor(current);
    
    if (current >= end) {
      element.textContent = end;
      clearInterval(timer);
    }
  }, 16);
}

// Initialize animations when dashboard loads
function initializeDashboardAnimations() {
  // Animate risk score
  const scoreElement = document.querySelector('.score-number');
  if (scoreElement) {
    setTimeout(() => {
      animateValue(scoreElement, 0, 7, 1500);
    }, 500);
  }
  
  // Animate risk bars
  document.querySelectorAll('.risk-fill').forEach((bar, index) => {
    setTimeout(() => {
      bar.style.transition = 'width 1s ease-in-out';
      const width = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    }, 200 + (index * 200));
  });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing app...');
  
  // Initialize all DOM elements
  initializeElements();
  
  // Set up event listeners
  setupEventListeners();
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape' && elements.clauseModal && !elements.clauseModal.classList.contains('hidden')) {
      hideModal();
    }
    
    // Tab navigation (1-5 keys when in dashboard)
    if (currentSection === 'dashboard' && e.key >= '1' && e.key <= '5') {
      const tabs = ['overview', 'simplified', 'risks', 'chat', 'summary'];
      const tabIndex = parseInt(e.key) - 1;
      if (tabs[tabIndex]) {
        showTab(tabs[tabIndex]);
      }
    }
  });
  
  // Set initial state
  showSection('home');
  
  console.log('App initialization complete');
});