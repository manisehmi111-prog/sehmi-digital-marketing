/* ==========================================================================
   SEHMI DIGITAL MARKETING - VISUAL SEO CONTROL PANEL ENGINE
   Manages seo-config.json, index.html SEO block, sitemap.xml & robots.txt
   ========================================================================== */

const DEFAULT_CONFIG = {
  version: '1.0',
  updatedAt: new Date().toISOString().slice(0, 10),
  basic: {
    title: 'Sehmi Digital Marketing | AI-Powered Digital Marketing & Brand Promotion',
    description: 'Sehmi Digital Marketing provides AI-powered digital marketing, online brand promotion, and ongoing support customized to your business goals. Get your free AI audit today.',
    keywords: [
      'AI digital marketing',
      'AI digital marketing services',
      'digital marketing services',
      'online brand promotion',
      'AI marketing',
      'digital marketing for businesses',
      'online business growth'
    ],
    author: 'Sehmi Digital Marketing',
    canonicalUrl: 'https://sehmidigitals.online/',
    robots: 'index, follow',
    themeColor: '#18082D'
  },
  social: {
    ogType: 'website',
    ogTitle: 'Sehmi Digital Marketing | Smart AI. Powerful Marketing. Real Growth.',
    ogDescription: 'AI-powered digital marketing strategies designed around your business to help you get discovered, reach consumers, and grow online with long-term ongoing support.',
    ogImage: 'https://sehmidigitals.online/assets/logo-concept-lockup.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Sehmi Digital Marketing | AI-Powered Digital Marketing',
    twitterDescription: 'Customized AI-powered marketing and brand promotion with ongoing maintenance and support.',
    twitterHandle: ''
  },
  verifications: {
    googleSiteVerification: '',
    facebookDomainVerification: '',
    bingVerification: ''
  },
  tracking: {
    metaPixelEnabled: true,
    metaPixelId: '1566486118088482',
    ga4Id: '',
    gtmId: ''
  },
  schema: {
    type: 'ProfessionalService',
    name: 'Sehmi Digital Marketing',
    description: 'AI-powered digital marketing and online brand promotion services customized to business needs with long-term ongoing support.',
    url: 'https://sehmidigitals.online',
    logo: 'https://sehmidigitals.online/assets/logo.svg',
    priceRange: '$$',
    areaServed: 'Global',
    telephone: '',
    email: '',
    addressLocality: '',
    addressCountry: 'IN',
    knowsAbout: [
      'AI Digital Marketing',
      'Search Engine Optimization',
      'Online Brand Promotion',
      'Social Media Marketing',
      'AI Content Strategy',
      'Marketing Automation'
    ],
    services: [
      'Free AI Marketing Audit',
      'Ongoing Maintenance & Marketing Support'
    ]
  },
  sitemap: {
    domain: 'https://sehmidigitals.online',
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: new Date().toISOString().slice(0, 10),
    extraUrls: []
  },
  robotsTxt: {
    allowAll: true,
    disallowPaths: ['/seo-panel.html'],
    customRules: ''
  }
};

let state = deepClone(DEFAULT_CONFIG);
let isDirty = false;
let toastTimer = null;

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function mergeConfig(base, loaded) {
  const out = deepClone(base);
  if (!loaded || typeof loaded !== 'object') return out;
  Object.keys(out).forEach(key => {
    if (loaded[key] !== undefined) {
      if (out[key] && typeof out[key] === 'object' && !Array.isArray(out[key])) {
        out[key] = Object.assign({}, out[key], loaded[key]);
      } else {
        out[key] = loaded[key];
      }
    }
  });
  return out;
}

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeXml(str) {
  return escapeAttr(str).replace(/'/g, '&apos;');
}

function extractMetaContent(input) {
  const raw = String(input || '').trim();
  if (!raw) return '';
  const match = raw.match(/content\s*=\s*["']([^"']+)["']/i);
  if (match && match[1]) return match[1].trim();
  return raw.replace(/[<>"']/g, '').trim();
}

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

function markDirty(flag = true) {
  isDirty = flag;
  const badge = document.getElementById('unsaved-badge');
  if (badge) badge.classList.toggle('visible', isDirty);
}

/* ==========================================================================
   CODE GENERATORS (HEAD HTML, JSON-LD, SITEMAP.XML, ROBOTS.TXT)
   ========================================================================== */

function buildSchemaObject(cfg) {
  const s = cfg.schema;
  const obj = {
    '@context': 'https://schema.org',
    '@type': s.type || 'ProfessionalService',
    name: s.name || cfg.basic.author || 'Sehmi Digital Marketing',
    description: s.description || cfg.basic.description,
    url: (s.url || cfg.basic.canonicalUrl || 'https://sehmidigitals.online').replace(/\/+$/, ''),
    logo: s.logo || 'https://sehmidigitals.online/assets/logo.svg'
  };

  if (s.priceRange) obj.priceRange = s.priceRange;
  if (s.areaServed) obj.areaServed = s.areaServed;
  if (s.telephone) obj.telephone = s.telephone;
  if (s.email) obj.email = s.email;

  if (s.addressLocality || s.addressCountry) {
    obj.address = {
      '@type': 'PostalAddress'
    };
    if (s.addressLocality) obj.address.addressLocality = s.addressLocality;
    if (s.addressCountry) obj.address.addressCountry = s.addressCountry;
  }

  if (Array.isArray(s.knowsAbout) && s.knowsAbout.length > 0) {
    obj.knowsAbout = s.knowsAbout.filter(Boolean);
  }

  const services = (s.services || []).map(x => String(x || '').trim()).filter(Boolean);
  if (services.length > 0) {
    obj.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Digital Marketing Services',
      itemListElement: services.map(name => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name
        }
      }))
    };
  }

  return obj;
}

