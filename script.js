document.addEventListener('DOMContentLoaded', () => {

  // Visibility API to pause animations
  let isPageVisible = true;
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });



  // Sistema de Abas para Indicados
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // Remove active de todos os botões
      tabButtons.forEach(btn => btn.classList.remove('active'));

      // Remove active de todos os panes
      tabPanes.forEach(pane => pane.classList.remove('active'));

      // Adiciona active ao botão clicado
      button.classList.add('active');

      // Adiciona active ao pane correspondente
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  console.log('Oscar 2026 Page Loaded');

  // ==========================================
  // PARALLAX - Hero Elements with Smooth Interpolation
  // ==========================================
  const heroBg = document.querySelector('.hero-bg');
  const heroTextOverlay = document.querySelector('.hero-text-overlay');
  const heroDate = document.querySelector('.hero-date');
  const heroHeadline = document.querySelector('.hero-headline');
  const heroSubheadline = document.querySelector('.hero-subheadline');
  const heroBtn = document.querySelector('.hero .btn');
  const heroLogo = document.querySelector('.hero-logo');
  const scrollIndicator = document.querySelector('.scroll-indicator');

  // Current smooth values
  let smoothValues = {
    bgY: 0, bgScale: 1,
    overlayOpacity: 1,
    logoY: 0, logoOpacity: 1,
    dateY: 0, dateOpacity: 1,
    headlineY: 0, headlineOpacity: 1,
    subheadlineY: 0, subheadlineOpacity: 1,
    btnY: 0, btnOpacity: 1,
    scrollOpacity: 1
  };

  // Target values (from scroll)
  let targetValues = { ...smoothValues };

  // Lerp function for smooth interpolation
  const lerp = (start, end, factor) => start + (end - start) * factor;
  const smoothFactor = 0.08; // Lower = smoother but slower

  function updateParallax() { // Renamed from animateParallax to updateParallax to avoid conflict
    // Read directly from window for max performance
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const heroHeight = window.innerHeight;

    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;

      // Update targets directly in the loop
      targetValues.bgY = scrollY * 0.4;
      targetValues.bgScale = 1 + scrollY * 0.0003;

      targetValues.overlayOpacity = Math.max(0, 1 - progress * 1.8);

      targetValues.logoY = scrollY * 0.9;
      targetValues.logoOpacity = Math.max(0, 1 - progress * 1.6); // Fades out faster

      targetValues.dateY = scrollY * 0.8;
      targetValues.dateOpacity = Math.max(0, 1 - progress * 1.5);

      targetValues.headlineY = scrollY * 0.4;
      targetValues.headlineOpacity = Math.max(0, 1 - progress * 1.2);

      targetValues.subheadlineY = scrollY * 0.3;
      targetValues.subheadlineOpacity = Math.max(0, 1 - progress * 1.3);

      targetValues.btnY = scrollY * 0.2;
      targetValues.btnOpacity = Math.max(0, 1 - progress * 1.4);

      targetValues.scrollOpacity = Math.max(0, 1 - progress * 2);
    }
  }

  function animateParallax() {
    if (!isPageVisible) {
      requestAnimationFrame(animateParallax);
      return;
    }

    // Smooth interpolation towards target values
    smoothValues.bgY = lerp(smoothValues.bgY, targetValues.bgY, smoothFactor);
    smoothValues.bgScale = lerp(smoothValues.bgScale, targetValues.bgScale, smoothFactor);

    smoothValues.overlayOpacity = lerp(smoothValues.overlayOpacity, targetValues.overlayOpacity, smoothFactor);

    smoothValues.logoY = lerp(smoothValues.logoY, targetValues.logoY, smoothFactor);
    smoothValues.logoOpacity = lerp(smoothValues.logoOpacity, targetValues.logoOpacity, smoothFactor);

    smoothValues.dateY = lerp(smoothValues.dateY, targetValues.dateY, smoothFactor);
    smoothValues.dateOpacity = lerp(smoothValues.dateOpacity, targetValues.dateOpacity, smoothFactor);

    smoothValues.headlineY = lerp(smoothValues.headlineY, targetValues.headlineY, smoothFactor);
    smoothValues.headlineOpacity = lerp(smoothValues.headlineOpacity, targetValues.headlineOpacity, smoothFactor);

    smoothValues.subheadlineY = lerp(smoothValues.subheadlineY, targetValues.subheadlineY, smoothFactor);
    smoothValues.subheadlineOpacity = lerp(smoothValues.subheadlineOpacity, targetValues.subheadlineOpacity, smoothFactor);

    smoothValues.btnY = lerp(smoothValues.btnY, targetValues.btnY, smoothFactor);
    smoothValues.btnOpacity = lerp(smoothValues.btnOpacity, targetValues.btnOpacity, smoothFactor);

    smoothValues.scrollOpacity = lerp(smoothValues.scrollOpacity, targetValues.scrollOpacity, smoothFactor);

    // Apply smooth values to elements
    if (heroBg) {
      heroBg.style.transform = `translateY(${smoothValues.bgY}px) scale(${smoothValues.bgScale})`;
    }
    if (heroTextOverlay) {
      heroTextOverlay.style.opacity = smoothValues.overlayOpacity;
    }
    if (heroLogo) {
      heroLogo.style.transform = `translateY(${smoothValues.logoY}px)`;
      heroLogo.style.opacity = smoothValues.logoOpacity;
    }
    if (heroDate) {
      heroDate.style.transform = `translateY(${smoothValues.dateY}px)`;
      heroDate.style.opacity = smoothValues.dateOpacity;
    }
    if (heroHeadline) {
      heroHeadline.style.transform = `translateY(${smoothValues.headlineY}px)`;
      heroHeadline.style.opacity = smoothValues.headlineOpacity;
    }
    if (heroSubheadline) {
      heroSubheadline.style.transform = `translateY(${smoothValues.subheadlineY}px)`;
      heroSubheadline.style.opacity = smoothValues.subheadlineOpacity;
    }
    if (heroBtn) {
      heroBtn.style.transform = `translateY(${smoothValues.btnY}px)`;
      heroBtn.style.opacity = smoothValues.btnOpacity;
    }
    if (scrollIndicator) {
      scrollIndicator.style.opacity = smoothValues.scrollOpacity;
    }

    requestAnimationFrame(animateParallax);
  }

  // Start parallax animation loop
  window.addEventListener('scroll', updateParallax);
  animateParallax();

  // ==========================================
  // GOLDEN PARTICLES SYSTEM
  // ==========================================
  class GoldenParticles {
    constructor(canvasId, options = {}) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.particleCount = options.count || 50;
      this.colors = options.colors || ['#f4d03f', '#d4a017', '#cfb26f', '#a98f37', '#8c7325'];
      this.maxSize = options.maxSize || 4;
      this.minSize = options.minSize || 1;
      this.speed = options.speed || 0.5;

      this.resize();
      this.init();
      this.animate();

      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const parent = this.canvas.parentElement;
      this.canvas.width = parent.offsetWidth;
      this.canvas.height = parent.offsetHeight;
    }

    init() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(this.createParticle());
      }
    }

    createParticle(atTop = false) {
      return {
        x: Math.random() * this.canvas.width,
        y: atTop ? -10 : Math.random() * this.canvas.height,
        size: Math.random() * (this.maxSize - this.minSize) + this.minSize,
        speedY: Math.random() * this.speed + 0.2,
        speedX: (Math.random() - 0.5) * 0.5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        opacity: Math.random() * 0.6 + 0.2,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01
      };
    }

    animate() {
      if (!isPageVisible) {
        requestAnimationFrame(() => this.animate());
        return;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((p, index) => {
        // Update position
        p.y += p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;

        // Reset if out of bounds
        if (p.y > this.canvas.height + 10 || p.x < -10 || p.x > this.canvas.width + 10) {
          this.particles[index] = this.createParticle(true);
        }

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fill();

        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = p.color;
      });

      this.ctx.globalAlpha = 1;
      this.ctx.shadowBlur = 0;

      requestAnimationFrame(() => this.animate());
    }
  }

  // Defer heavy non-critical visuals (Particles & AOS)
  let heavyScriptsInitialized = false;

  function initHeavyScripts() {
    if (heavyScriptsInitialized) return;
    heavyScriptsInitialized = true;

    console.log('Heavy Scripts: Initializing...');

    // Initialize particles on hero
    new GoldenParticles('particles-hero', {
      count: 60,
      maxSize: 3,
      speed: 0.4
    });

    // Initialize particles on nominees section
    new GoldenParticles('particles-nominees', {
      count: 40,
      maxSize: 2.5,
      speed: 0.3,
      colors: ['#f4d03f', '#d4a017', '#cfb26f']
    });

    // Initialize AOS Late (prevents TBT/CLS on load)
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: 'ease-out-cubic',
        disable: false // Re-enabled on mobile
      });
    }

    // Scroll Depth Tracking (Meta Pixel)
    (function trackScrollDepth() {
      var thresholds = [25, 50, 75, 90];
      var tracked = {};

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var pct = parseInt(entry.target.dataset.scrollDepth);
            if (!tracked[pct]) {
              tracked[pct] = true;
              if (typeof fbq === 'function') {
                fbq('trackCustom', 'ScrollDepth', { percentage: pct });
              }
            }
          }
        });
      });

      document.body.style.position = 'relative';
      thresholds.forEach(function (pct) {
        var marker = document.createElement('div');
        marker.dataset.scrollDepth = pct;
        marker.style.cssText = 'position:absolute;height:1px;width:1px;opacity:0;pointer-events:none;';
        marker.style.top = pct + '%';
        document.body.appendChild(marker);
        observer.observe(marker);
      });
    })();
  }

  function scriptsInteractionTrigger() {
    window.removeEventListener('scroll', scriptsInteractionTrigger);
    window.removeEventListener('touchstart', scriptsInteractionTrigger);
    window.removeEventListener('mousedown', scriptsInteractionTrigger);
    initHeavyScripts();
  }

  // Global Activation Logic
  if (window.innerWidth <= 768) {
    // MOBILE: Wait for interaction
    window.addEventListener('scroll', scriptsInteractionTrigger, { passive: true });
    window.addEventListener('touchstart', scriptsInteractionTrigger, { passive: true });
    window.addEventListener('mousedown', scriptsInteractionTrigger, { passive: true });
  } else {
    // DESKTOP: Auto-load after delay
    setTimeout(initHeavyScripts, 3000);
  }
  // ==========================================
  // CONTACT MODAL & FORM
  // ==========================================
  const contactOverlay = document.getElementById('contact-modal-overlay');
  const openModalBtn = document.getElementById('open-contact-modal');
  const closeModalBtn = document.getElementById('close-contact-modal');
  const contactForm = document.querySelector('[data-form]');
  const formFeedback = document.querySelector('.form-feedback');
  const telefoneInput = document.getElementById('telefone-contato');

  // intl-tel-input initialization
  let itiInstance = null;
  if (telefoneInput && typeof intlTelInput !== 'undefined') {
    itiInstance = intlTelInput(telefoneInput, {
      initialCountry: 'br',
      preferredCountries: ['br', 'us', 'pt'],
      separateDialCode: true,
      strictMode: true,
      loadUtilsOnInit: 'https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/utils.js'
    });
  }

  // Open modal
  function openModal() {
    if (contactOverlay) {
      contactOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Close modal
  function closeModal() {
    if (contactOverlay) {
      contactOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (formFeedback) {
        formFeedback.textContent = '';
        formFeedback.className = 'form-feedback';
      }
    }
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  // Close on overlay click
  if (contactOverlay) {
    contactOverlay.addEventListener('click', (e) => {
      if (e.target === contactOverlay) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactOverlay && contactOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Email validation - block temp domains
  const tempEmailDomains = [
    'tempmail', 'guerrillamail', '10minutemail', 'mailinator',
    'throwaway', 'fakeinbox', 'yopmail', 'trashmail', 'temp-mail',
    'disposable', 'sharklasers'
  ];

  function isValidEmail(email) {
    const domain = email.split('@')[1] || '';
    return !tempEmailDomains.some(temp => domain.toLowerCase().includes(temp));
  }

  // Form submit
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const emailField = contactForm.querySelector('[name="email"]');
      const nomeField = contactForm.querySelector('[name="nome"]');

      // Validate email
      if (emailField && !isValidEmail(emailField.value)) {
        formFeedback.textContent = 'Por favor, use um e-mail valido (nao temporario).';
        formFeedback.className = 'form-feedback error';
        return;
      }

      // Validate phone
      if (itiInstance && !itiInstance.isValidNumber()) {
        formFeedback.textContent = 'Por favor, insira um numero de WhatsApp valido.';
        formFeedback.className = 'form-feedback error';
        return;
      }

      // Disable button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      // Capture values before reset
      const nome = nomeField ? nomeField.value : '';
      const email = emailField ? emailField.value : '';

      // Build FormData
      const formData = new FormData(contactForm);

      // Replace telefone with international format
      if (itiInstance) {
        formData.set('telefone', itiInstance.getNumber());
      }

      try {
        const actionUrl = contactForm.getAttribute('action') || '/';
        const response = await fetch(actionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });

        if (response.ok) {
          // Track Lead
          if (typeof fbq === 'function') {
            fbq('track', 'Lead');
          }
          if (typeof dataLayer !== 'undefined') {
            dataLayer.push({ event: 'generate_lead' });
          }

          formFeedback.textContent = 'Mensagem enviada com sucesso!';
          formFeedback.className = 'form-feedback success';
          contactForm.reset();
          if (itiInstance) itiInstance.setCountry('br');

          // Auto-close modal after 3s
          setTimeout(closeModal, 3000);
        } else {
          throw new Error('Erro no envio');
        }
      } catch (err) {
        formFeedback.textContent = 'Erro ao enviar. Tente novamente.';
        formFeedback.className = 'form-feedback error';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Enviar Mensagem';
        }
      }
    });
  }

});
