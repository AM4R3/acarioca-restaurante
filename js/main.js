document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav__link');
  const body = document.body;

  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      navbar.classList.toggle('active');
      body.classList.toggle('no-scroll');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbar.classList.contains('active')) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.classList.remove('active');
          navbar.classList.remove('active');
          body.classList.remove('no-scroll');
        }
      });
    });
  }

  // 2. Header Scroll Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // 3. Active Navigation Link
  const sections = document.querySelectorAll('section[id]');
  const setActiveLink = () => {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav__link[href*="#${sectionId}"]`);
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  };
  window.addEventListener('scroll', setActiveLink);
  // Initial check on load
  setActiveLink();

  // 4. Smooth Scrolling
  const headerOffset = 80;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 5. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) {
        return;
      }
      setTimeout(() => {
        entry.target.classList.add('active');
      }, index * 100); // Staggered delay for elements revealed together
      observer.unobserve(entry.target);
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // 6. Menu Category Filter
  const menuTabs = document.querySelectorAll('.menu__tab');
  const menuCards = document.querySelectorAll('.menu__card');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      menuTabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked
      tab.classList.add('active');

      const targetCategory = tab.dataset.category;

      menuCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        // Add simple fade out by manipulating style
        card.style.transition = 'opacity 0.3s ease';
        card.style.opacity = '0';
        
        setTimeout(() => {
          if (targetCategory === 'all' || cardCategory === targetCategory) {
            card.classList.remove('hidden');
            setTimeout(() => { card.style.opacity = '1'; }, 50); // Fade in
          } else {
            card.classList.add('hidden');
          }
        }, 300); // Wait for fade out to complete before display:none
      });
    });
  });

  // 7. Testimonials Carousel
  const track = document.getElementById('testimonials-track');
  const cards = document.querySelectorAll('.testimonial__card');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dotsContainer = document.getElementById('testimonial-dots');
  
  if (track && cards.length > 0) {
    let currentIndex = 0;
    let cardsPerView = window.innerWidth >= 768 ? 2 : 1;
    let autoPlayInterval;

    const setupCarousel = () => {
      cardsPerView = window.innerWidth >= 768 ? 2 : 1;
      // Recreate dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        const numDots = Math.ceil(cards.length / cardsPerView);
        for (let i = 0; i < numDots; i++) {
          const dot = document.createElement('div');
          dot.classList.add('testimonial__dot');
          if (i === 0) dot.classList.add('active');
          dot.addEventListener('click', () => goToSlide(i * cardsPerView));
          dotsContainer.appendChild(dot);
        }
      }
      updateCarousel();
    };

    const updateCarousel = () => {
      const cardWidth = 100 / cardsPerView;
      cards.forEach(card => {
        card.style.flex = `0 0 ${cardWidth}%`;
        card.style.maxWidth = `${cardWidth}%`;
      });
      
      const maxIndex = cards.length - cardsPerView;
      if (currentIndex > maxIndex) currentIndex = Math.max(0, maxIndex);

      track.style.transform = `translateX(-${currentIndex * cardWidth}%)`;
      track.style.transition = 'transform 0.5s ease-in-out';

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.testimonial__dot');
        const activeDotIndex = Math.floor(currentIndex / cardsPerView);
        dots.forEach((dot, index) => {
          if (index === activeDotIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    };

    const goToSlide = (index) => {
      const maxIndex = cards.length - cardsPerView;
      if (index < 0) {
        currentIndex = maxIndex;
      } else if (index > maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateCarousel();
    };

    const nextSlide = () => goToSlide(currentIndex + cardsPerView);
    const prevSlide = () => goToSlide(currentIndex - cardsPerView);

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Autoplay
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    };
    const stopAutoPlay = () => {
      clearInterval(autoPlayInterval);
    };

    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Listen to resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupCarousel, 250);
    });

    setupCarousel();
    startAutoPlay();
  }

  // 8. Gallery Lightbox
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let currentGalleryIndex = 0;
  
  if (lightbox && lightboxImg) {
    const openLightbox = (index) => {
      currentGalleryIndex = index;
      const img = galleryItems[index].querySelector('img');
      if (img) {
        let src = img.getAttribute('src');
        // Increase resolution if URL has width/height params
        if (src) {
           src = src.replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=1200');
        }
        lightboxImg.setAttribute('src', src);
        lightbox.classList.add('active');
        body.classList.add('no-scroll');
      }
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      body.classList.remove('no-scroll');
    };

    const nextLightboxImg = (e) => {
      if(e) e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
      openLightbox(currentGalleryIndex);
    };

    const prevLightboxImg = (e) => {
      if(e) e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(currentGalleryIndex);
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextLightboxImg);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightboxImg);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxImg();
      if (e.key === 'ArrowLeft') prevLightboxImg();
    });
  }

  // 9. Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Obrigado por se inscrever! (Thank you for subscribing!)');
      newsletterForm.reset();
    });
  }

  // 10. WhatsApp Float Visibility
  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    // Initial hidden state if not handled via CSS
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.visibility = 'hidden';
    whatsappFloat.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        whatsappFloat.style.opacity = '1';
        whatsappFloat.style.visibility = 'visible';
      } else {
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.visibility = 'hidden';
      }
    });
  }

});