function generateHeadSeoBlock(cfg) {
  const b = cfg.basic;
  const soc = cfg.social;
  const v = cfg.verifications;
  const t = cfg.tracking;
  const keywordsStr = (b.keywords || []).filter(Boolean).join(', ');
  const canonical = (b.canonicalUrl || 'https://sehmidigitals.online/').trim();
  const lines = [];

  lines.push('  <!-- SEO-PANEL:START -->');
  lines.push(`  <title>${escapeHtml(b.title)}</title>`);
  lines.push(`  <meta name="description" content="${escapeAttr(b.description)}">`);
  if (keywordsStr) {
    lines.push(`  <meta name="keywords" content="${escapeAttr(keywordsStr)}">`);
  }
  if (b.author) {
    lines.push(`  <meta name="author" content="${escapeAttr(b.author)}">`);
  }
  if (b.robots) {
    lines.push(`  <meta name="robots" content="${escapeAttr(b.robots)}">`);
  }
  if (b.themeColor) {
    lines.push(`  <meta name="theme-color" content="${escapeAttr(b.themeColor)}">`);
  }

  // Verifications
  const verLines = [];
  if (v.googleSiteVerification) {
    verLines.push(`  <meta name="google-site-verification" content="${escapeAttr(v.googleSiteVerification)}">`);
  }
  if (v.facebookDomainVerification) {
    verLines.push(`  <meta name="facebook-domain-verification" content="${escapeAttr(v.facebookDomainVerification)}">`);
  }
  if (v.bingVerification) {
    verLines.push(`  <meta name="msvalidate.01" content="${escapeAttr(v.bingVerification)}">`);
  }
  if (verLines.length) {
    lines.push('');
    lines.push('  <!-- Search & Domain Verifications -->');
    lines.push(...verLines);
  }

  // Canonical & Open Graph
  lines.push('');
  lines.push('  <!-- Canonical & Open Graph -->');
  lines.push(`  <link rel="canonical" href="${escapeAttr(canonical)}">`);
  lines.push(`  <meta property="og:type" content="${escapeAttr(soc.ogType || 'website')}">`);
  lines.push(`  <meta property="og:url" content="${escapeAttr(canonical)}">`);
  lines.push(`  <meta property="og:title" content="${escapeAttr(soc.ogTitle || b.title)}">`);
  lines.push(`  <meta property="og:description" content="${escapeAttr(soc.ogDescription || b.description)}">`);
  if (soc.ogImage) {
    lines.push(`  <meta property="og:image" content="${escapeAttr(soc.ogImage)}">`);
  }

  // Twitter Card
  lines.push('');
  lines.push('  <!-- Twitter Card -->');
  lines.push(`  <meta name="twitter:card" content="${escapeAttr(soc.twitterCard || 'summary_large_image')}">`);
  if (soc.twitterHandle) {
    lines.push(`  <meta name="twitter:site" content="${escapeAttr(soc.twitterHandle)}">`);
  }
  lines.push(`  <meta name="twitter:title" content="${escapeAttr(soc.twitterTitle || soc.ogTitle || b.title)}">`);
  lines.push(`  <meta name="twitter:description" content="${escapeAttr(soc.twitterDescription || soc.ogDescription || b.description)}">`);
  if (soc.ogImage) {
    lines.push(`  <meta name="twitter:image" content="${escapeAttr(soc.ogImage)}">`);
  }

  // Schema JSON-LD
  const schemaJson = JSON.stringify(buildSchemaObject(cfg), null, 2)
    .split('\n')
    .map(line => '  ' + line)
    .join('\n');
  lines.push('');
  lines.push('  <!-- Schema.org JSON-LD Structured Data -->');
  lines.push('  <script type="application/ld+json">');
  lines.push(schemaJson);
  lines.push('  </script>');

  // Google Analytics 4
  if (t.ga4Id && t.ga4Id.trim()) {
    const gaId = escapeAttr(t.ga4Id.trim());
    lines.push('');
    lines.push('  <!-- Google Analytics 4 (GA4) -->');
    lines.push(`  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>`);
    lines.push('  <script>');
    lines.push('    window.dataLayer = window.dataLayer || [];');
    lines.push('    function gtag(){dataLayer.push(arguments);}');
    lines.push("    gtag('js', new Date());");
    lines.push(`    gtag('config', '${gaId}');`);
    lines.push('  </script>');
  }

  // Google Tag Manager
  if (t.gtmId && t.gtmId.trim()) {
    const gtmId = escapeAttr(t.gtmId.trim());
    lines.push('');
    lines.push('  <!-- Google Tag Manager -->');
    lines.push('  <script>');
    lines.push("    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':");
    lines.push("    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],");
    lines.push("    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=");
    lines.push("    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);");
    lines.push(`    })(window,document,'script','dataLayer','${gtmId}');`);
    lines.push('  </script>');
  }

  // Meta Pixel
  if (t.metaPixelEnabled && t.metaPixelId && t.metaPixelId.trim()) {
    const pid = escapeAttr(t.metaPixelId.trim());
    lines.push('');
    lines.push('  <!-- Meta Pixel Code -->');
    lines.push('  <script>');
    lines.push('    !function(f,b,e,v,n,t,s)');
    lines.push('    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?');
    lines.push('    n.callMethod.apply(n,arguments):n.queue.push(arguments)};');
    lines.push("    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';");
    lines.push('    n.queue=[];t=b.createElement(e);t.async=!0;');
    lines.push('    t.src=v;s=b.getElementsByTagName(e)[0];');
    lines.push("    s.parentNode.insertBefore(t,s)}(window, document,'script',");
    lines.push("    'https://connect.facebook.net/en_US/fbevents.js');");
    lines.push(`    fbq('init', '${pid}');`);
    lines.push("    fbq('track', 'PageView');");
    lines.push('  </script>');
    lines.push('  <noscript>');
    lines.push('    <img height="1" width="1" style="display:none"');
    lines.push(`    src="https://www.facebook.com/tr?id=${pid}&ev=PageView&noscript=1"`);
    lines.push('    alt="" />');
    lines.push('  </noscript>');
    lines.push('  <!-- End Meta Pixel Code -->');
  }

  lines.push('  <!-- SEO-PANEL:END -->');
  return lines.join('\n');
}

