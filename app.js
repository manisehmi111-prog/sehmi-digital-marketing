/**
 * SEHMI DIGITAL MARKETING - INTERACTIVE ENGINE
 * Modern Vanilla JavaScript (ES6+)
 * Zero external dependencies. Accessible, performant, and responsive.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDashboard();
  initQuickDiagnostic();
  initServiceModals();
  initGrowthExplorer();
  initFaqAccordion();
  initConsultationModal();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const closeDrawerBtn = document.querySelector('.close-drawer-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  const desktopLinks = document.querySelectorAll('.nav-menu .nav-link');

  // Sticky header scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // Open drawer
  function openDrawer() {
    mobileDrawer.classList.add('open');
    mobileOverlay.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  // Close drawer
  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Escape key closes mobile drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Active section spy
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        desktopLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. HERO INTERACTIVE AI MARKETING DASHBOARD
   ========================================================================== */
function initDashboard() {
  const tabBtns = document.querySelectorAll('.dash-tab-btn');
  const metric1Val = document.getElementById('dash-m1-val');
  const metric1Label = document.getElementById('dash-m1-label');
  const metric1Tag = document.getElementById('dash-m1-tag');

  const metric2Val = document.getElementById('dash-m2-val');
  const metric2Label = document.getElementById('dash-m2-label');
  const metric2Tag = document.getElementById('dash-m2-tag');

  const activityTitle = document.getElementById('dash-activity-title');
  const activityStatus = document.getElementById('dash-activity-status');
  const progressBar = document.getElementById('dash-progress-bar');
  const tagContainer = document.getElementById('dash-tags-container');

  const dashboardData = {
    seo: {
      m1Label: 'Search Visibility Index',
      m1Val: '94.8',
      m1Tag: '+28% Trend',
      m2Label: 'High-Intent Keywords',
      m2Val: '142',
      m2Tag: 'Top 3 Ranks',
      activityTitle: 'AI Semantic Clustering & Entity Optimization',
      activityStatus: 'Optimized â€¢ 100% Crawl Health',
      progress: '92%',
      tags: ['Google Search Index', 'Schema Architecture', 'Voice & AI Search', 'Local Map Pack']
    },
    social: {
      m1Label: 'Audience Signal Strength',
      m1Val: '88.4',
      m1Tag: 'Consistent',
      m2Label: 'Brand Sentiment Index',
      m2Val: '96.2%',
      m2Tag: 'Positive',
      activityTitle: 'Omnichannel Engagement & Schedule Engine',
      activityStatus: 'Active Broadcast â€¢ Multi-platform',
      progress: '85%',
      tags: ['LinkedIn B2B', 'Instagram Reels', 'Brand Voice Guardian', 'Community Care']
    },
    ads: {
      m1Label: 'Ad Relevance Score',
      m1Val: '9.4/10',
      m1Tag: 'High Precision',
      m2Label: 'Budget Efficiency Gain',
      m2Val: '34%',
      m2Tag: 'Waste Eliminated',
      activityTitle: 'AI Predictive Audience & Copy Optimization',
      activityStatus: 'Live Bidding Matrix â€¢ Monitored',
      progress: '89%',
      tags: ['Google Search Ads', 'Meta Retargeting', 'Negative Match Filtering', 'ROAS Tracking']
    },
    automation: {
      m1Label: 'Automated Touchpoints',
      m1Val: '1,280',
      m1Tag: 'Synced',
      m2Label: 'Uptime & Maintenance',
      m2Val: '99.9%',
      m2Tag: 'Continuous',
      activityTitle: 'Lead Nurture & Workflow Health Monitor',
      activityStatus: 'Ongoing Support Active â€¢ Stable',
      progress: '98%',
      tags: ['Email Sequences', 'CRM Webhooks', 'Review Generation', 'Long-term Support']
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabKey = btn.getAttribute('data-tab');
      const data = dashboardData[tabKey];
      if (!data) return;

      // Animate changes
      metric1Val.textContent = data.m1Val;
      metric1Label.textContent = data.m1Label;
      metric1Tag.textContent = data.m1Tag;

      metric2Val.textContent = data.m2Val;
      metric2Label.textContent = data.m2Label;
      metric2Tag.textContent = data.m2Tag;

      activityTitle.textContent = data.activityTitle;
      activityStatus.textContent = data.activityStatus;
      progressBar.style.width = data.progress;

      // Render tags
      tagContainer.innerHTML = '';
      data.tags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'dash-tag';
        span.textContent = t;
        tagContainer.appendChild(span);
      });
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE QUICK AUDIT DIAGNOSTIC
   ========================================================================== */
function initQuickDiagnostic() {
  const businessTypeSelect = document.getElementById('diag-business-type');
  const goalSelect = document.getElementById('diag-primary-goal');
  const hurdleSelect = document.getElementById('diag-hurdle');
  const resultText = document.getElementById('diag-result-content');
  const applyBtn = document.getElementById('diag-apply-btn');

  function calculateAuditFocus() {
    const biz = businessTypeSelect.value;
    const goal = goalSelect.value;
    const hurdle = hurdleSelect.value;

    let recommendation = '';

    if (hurdle === 'visibility') {
      recommendation = `For <strong>${biz}</strong> targeting <strong>${goal}</strong>, your Free Audit will prioritize <strong>Search Engine Visibility, Local Discovery, and AI Indexing</strong> to eliminate invisibility barriers.`;
    } else if (hurdle === 'conversion') {
      recommendation = `For <strong>${biz}</strong> aiming to <strong>${goal}</strong>, your audit will focus on <strong>Landing Page UX, Offer Clarity, and CTA Friction Analysis</strong>.`;
    } else if (hurdle === 'consistency') {
      recommendation = `For <strong>${biz}</strong> needing <strong>${goal}</strong>, your audit will evaluate <strong>Marketing Automation, Content Velocity, and Ongoing Support Systems</strong>.`;
    } else {
      recommendation = `For <strong>${biz}</strong> focused on <strong>${goal}</strong>, we will examine <strong>Multi-Channel Brand Promotion and Custom AI Strategy Alignment</strong>.`;
    }

    resultText.innerHTML = recommendation;
  }

  if (businessTypeSelect) businessTypeSelect.addEventListener('change', calculateAuditFocus);
  if (goalSelect) goalSelect.addEventListener('change', calculateAuditFocus);
  if (hurdleSelect) hurdleSelect.addEventListener('change', calculateAuditFocus);

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      // Scroll to contact form and pre-fill fields
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });

        const serviceInput = document.getElementById('form-service');
        const messageInput = document.getElementById('form-message');

        if (serviceInput) {
          serviceInput.value = 'audit';
        }
        if (messageInput) {
          messageInput.value = `Diagnostic Context: Business Type: ${businessTypeSelect.value} | Primary Goal: ${goalSelect.value} | Primary Hurdle: ${hurdleSelect.value}. Please include this in my Free AI Marketing Audit.`;
        }
      }
    });
  }
}

