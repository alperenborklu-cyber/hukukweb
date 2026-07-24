/* 
  Av. Mehmet Erşahin - Main JS Interaction File
*/

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollAnimations();
  initModals();
  initForms();
  initTabs();
  initBlogFilters();
  initFaqAccordions();
});

/* --- Sticky Header --- */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page starts scrolled
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuBtn || !navMenu) return;

  const toggleMenu = () => {
    menuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  };

  menuBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-container');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // If it's a stagger container, we can optionally unobserve after revealing
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if no IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* --- Modals (Appointment System) --- */
function initModals() {
  const triggers = document.querySelectorAll('.js-appointment-trigger');
  const modal = document.getElementById('appointment-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');

  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.classList.add('overflow-hidden');
    
    // Auto-focus first input
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.classList.remove('overflow-hidden');
  };

  triggers.forEach(trigger => trigger.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --- Form Submit Handlers & Feedback --- */
function initForms() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple client-side validation check
      let isValid = true;
      const requiredInputs = form.querySelectorAll('[required]');
      
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          
          // Remove error class on focus/input
          input.addEventListener('input', function handleInput() {
            input.classList.remove('error');
            input.removeEventListener('input', handleInput);
          });
        }
      });

      if (!isValid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Gönderiliyor...</span>`;
      }

      // Simulate API post request
      setTimeout(() => {
        // Show success state
        const successMessage = document.createElement('div');
        successMessage.style.backgroundColor = 'var(--accent-gold-muted)';
        successMessage.style.border = '1px solid var(--accent-gold)';
        successMessage.style.color = 'var(--accent-gold)';
        successMessage.style.padding = '1.5rem';
        successMessage.style.marginTop = '1.5rem';
        successMessage.style.textAlign = 'center';
        successMessage.style.fontFamily = 'var(--font-heading)';
        successMessage.style.fontSize = '1.2rem';
        successMessage.style.opacity = '0';
        successMessage.style.transition = 'opacity 0.4s ease';
        
        let successText = 'Talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçilecektir.';
        if (form.id === 'career-form') {
          successText = 'Başvurunuz başarıyla iletilmiştir. İlgili birimimiz inceledikten sonra dönüş yapacaktır.';
        } else if (form.id === 'appointment-form' || form.closest('.modal')) {
          successText = 'Randevu talebiniz alınmıştır. Müsaitlik durumuna göre onay e-postası gönderilecektir.';
        }
        
        successMessage.innerText = successText;
        
        form.appendChild(successMessage);
        setTimeout(() => successMessage.style.opacity = '1', 50);

        // Reset form
        form.reset();
        
        // Restore button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        // Auto remove success message after 5 seconds
        setTimeout(() => {
          successMessage.style.opacity = '0';
          setTimeout(() => successMessage.remove(), 400);
        }, 5000);

        // If it's in a modal, close the modal after 3 seconds
        const parentModal = form.closest('.modal');
        if (parentModal) {
          setTimeout(() => {
            parentModal.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
          }, 3000);
        }

      }, 1500);
    });
  });
}

/* --- Practice Areas Tabs (hizmetler.html) --- */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabBtns.length === 0) return;

  const activateTab = (targetId) => {
    // Set active button
    tabBtns.forEach(b => {
      if (b.getAttribute('data-tab') === targetId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // Set active panel
    tabPanels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      activateTab(targetId);
    });
  });

  // Check URL query parameters for deep linking
  const params = new URLSearchParams(window.location.search);
  const requestedTab = params.get('tab');
  const tabMapping = {
    'ceza': 'criminal-law',
    'kamu': 'criminal-law',
    'aile': 'private-law',
    'gayrimenkul': 'private-law',
    'kira': 'private-law',
    'ticaret': 'corporate-law',
    'icra': 'corporate-law',
    'is': 'corporate-law'
  };

  if (requestedTab && tabMapping[requestedTab]) {
    activateTab(tabMapping[requestedTab]);
  }
}

/* --- Dynamic Search & Filter Logic (blog.html) --- */
function initBlogFilters() {
  const searchInput = document.getElementById('blog-search');
  const filterSelect = document.getElementById('blog-category-filter');
  const blogCards = document.querySelectorAll('.blog-card-wrapper');

  if (!blogCards.length) return;

  const filterPosts = () => {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCategory = filterSelect ? filterSelect.value : 'all';

    blogCards.forEach(card => {
      const title = card.querySelector('h4').textContent.toLowerCase();
      const excerpt = card.querySelector('p').textContent.toLowerCase();
      const category = card.getAttribute('data-category');

      const matchesSearch = title.includes(query) || excerpt.includes(query);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'block';
        // Add dynamic reveal class to animate entry
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (searchInput) searchInput.addEventListener('input', filterPosts);
  if (filterSelect) filterSelect.addEventListener('change', filterPosts);
}

/* --- FAQ Accordions --- */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items (Accordion mode)
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = '0';
            otherAnswer.style.opacity = '0';
          }
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
      }
    });
  });
}