function generateSitemapXml(cfg) {
  const sm = cfg.sitemap;
  const domain = (sm.domain || 'https://sehmidigitals.online').replace(/\/+$/, '');
  const lastmod = sm.lastmod || new Date().toISOString().slice(0, 10);
  const freq = sm.changefreq || 'weekly';
  const priority = sm.priority || '1.0';

  const urls = [
    { loc: `${domain}/`, lastmod, changefreq: freq, priority }
  ];

  (sm.extraUrls || []).forEach(path => {
    const clean = String(path || '').trim();
    if (!clean) return;
    const full = clean.startsWith('http') ? clean : `${domain}${clean.startsWith('/') ? '' : '/'}${clean}`;
    urls.push({ loc: full, lastmod, changefreq: freq, priority: '0.8' });
  });

  const entries = urls.map(u => [
    '  <url>',
    `    <loc>${escapeXml(u.loc)}</loc>`,
    `    <lastmod>${escapeXml(u.lastmod)}</lastmod>`,
    `    <changefreq>${escapeXml(u.changefreq)}</changefreq>`,
    `    <priority>${escapeXml(u.priority)}</priority>`,
    '  </url>'
  ].join('\n')).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function generateRobotsTxt(cfg) {
  const r = cfg.robotsTxt;
  const domain = (cfg.sitemap.domain || 'https://sehmidigitals.online').replace(/\/+$/, '');
  const lines = ['User-agent: *'];

  if (r.allowAll) {
    lines.push('Allow: /');
    const disallows = (r.disallowPaths && r.disallowPaths.length) ? r.disallowPaths : ['/seo-panel.html'];
    disallows.forEach(p => {
      if (String(p).trim()) lines.push(`Disallow: ${String(p).trim()}`);
    });
  } else {
    lines.push('Disallow: /');
  }

  if (r.customRules && r.customRules.trim()) {
    lines.push('');
    lines.push(r.customRules.trim());
  }

  lines.push('');
  lines.push(`Sitemap: ${domain}/sitemap.xml`);
  return lines.join('\n') + '\n';
}

function replaceSeoBlockInHtml(htmlContent, newSeoBlock) {
  const regex = /[ \t]*<!--\s*SEO-PANEL:START\s*-->[\s\S]*?<!--\s*SEO-PANEL:END\s*-->/;
  if (!regex.test(htmlContent)) {
    throw new Error('Could not find <!-- SEO-PANEL:START --> markers in index.html.');
  }
  return htmlContent.replace(regex, newSeoBlock);
}

/* ==========================================================================
   SEO HEALTH AUDIT SCORING
   ========================================================================== */

function evaluateSeoAudit(cfg) {
  const checks = [];
  const tLen = (cfg.basic.title || '').trim().length;
  const dLen = (cfg.basic.description || '').trim().length;
  const kCount = (cfg.basic.keywords || []).filter(Boolean).length;

  // 1. Title
  if (tLen >= 40 && tLen <= 65) {
    checks.push({ status: 'pass', pts: 18, text: `SEO Title length is ideal (${tLen} chars)` });
  } else if (tLen > 0) {
    checks.push({ status: 'warn', pts: 10, text: `SEO Title is ${tLen} chars (aim for 50–60 chars)` });
  } else {
    checks.push({ status: 'fail', pts: 0, text: 'SEO Title is missing' });
  }

  // 2. Description
  if (dLen >= 110 && dLen <= 165) {
    checks.push({ status: 'pass', pts: 18, text: `Meta Description length is ideal (${dLen} chars)` });
  } else if (dLen > 0) {
    checks.push({ status: 'warn', pts: 10, text: `Meta Description is ${dLen} chars (aim for 120–160 chars)` });
  } else {
    checks.push({ status: 'fail', pts: 0, text: 'Meta Description is missing' });
  }

  // 3. Keywords
  if (kCount >= 4) {
    checks.push({ status: 'pass', pts: 10, text: `${kCount} focus keywords configured` });
  } else {
    checks.push({ status: 'warn', pts: 5, text: 'Add at least 4 relevant focus keywords' });
  }

  // 4. Indexing & Canonical
  if ((cfg.basic.robots || '').includes('index') && !cfg.basic.robots.includes('noindex') && cfg.robotsTxt.allowAll) {
    checks.push({ status: 'pass', pts: 12, text: 'Search engine indexing is enabled' });
  } else {
    checks.push({ status: 'fail', pts: 0, text: 'Warning: Site is currently hidden from Google (noindex)' });
  }

  // 5. Social Image
  if (cfg.social.ogImage && cfg.social.ogImage.startsWith('http')) {
    checks.push({ status: 'pass', pts: 12, text: 'Social share image (og:image) is set' });
  } else {
    checks.push({ status: 'warn', pts: 0, text: 'Add a Social Share image for WhatsApp & Facebook previews' });
  }

  // 6. Meta Pixel
  if (cfg.tracking.metaPixelEnabled && cfg.tracking.metaPixelId) {
    checks.push({ status: 'pass', pts: 10, text: `Meta Pixel active (ID: ${cfg.tracking.metaPixelId})` });
  } else {
    checks.push({ status: 'warn', pts: 0, text: 'Meta Pixel tracking is disabled' });
  }

  // 7. Google Search Console Verification
  if (cfg.verifications.googleSiteVerification) {
    checks.push({ status: 'pass', pts: 10, text: 'Google Search Console verification tag set' });
  } else {
    checks.push({ status: 'warn', pts: 0, text: 'Tip: Add Google Search Console verification code' });
  }

  // 8. Meta Domain Verification
  if (cfg.verifications.facebookDomainVerification) {
    checks.push({ status: 'pass', pts: 10, text: 'Meta Domain Verification tag set' });
  } else {
    checks.push({ status: 'warn', pts: 0, text: 'Tip: Add Meta Domain Verification code for iOS ads' });
  }

  const score = Math.min(100, checks.reduce((sum, c) => sum + c.pts, 0));
  return { score, checks };
}

/* ==========================================================================
   UI RENDERING & BINDING
   ========================================================================== */

function populateFormFromState() {
  // Basic
  document.getElementById('basic-title').value = state.basic.title || '';
  document.getElementById('basic-desc').value = state.basic.description || '';
  document.getElementById('basic-canonical').value = state.basic.canonicalUrl || '';
  document.getElementById('basic-author').value = state.basic.author || '';
  document.getElementById('basic-robots').value = state.basic.robots || 'index, follow';
  document.getElementById('basic-theme-color').value = state.basic.themeColor || '#18082D';

  // Social
  document.getElementById('social-og-title').value = state.social.ogTitle || '';
  document.getElementById('social-og-desc').value = state.social.ogDescription || '';
  document.getElementById('social-og-image').value = state.social.ogImage || '';
  document.getElementById('social-twitter-card').value = state.social.twitterCard || 'summary_large_image';
  document.getElementById('social-twitter-handle').value = state.social.twitterHandle || '';
  document.getElementById('social-twitter-title').value = state.social.twitterTitle || '';
  document.getElementById('social-twitter-desc').value = state.social.twitterDescription || '';

  // Verifications & Tracking
  document.getElementById('track-pixel-enabled').checked = !!state.tracking.metaPixelEnabled;
  document.getElementById('track-pixel-id').value = state.tracking.metaPixelId || '';
  document.getElementById('verify-facebook').value = state.verifications.facebookDomainVerification || '';
  document.getElementById('verify-google').value = state.verifications.googleSiteVerification || '';
  document.getElementById('verify-bing').value = state.verifications.bingVerification || '';
  document.getElementById('track-ga4-id').value = state.tracking.ga4Id || '';
  document.getElementById('track-gtm-id').value = state.tracking.gtmId || '';

  // Schema
  document.getElementById('schema-name').value = state.schema.name || '';
  document.getElementById('schema-type').value = state.schema.type || 'ProfessionalService';
  document.getElementById('schema-desc').value = state.schema.description || '';
  document.getElementById('schema-phone').value = state.schema.telephone || '';
  document.getElementById('schema-email').value = state.schema.email || '';
  document.getElementById('schema-city').value = state.schema.addressLocality || '';
  document.getElementById('schema-country').value = state.schema.addressCountry || '';
  document.getElementById('schema-area').value = state.schema.areaServed || '';
  document.getElementById('schema-price').value = state.schema.priceRange || '$$';

  // Sitemap & Robots
  document.getElementById('sitemap-domain').value = state.sitemap.domain || 'https://sehmidigitals.online';
  document.getElementById('sitemap-lastmod').value = state.sitemap.lastmod || new Date().toISOString().slice(0, 10);
  document.getElementById('sitemap-freq').value = state.sitemap.changefreq || 'weekly';
  document.getElementById('sitemap-priority').value = state.sitemap.priority || '1.0';
  document.getElementById('robots-allow-all').checked = state.robotsTxt.allowAll !== false;

  renderChips('keywords-chips-box', 'keywords-input', state.basic.keywords, (next) => {
    state.basic.keywords = next;
    onStateChanged();
  });
  renderChips('knows-chips-box', 'knows-input', state.schema.knowsAbout, (next) => {
    state.schema.knowsAbout = next;
    onStateChanged();
  });

  renderStringList('schema-services-list', state.schema.services, 'e.g. SEO & AI Search Optimization', (next) => {
    state.schema.services = next;
    onStateChanged();
  });
  renderStringList('sitemap-extra-list', state.sitemap.extraUrls, 'e.g. /blog.html', (next) => {
    state.sitemap.extraUrls = next;
    onStateChanged();
  });

  updateAllPreviews();
}

function renderChips(boxId, inputId, items, onUpdate) {
  const box = document.getElementById(boxId);
  const input = document.getElementById(inputId);
  if (!box || !input) return;

  box.querySelectorAll('.chip').forEach(el => el.remove());

  (items || []).forEach((text, idx) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.innerHTML = `<span>${escapeHtml(text)}</span><button type="button" aria-label="Remove ${escapeAttr(text)}">&times;</button>`;
    chip.querySelector('button').addEventListener('click', () => {
      const updated = items.filter((_, i) => i !== idx);
      renderChips(boxId, inputId, updated, onUpdate);
      onUpdate(updated);
    });
    box.insertBefore(chip, input);
  });
}