/* ==========================================================================
   4. DETAILED SERVICE MODAL (9 SERVICES)
   ========================================================================== */
const SERVICE_DETAILS = {
  strategy: {
    title: 'AI-Powered Digital Marketing Strategy',
    badge: 'Core Foundation',
    summary: 'Customized blueprint tailored directly to your commercial objectives, audience psychology, competitor gaps, and digital opportunities.',
    deliverables: [
      'Comprehensive market & competitor digital footprint audit',
      'AI-assisted consumer persona mapping & search journey analysis',
      'Cross-channel growth roadmap (SEO, Social, Ads, Email)',
      'Quarterly KPI targets & measurement framework',
      'Continuous strategy refinements and alignment reviews'
    ],
    supportCoverage: 'Ongoing quarterly reviews, tactical adjustments, and strategic advisory sessions.'
  },
  seo: {
    title: 'SEO & AI Search Optimization',
    badge: 'Organic Discovery',
    summary: 'Ensure your business gets discovered by high-intent customers across Google, Bing, voice assistants, and emerging AI answer engines.',
    deliverables: [
      'Technical SEO audit & Core Web Vitals remediation plan',
      'Semantic keyword clustering & high-intent search mapping',
      'Structured data (Schema.org) architecture for rich results',
      'Local SEO, Google Business Profile optimization & citation health',
      'Content gap identification against industry leaders'
    ],
    supportCoverage: 'Monthly rank tracking, crawl anomaly detection, algorithm shift adaptation, and page maintenance.'
  },
  social: {
    title: 'Social Media Marketing',
    badge: 'Brand Awareness',
    summary: 'Build lasting brand recognition, authentic audience relationships, and a dependable social presence across key networks.',
    deliverables: [
      'Platform selection customized to your buyer demographics',
      'Editorial calendar with consistent theme planning',
      'Custom visual creatives & branded engagement formats',
      'Hashtag & trending audio research with brand safety filters',
      'Community interaction playbooks & review response strategies'
    ],
    supportCoverage: 'Ongoing channel maintenance, scheduled publishing, comment monitoring, and monthly cadence reviews.'
  },
  content: {
    title: 'AI Content Marketing',
    badge: 'Thought Leadership',
    summary: 'High-value, research-backed articles, guides, and visual content created with AI precision and polished with human editorial care.',
    deliverables: [
      'Content opportunity research based on actual customer queries',
      'SEO-optimized articles, service guides, and customer FAQs',
      'Visual infographics, social snackables, and slide assets',
      'Content repurposing engine (blog â†’ social â†’ newsletter)',
      'Tone of voice guide ensuring strict brand consistency'
    ],
    supportCoverage: 'Routine content refreshes, dead-link monitoring, seasonal updates, and continuous optimization.'
  },
  brand: {
    title: 'Online Brand Promotion',
    badge: 'Digital Presence',
    summary: 'Position your business as a respected, credible market leader through consistent presence across authoritative digital channels.',
    deliverables: [
      'Brand messaging guidelines & unique value articulation',
      'Digital PR, industry directory, and citation management',
      'Review and reputation enhancement systems',
      'Cross-channel visual identity alignment (website, social, profiles)',
      'Brand sentiment and mention tracking'
    ],
    supportCoverage: 'Ongoing reputation oversight, listing synchronization, and quarterly brand consistency audits.'
  },
  ads: {
    title: 'Digital Advertising',
    badge: 'Targeted Acquisition',
    summary: 'Data-driven paid search and social campaigns engineered to connect your value proposition with qualified buyers.',
    deliverables: [
      'Targeted campaign architecture (Google Search & Meta Ads)',
      'High-converting ad copywriting and visual creative variations',
      'Audience segmentation, lookalike models, and remarketing lists',
      'Conversion tracking, pixel configuration, and GA4 event mapping',
      'Negative keyword and waste mitigation protocols'
    ],
    supportCoverage: 'Daily bid management, negative term pruning, weekly creative rotation, and budget pacing supervision.'
  },
  automation: {
    title: 'Marketing Automation',
    badge: 'Workflow Efficiency',
    summary: 'Eliminate repetitive marketing busywork while providing every lead and client with timely, personalized communication.',
    deliverables: [
      'Lead capture forms and smart CRM integration',
      'Automated email welcome sequences and follow-up flows',
      'Customer re-engagement and review request triggers',
      'Internal lead notification and task routing for your team',
      'Workflow error monitoring and data integrity checks'
    ],
    supportCoverage: 'Workflow health testing, email deliverability monitoring, API updates, and sequence adjustments.'
  },
  analytics: {
    title: 'Analytics & Growth Optimization',
    badge: 'Data Intelligence',
    summary: 'Transform scattered web visits and clicks into actionable business intelligence that drives smarter decision-making.',
    deliverables: [
      'Google Analytics 4 & Search Console configuration',
      'Custom real-time business performance dashboard',
      'Conversion funnel drop-off analysis and heatmap insights',
      'Actionable monthly executive growth reports (no jargon)',
      'Identified low-hanging fruit for conversion optimization'
    ],
    supportCoverage: 'Ongoing monthly performance briefings, anomaly alerts, and continuous conversion rate checks.'
  },
  support: {
    title: 'Ongoing Maintenance & Support',
    badge: 'Long-Term Partnership',
    summary: 'Our signature differentiator: We never leave you stranded. We proactively monitor, maintain, and upgrade your digital marketing machine.',
    deliverables: [
      'Scheduled monthly website and marketing health checks',
      'Content updates, seasonal banner changes, and promotion swaps',
      'Algorithm update adaptations for Google and social platforms',
      'Priority email and phone support for marketing questions',
      'Dedicated marketing strategist reviewing your digital progress'
    ],
    supportCoverage: 'Continuous active support included directly in our service framework.'
  }
};