function wireChipsInput(boxId, inputId, getArr, setArr) {
  const box = document.getElementById(boxId);
  const input = document.getElementById(inputId);
  if (!box || !input) return;

  box.addEventListener('click', () => input.focus());

  function addCurrentValue() {
    const parts = input.value.split(',').map(s => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const current = getArr();
    const next = [...current];
    parts.forEach(p => {
      if (!next.some(existing => existing.toLowerCase() === p.toLowerCase())) {
        next.push(p);
      }
    });
    input.value = '';
    setArr(next);
    renderChips(boxId, inputId, next, setArr);
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCurrentValue();
    } else if (e.key === 'Backspace' && !input.value) {
      const current = getArr();
      if (current.length) {
        const next = current.slice(0, -1);
        setArr(next);
        renderChips(boxId, inputId, next, setArr);
      }
    }
  });

  input.addEventListener('blur', addCurrentValue);
}

function renderStringList(containerId, items, placeholder, onUpdate) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  (items || []).forEach((val, idx) => {
    const row = document.createElement('div');
    row.className = 'list-item-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = val;
    input.placeholder = placeholder;
    input.addEventListener('input', () => {
      const next = [...items];
      next[idx] = input.value;
      onUpdate(next);
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'icon-btn-remove';
    removeBtn.title = 'Remove';
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', () => {
      const next = items.filter((_, i) => i !== idx);
      renderStringList(containerId, next, placeholder, onUpdate);
      onUpdate(next);
    });

    row.appendChild(input);
    row.appendChild(removeBtn);
    container.appendChild(row);
  });
}

function updateMeter(counterId, meterId, len, minGood, maxGood, maxHard) {
  const counter = document.getElementById(counterId);
  const meter = document.getElementById(meterId);
  if (!counter || !meter) return;

  counter.textContent = `${len} / ${maxGood} chars`;
  counter.classList.remove('good', 'warn', 'bad');

  const pct = Math.min(100, Math.round((len / maxHard) * 100));
  meter.style.width = `${pct}%`;

  if (len >= minGood && len <= maxGood) {
    counter.classList.add('good');
    meter.style.background = '#16A34A';
  } else if (len > maxGood) {
    counter.classList.add('bad');
    meter.style.background = '#DC2626';
  } else {
    counter.classList.add('warn');
    meter.style.background = '#D97706';
  }
}

function resolvePreviewImage(url) {
  const raw = String(url || '').trim();
  if (!raw) return 'assets/logo-concept-lockup.jpg';
  if (window.location.protocol === 'file:' && raw.includes('/assets/')) {
    return 'assets/' + raw.split('/assets/')[1];
  }
  return raw;
}

function updateAllPreviews() {
  state.updatedAt = new Date().toISOString().slice(0, 10);

  // Character meters
  updateMeter('title-counter', 'title-meter', (state.basic.title || '').length, 45, 60, 75);
  updateMeter('desc-counter', 'desc-meter', (state.basic.description || '').length, 120, 160, 185);
  document.getElementById('keywords-count').textContent = `${(state.basic.keywords || []).length} keywords`;

  // Google SERP preview
  const serpTitle = state.basic.title || 'Untitled Page';
  const serpDesc = state.basic.description || 'Add a meta description to preview how Google shows your website.';
  const serpUrl = state.basic.canonicalUrl || 'https://sehmidigitals.online/';
  document.getElementById('prev-serp-brand').textContent = state.basic.author || 'Sehmi Digital Marketing';
  document.getElementById('prev-serp-url').textContent = serpUrl;
  document.getElementById('prev-serp-title').textContent = serpTitle.length > 65 ? serpTitle.slice(0, 62) + '...' : serpTitle;
  document.getElementById('prev-serp-desc').textContent = serpDesc.length > 162 ? serpDesc.slice(0, 159) + '...' : serpDesc;

  // Social OG preview
  let domainLabel = 'SEHMIDIGITALS.ONLINE';
  try {
    domainLabel = new URL(serpUrl).hostname.toUpperCase();
  } catch (_) {}
  document.getElementById('prev-og-domain').textContent = domainLabel;
  document.getElementById('prev-og-title').textContent = state.social.ogTitle || serpTitle;
  document.getElementById('prev-og-desc').textContent = state.social.ogDescription || serpDesc;
  document.getElementById('prev-og-img').src = resolvePreviewImage(state.social.ogImage);

  // Asset picker highlight
  document.querySelectorAll('#og-asset-picker .asset-option').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.url === state.social.ogImage);
  });

  // Code previews
  document.getElementById('schema-preview-code').textContent = JSON.stringify(buildSchemaObject(state), null, 2);
  document.getElementById('sitemap-preview-code').textContent = generateSitemapXml(state);
  document.getElementById('robots-preview-code').textContent = generateRobotsTxt(state);
  document.getElementById('head-html-preview').textContent = generateHeadSeoBlock(state);

  // SEO Audit checklist
  const audit = evaluateSeoAudit(state);
  document.getElementById('header-score-val').textContent = audit.score;
  document.getElementById('audit-score-label').textContent = `${audit.score}/100`;
  const dot = document.getElementById('header-score-dot');
  dot.style.background = audit.score >= 80 ? '#16A34A' : audit.score >= 60 ? '#D97706' : '#DC2626';

  const listEl = document.getElementById('seo-audit-list');
  listEl.innerHTML = audit.checks.map(c => {
    const icon = c.status === 'pass' ? '&#10003;' : c.status === 'warn' ? '!' : '&times;';
    return `<li class="audit-item"><span class="audit-badge ${c.status}">${icon}</span><span>${escapeHtml(c.text)}</span></li>`;
  }).join('');
}