function initServiceModals() {
  const modalBackdrop = document.getElementById('service-modal');
  const closeBtn = document.getElementById('close-service-modal');
  const learnMoreBtns = document.querySelectorAll('.service-learn-more-btn');

  const titleEl = document.getElementById('modal-service-title');
  const badgeEl = document.getElementById('modal-service-badge');
  const summaryEl = document.getElementById('modal-service-summary');
  const deliverablesEl = document.getElementById('modal-service-deliverables');
  const supportEl = document.getElementById('modal-service-support');
  const ctaBtn = document.getElementById('modal-service-cta');

  function openModal(serviceKey) {
    const data = SERVICE_DETAILS[serviceKey];
    if (!data) return;

    titleEl.textContent = data.title;
    badgeEl.textContent = data.badge;
    summaryEl.textContent = data.summary;
    supportEl.textContent = data.supportCoverage;

    deliverablesEl.innerHTML = '';
    data.deliverables.forEach(item => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.alignItems = 'flex-start';
      li.style.gap = '10px';
      li.style.marginBottom = '10px';
      li.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; margin-top:3px;"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${item}</span>`;
      deliverablesEl.appendChild(li);
    });

    ctaBtn.onclick = () => {
      closeModal();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const serviceSelect = document.getElementById('form-service');
        if (serviceSelect) serviceSelect.value = serviceKey;
      }
    };

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-service');
      openModal(key);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. GROWTH EXPLORER (BUSINESS RESULTS)
   ========================================================================== */