function onStateChanged() {
  markDirty(true);
  updateAllPreviews();
}

function bindInput(id, setter, transform) {
  const el = document.getElementById(id);
  if (!el) return;
  const evt = (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'date') ? 'change' : 'input';
  el.addEventListener(evt, () => {
    let val = el.type === 'checkbox' ? el.checked : el.value;
    if (transform) {
      const cleaned = transform(val);
      if (cleaned !== val && el.type !== 'checkbox') {
        el.value = cleaned;
      }
      val = cleaned;
    }
    setter(val);
    onStateChanged();
  });
}

/* ==========================================================================
   PUBLISHING: GITHUB ONE-CLICK ATOMIC COMMIT & LOCAL FOLDER SAVE
   ========================================================================== */

function setLog(elId, type, html) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = `status-log ${type}`;
  el.innerHTML = html;
}

async function githubApi(path, token, method = 'GET', body = null) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `GitHub API error (${res.status})`);
  }
  return data;
}

function decodeBase64Utf8(b64) {
  const binary = atob(b64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function publishToGitHub() {
  const repo = document.getElementById('gh-repo').value.trim();
  const branch = document.getElementById('gh-branch').value.trim() || 'main';
  const token = document.getElementById('gh-token').value.trim();
  const btn = document.getElementById('publish-github-btn');

  if (!repo || !repo.includes('/')) {
    setLog('github-status-log', 'error', 'Please enter a valid repository in <code>owner/repo</code> format.');
    return;
  }
  if (!token) {
    setLog('github-status-log', 'error', 'Please paste your GitHub Personal Access Token first.');
    document.getElementById('gh-token').focus();
    return;
  }

  localStorage.setItem('sehmi_seo_gh_token', token);
  localStorage.setItem('sehmi_seo_gh_repo', repo);

  btn.disabled = true;
  btn.textContent = 'Publishing Live...';
  setLog('github-status-log', 'info', 'Step 1/4: Connecting to GitHub and reading live <code>index.html</code>...');

  try {
    // 1. Get branch ref & base commit
    const ref = await githubApi(`/repos/${repo}/git/ref/heads/${branch}`, token);
    const latestCommitSha = ref.object.sha;
    const latestCommit = await githubApi(`/repos/${repo}/git/commits/${latestCommitSha}`, token);
    const baseTreeSha = latestCommit.tree.sha;

    // 2. Read current index.html
    const indexFile = await githubApi(`/repos/${repo}/contents/index.html?ref=${branch}`, token);
    const currentIndexHtml = decodeBase64Utf8(indexFile.content);
    const updatedIndexHtml = replaceSeoBlockInHtml(currentIndexHtml, generateHeadSeoBlock(state));

    setLog('github-status-log', 'info', 'Step 2/4: Packaging <code>index.html</code>, <code>seo-config.json</code>, <code>sitemap.xml</code>, and <code>robots.txt</code>...');

    const files = [
      { path: 'index.html', content: updatedIndexHtml },
      { path: 'seo-config.json', content: JSON.stringify(state, null, 2) + '\n' },
      { path: 'sitemap.xml', content: generateSitemapXml(state) },
      { path: 'robots.txt', content: generateRobotsTxt(state) }
    ];

    // 3. Create blobs
    const treeEntries = [];
    for (const f of files) {
      const blob = await githubApi(`/repos/${repo}/git/blobs`, token, 'POST', {
        content: f.content,
        encoding: 'utf-8'
      });
      treeEntries.push({
        path: f.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      });
    }

    setLog('github-status-log', 'info', 'Step 3/4: Creating atomic SEO update commit...');

    // 4. Create tree, commit, and update branch
    const newTree = await githubApi(`/repos/${repo}/git/trees`, token, 'POST', {
      base_tree: baseTreeSha,
      tree: treeEntries
    });

    const newCommit = await githubApi(`/repos/${repo}/git/commits`, token, 'POST', {
      message: `Update SEO settings via SEO Control Panel (${state.updatedAt})`,
      tree: newTree.sha,
      parents: [latestCommitSha]
    });

    setLog('github-status-log', 'info', 'Step 4/4: Deploying to GitHub Pages...');
    await githubApi(`/repos/${repo}/git/refs/heads/${branch}`, token, 'PATCH', {
      sha: newCommit.sha
    });

    markDirty(false);
    setLog(
      'github-status-log',
      'success',
      `<strong>Published Successfully!</strong> Commit <code>${newCommit.sha.slice(0, 7)}</code> pushed to <code>${branch}</code>.<br>` +
      `GitHub Pages is rebuilding now — your updated SEO will be live on <a href="https://sehmidigitals.online/" target="_blank" rel="noopener"><strong>https://sehmidigitals.online</strong></a> in ~45 seconds.`
    );
    showToast('SEO changes published live to GitHub!');
  } catch (err) {
    setLog('github-status-log', 'error', `<strong>Publish failed:</strong> ${escapeHtml(err.message)}`);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Publish Live to sehmidigitals.online';
  }
}

async function saveDirectlyToLocalFolder() {
  if (!window.showDirectoryPicker) {
    setLog(
      'local-status-log',
      'error',
      'Direct folder saving requires Chrome or Edge on desktop. Use <strong>Download seo-config.json</strong> instead and double-click <code>Update-SEO-Live.bat</code>.'
    );
    return;
  }

  try {
    const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });

    // Read & update index.html
    const indexHandle = await dirHandle.getFileHandle('index.html');
    const indexFile = await indexHandle.getFile();
    const indexText = await indexFile.text();
    const updatedIndex = replaceSeoBlockInHtml(indexText, generateHeadSeoBlock(state));

    async function writeFile(name, text) {
      const fh = await dirHandle.getFileHandle(name, { create: true });
      const writable = await fh.createWritable();
      await writable.write(text);
      await writable.close();
    }

    await writeFile('index.html', updatedIndex);
    await writeFile('seo-config.json', JSON.stringify(state, null, 2) + '\n');
    await writeFile('sitemap.xml', generateSitemapXml(state));
    await writeFile('robots.txt', generateRobotsTxt(state));

    markDirty(false);
    setLog(
      'local-status-log',
      'success',
      '<strong>Saved directly to your local website folder!</strong> Updated <code>index.html</code>, <code>seo-config.json</code>, <code>sitemap.xml</code>, and <code>robots.txt</code>.<br>Double-click <code>Update-SEO-Live.bat</code> in that folder to push live to GitHub.'
    );
    showToast('Saved all SEO files to your folder!');
  } catch (err) {
    if (err.name === 'AbortError') return;
    setLog('local-status-log', 'error', `Could not write to folder: ${escapeHtml(err.message)}`);
  }
}