function initGrowthExplorer() {
  const tabs = document.querySelectorAll('.growth-tab-btn');
  const titleEl = document.getElementById('growth-panel-title');
  const descEl = document.getElementById('growth-panel-desc');
  const listEl = document.getElementById('growth-panel-list');
  const indicatorTitle = document.getElementById('growth-indicator-title');
  const indicatorDesc = document.getElementById('growth-indicator-desc');

  const growthData = {
    local: {
      title: 'Local & Regional Businesses',
      desc: 'Engineered for neighborhood shops, professional practices, clinics, contractors, and local service providers who need local customers discovering them.',
      outcomes: [
        'Dominant Google Maps & local search visibility in your service radius',
        'Steady flow of customer phone inquiries and store visits',
        'Consistent local review generation with automated follow-ups',
        'Professional social presence keeping your brand top-of-mind locally',
        'Continuous listing synchronization and address consistency'
      ],
      indicatorTitle: 'Local Search & Map Discoverability',
      indicatorDesc: 'Ensures when local residents search for your services, your business is prominently displayed with verified details and reviews.'
    },
    ecommerce: {
      title: 'E-Commerce & Online Stores',
      desc: 'Customized for product brands needing improved online brand reach, lower customer acquisition costs, and higher repeat customer retention.',
      outcomes: [
        'Targeted product visibility across high-intent shopping queries',
        'Brand storytelling that sets your store apart from generic competitors',
        'Automated abandoned cart recovery and VIP customer appreciation flows',
        'Performance-tested ad variations connecting products to real buyers',
        'Ongoing catalog optimization and promotional readiness'
      ],
      indicatorTitle: 'Customer Journey Optimization',
      indicatorDesc: 'Aligns brand discovery, product interest, and checkout flow to create a seamless buying experience.'
    },
    b2b: {
      title: 'Startups & B2B Service Companies',
      desc: 'Designed for founders, consultants, agencies, and emerging companies that need high credibility, authority positioning, and qualified appointments.',
      outcomes: [
        'Thought leadership content positioning your team as trusted experts',
        'Refined value proposition addressing core buyer pain points',
        'Targeted LinkedIn and search outreach connecting with decision-makers',
        'Automated calendar booking and prospect qualification workflows',
        'Long-term strategy adjustments as your product offering scales'
      ],
      indicatorTitle: 'Authority & Pipeline Acceleration',
      indicatorDesc: 'Builds enterprise credibility and predictable inbound interest through professional digital positioning.'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.getAttribute('data-growth');
      const data = growthData[key];
      if (!data) return;

      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      indicatorTitle.textContent = data.indicatorTitle;
      indicatorDesc.textContent = data.indicatorDesc;

      listEl.innerHTML = '';
      data.outcomes.forEach(item => {
        const li = document.createElement('li');
        li.className = 'growth-outcome-item';
        li.innerHTML = `
          <div class="growth-check-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <span>${item}</span>
        `;
        listEl.appendChild(li);
      });
    });
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPane = item.querySelector('.faq-answer-pane');

    questionBtn.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close other open accordions for clean UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherPane = otherItem.querySelector('.faq-answer-pane');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPane) otherPane.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isCurrentlyActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answerPane.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerPane.style.maxHeight = answerPane.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   7. CONSULTATION BOOKING MODAL
   ========================================================================== */