function downloadTextFile(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

async function loadLiveConfig(showNotification = false) {
  try {
    const res = await fetch(`seo-config.json?t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      state = mergeConfig(DEFAULT_CONFIG, json);
      if (showNotification) showToast('Reloaded live seo-config.json');
    } else {
      state = deepClone(DEFAULT_CONFIG);
    }
  } catch (_) {
    // Expected when opened directly via file://
    state = deepClone(DEFAULT_CONFIG);
    if (showNotification) showToast('Reset to default SEO config');
  }
  markDirty(false);
  populateFormFromState();
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.editor-pane');

  function activateTab(tabName) {
    tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
    panes.forEach(p => p.classList.toggle('active', p.id === `pane-${tabName}`));
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  document.getElementById('top-publish-btn').addEventListener('click', () => {
    activateTab('publish');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initDeviceToggle() {
  const btns = document.querySelectorAll('.device-toggle button');
  const box = document.getElementById('serp-preview-box');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      box.classList.toggle('mobile', btn.dataset.device === 'mobile');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initDeviceToggle();

  // Restore saved GitHub token/repo if present
  const savedToken = localStorage.getItem('sehmi_seo_gh_token');
  const savedRepo = localStorage.getItem('sehmi_seo_gh_repo');
  if (savedToken) document.getElementById('gh-token').value = savedToken;
  if (savedRepo) document.getElementById('gh-repo').value = savedRepo;

  // Bind Basic SEO fields
  bindInput('basic-title', v => { state.basic.title = v; });
  bindInput('basic-desc', v => { state.basic.description = v; });
  bindInput('basic-canonical', v => { state.basic.canonicalUrl = v; });
  bindInput('basic-author', v => { state.basic.author = v; });
  bindInput('basic-robots', v => { state.basic.robots = v; });
  bindInput('basic-theme-color', v => { state.basic.themeColor = v; });

  // Bind Social fields
  bindInput('social-og-title', v => { state.social.ogTitle = v; });
  bindInput('social-og-desc', v => { state.social.ogDescription = v; });
  bindInput('social-og-image', v => { state.social.ogImage = v; });
  bindInput('social-twitter-card', v => { state.social.twitterCard = v; });
  bindInput('social-twitter-handle', v => { state.social.twitterHandle = v; });
  bindInput('social-twitter-title', v => { state.social.twitterTitle = v; });
  bindInput('social-twitter-desc', v => { state.social.twitterDescription = v; });

  document.getElementById('sync-from-basic-btn').addEventListener('click', () => {
    state.social.ogTitle = state.basic.title;
    state.social.ogDescription = state.basic.description;
    state.social.twitterTitle = state.basic.title;
    state.social.twitterDescription = state.basic.description;
    populateFormFromState();
    markDirty(true);
    showToast('Copied title & description from Basic SEO');
  });

  document.querySelectorAll('#og-asset-picker .asset-option').forEach(btn => {
    btn.addEventListener('click', () => {
      state.social.ogImage = btn.dataset.url;
      document.getElementById('social-og-image').value = btn.dataset.url;
      onStateChanged();
    });
  });

  // Bind Verifications & Tracking (with smart paste extraction)
  bindInput('track-pixel-enabled', v => { state.tracking.metaPixelEnabled = v; });
  bindInput('track-pixel-id', v => { state.tracking.metaPixelId = v.trim(); });
  bindInput('verify-facebook', v => { state.verifications.facebookDomainVerification = v; }, extractMetaContent);
  bindInput('verify-google', v => { state.verifications.googleSiteVerification = v; }, extractMetaContent);
  bindInput('verify-bing', v => { state.verifications.bingVerification = v; }, extractMetaContent);
  bindInput('track-ga4-id', v => { state.tracking.ga4Id = v.trim(); });
  bindInput('track-gtm-id', v => { state.tracking.gtmId = v.trim(); });

  // Bind Schema fields
  bindInput('schema-name', v => { state.schema.name = v; });
  bindInput('schema-type', v => { state.schema.type = v; });
  bindInput('schema-desc', v => { state.schema.description = v; });
  bindInput('schema-phone', v => { state.schema.telephone = v; });
  bindInput('schema-email', v => { state.schema.email = v; });
  bindInput('schema-city', v => { state.schema.addressLocality = v; });
  bindInput('schema-country', v => { state.schema.addressCountry = v; });
  bindInput('schema-area', v => { state.schema.areaServed = v; });
  bindInput('schema-price', v => { state.schema.priceRange = v; });

  // Bind Sitemap & Robots
  bindInput('sitemap-domain', v => { state.sitemap.domain = v; });
  bindInput('sitemap-lastmod', v => { state.sitemap.lastmod = v; });
  bindInput('sitemap-freq', v => { state.sitemap.changefreq = v; });
  bindInput('sitemap-priority', v => { state.sitemap.priority = v; });
  bindInput('robots-allow-all', v => { state.robotsTxt.allowAll = v; });

  document.getElementById('set-today-btn').addEventListener('click', () => {
    const today = new Date().toISOString().slice(0, 10);
    state.sitemap.lastmod = today;
    document.getElementById('sitemap-lastmod').value = today;
    onStateChanged();
  });

  // Chips inputs
  wireChipsInput(
    'keywords-chips-box',
    'keywords-input',
    () => state.basic.keywords,
    (next) => { state.basic.keywords = next; onStateChanged(); }
  );
  wireChipsInput(
    'knows-chips-box',
    'knows-input',
    () => state.schema.knowsAbout,
    (next) => { state.schema.knowsAbout = next; onStateChanged(); }
  );

  // Dynamic list add buttons
  document.getElementById('add-service-btn').addEventListener('click', () => {
    state.schema.services.push('');
    renderStringList('schema-services-list', state.schema.services, 'e.g. Paid Ads Management', (next) => {
      state.schema.services = next;
      onStateChanged();
    });
    onStateChanged();
  });

  document.getElementById('add-sitemap-url-btn').addEventListener('click', () => {
    state.sitemap.extraUrls.push('');
    renderStringList('sitemap-extra-list', state.sitemap.extraUrls, 'e.g. /services.html', (next) => {
      state.sitemap.extraUrls = next;
      onStateChanged();
    });
    onStateChanged();
  });

  // Export & Action buttons
  document.getElementById('publish-github-btn').addEventListener('click', publishToGitHub);
  document.getElementById('clear-token-btn').addEventListener('click', () => {
    localStorage.removeItem('sehmi_seo_gh_token');
    document.getElementById('gh-token').value = '';
    showToast('Saved GitHub token cleared');
  });

  document.getElementById('save-local-folder-btn').addEventListener('click', saveDirectlyToLocalFolder);
  document.getElementById('download-config-btn').addEventListener('click', () => {
    downloadTextFile('seo-config.json', JSON.stringify(state, null, 2) + '\n', 'application/json');
    showToast('Downloaded seo-config.json');
  });
  document.getElementById('dl-sitemap-btn').addEventListener('click', () => {
    downloadTextFile('sitemap.xml', generateSitemapXml(state), 'application/xml');
    showToast('Downloaded sitemap.xml');
  });
  document.getElementById('dl-robots-btn').addEventListener('click', () => {
    downloadTextFile('robots.txt', generateRobotsTxt(state), 'text/plain');
    showToast('Downloaded robots.txt');
  });
  document.getElementById('copy-head-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(generateHeadSeoBlock(state));
      showToast('Copied SEO <head> HTML to clipboard!');
    } catch (_) {
      showToast('Select the code box to copy manually');
    }
  });

  // Import & Reset
  document.getElementById('import-json-trigger').addEventListener('click', () => {
    document.getElementById('import-json-file').click();
  });
  document.getElementById('import-json-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      state = mergeConfig(DEFAULT_CONFIG, parsed);
      populateFormFromState();
      markDirty(true);
      showToast('Imported seo-config.json successfully');
    } catch (err) {
      showToast('Invalid JSON file: ' + err.message);
    }
    e.target.value = '';
  });

  document.getElementById('reset-defaults-btn').addEventListener('click', () => loadLiveConfig(true));

  // Initial load
  loadLiveConfig(false);
});