function initConsultationModal() {
  const modalBackdrop = document.getElementById('consultation-modal');
  const closeBtn = document.getElementById('close-consultation-modal');
  const triggerBtns = document.querySelectorAll('.trigger-consultation-modal');
  const slotBtns = document.querySelectorAll('.slot-btn');
  const selectedTimeInput = document.getElementById('consult-selected-time');
  const consultForm = document.getElementById('consultation-form');
  const consultSuccess = document.getElementById('consultation-success');

  function openConsultModal() {
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeConsultModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openConsultModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeConsultModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeConsultModal();
    });
  }

  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (selectedTimeInput) {
        selectedTimeInput.value = btn.getAttribute('data-slot');
      }
    });
  });

  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('consult-name').value.trim();
      const email = document.getElementById('consult-email').value.trim();
      const phone = document.getElementById('consult-phone').value.trim();

      if (!name || !email) {
        alert('Please provide your name and email address.');
        return;
      }

      // Track Meta Pixel Conversion Event
      if (typeof fbq === 'function') {
        fbq('track', 'Schedule', { content_name: 'Consultation Booking' });
      }

      // Show success in modal
      consultForm.style.display = 'none';
      consultSuccess.style.display = 'block';
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeConsultModal();
    }
  });
}

/* ==========================================================================
   8. CONTACT & AUDIT REQUEST FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('audit-contact-form');
  const successState = document.getElementById('form-success-container');
  const submitBtn = document.getElementById('form-submit-btn');
  const resetBtn = document.getElementById('reset-form-btn');

  if (!form) return;

  const fields = {
    name: document.getElementById('form-name'),
    email: document.getElementById('form-email'),
    phone: document.getElementById('form-phone'),
    business: document.getElementById('form-business'),
    website: document.getElementById('form-website'),
    service: document.getElementById('form-service'),
    message: document.getElementById('form-message')
  };

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateField(input, condition) {
    if (!condition) {
      input.classList.add('error');
      return false;
    } else {
      input.classList.remove('error');
      return true;
    }
  }

  // Clear errors on input
  Object.values(fields).forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!validateField(fields.name, fields.name.value.trim().length >= 2)) {
      isValid = false;
    }

    // Validate Email
    if (!validateField(fields.email, validateEmail(fields.email.value.trim()))) {
      isValid = false;
    }

    // Validate Business Name
    if (!validateField(fields.business, fields.business.value.trim().length >= 2)) {
      isValid = false;
    }

    if (!isValid) {
      const firstError = form.querySelector('.form-control.error');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate submission state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      <span>Analyzing Request...</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Display personal confirmation
      const clientNameSpan = document.getElementById('success-client-name');
      const clientEmailSpan = document.getElementById('success-client-email');

      if (clientNameSpan) clientNameSpan.textContent = fields.name.value.trim();
      if (clientEmailSpan) clientEmailSpan.textContent = fields.email.value.trim();

      // Track Meta Pixel Lead Conversion Event
      if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
          content_name: 'Free AI Marketing Audit',
          currency: 'INR',
          value: 0.00
        });
      }

      form.style.display = 'none';
      successState.style.display = 'block';

      // Scroll slightly to focus on confirmation
      successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      successState.style.display = 'none';
    });
  }
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top-btn');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  }, { passive: true });

  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}