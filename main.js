/**
 * NOIR BARBER • Luxury Editorial Interactions & Audio Synthesizer
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. Custom Luxury Cursor
  // -------------------------------------------------------------
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const renderFollower = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(renderFollower);
    };
    requestAnimationFrame(renderFollower);

    // Hover triggers
    const interactiveElements = document.querySelectorAll('a, button, .service-row, .gallery-item, input');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // -------------------------------------------------------------
  // 2. Header Compact Mode on Scroll
  // -------------------------------------------------------------
  const header = document.getElementById('mainHeader');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('header-compact');
      } else {
        header.classList.remove('header-compact');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // -------------------------------------------------------------
  // 3. Mobile Navigation Menu
  // -------------------------------------------------------------
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIconOpen = menuToggleBtn?.querySelector('.menu-icon-open');
  const menuIconClose = menuToggleBtn?.querySelector('.menu-icon-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  let isMenuOpen = false;

  const toggleMobileMenu = (forceState) => {
    isMenuOpen = forceState !== undefined ? forceState : !isMenuOpen;

    if (isMenuOpen) {
      mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
      mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
      menuIconOpen?.classList.add('hidden');
      menuIconClose?.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      menuToggleBtn?.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('opacity-0', 'pointer-events-none');
      mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
      menuIconOpen?.classList.remove('hidden');
      menuIconClose?.classList.add('hidden');
      document.body.style.overflow = '';
      menuToggleBtn?.setAttribute('aria-expanded', 'false');
    }
  };

  menuToggleBtn?.addEventListener('click', () => toggleMobileMenu());
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // -------------------------------------------------------------
  // 4. Services List: Floating Image Preview on Hover
  // -------------------------------------------------------------
  const serviceRows = document.querySelectorAll('.service-row');
  const hoverPreview = document.getElementById('serviceHoverImage');
  const hoverImg = hoverPreview?.querySelector('img');

  if (hoverPreview && hoverImg && window.matchMedia('(min-width: 768px)').matches) {
    let previewX = 0;
    let previewY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovering = false;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX + 30;
      targetY = e.clientY - 90;
    });

    const updatePreviewPosition = () => {
      previewX += (targetX - previewX) * 0.15;
      previewY += (targetY - previewY) * 0.15;
      const scale = isHovering ? 1 : 0.92;
      hoverPreview.style.transform = `translate3d(${previewX}px, ${previewY}px, 0) scale(${scale})`;
      requestAnimationFrame(updatePreviewPosition);
    };
    requestAnimationFrame(updatePreviewPosition);

    serviceRows.forEach((row) => {
      row.addEventListener('mouseenter', () => {
        const imgSrc = row.getAttribute('data-image');
        if (imgSrc) {
          hoverImg.src = imgSrc;
          isHovering = true;
          hoverPreview.classList.add('active');
        }
      });

      row.addEventListener('mouseleave', () => {
        isHovering = false;
        hoverPreview.classList.remove('active');
      });
    });
  }

  // -------------------------------------------------------------
  // 5. Works Gallery: Lightbox Modal
  // -------------------------------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxTag = document.getElementById('lightboxTag');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  let currentGalleryIndex = 0;
  const galleryData = Array.from(galleryItems).map((item) => ({
    src: item.getAttribute('data-src') || '',
    title: item.getAttribute('data-title') || '',
    tag: item.getAttribute('data-tag') || ''
  }));

  const updateLightboxContent = (index) => {
    if (!galleryData[index]) return;
    currentGalleryIndex = index;
    const data = galleryData[index];
    lightboxImg.src = data.src;
    lightboxTitle.textContent = data.title;
    lightboxTag.textContent = data.tag;
  };

  const openLightbox = (index) => {
    updateLightboxContent(index);
    lightbox.classList.remove('opacity-0', 'pointer-events-none');
    lightbox.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.add('opacity-0', 'pointer-events-none');
    lightbox.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  closeLightboxBtn?.addEventListener('click', closeLightbox);
  lightboxPrevBtn?.addEventListener('click', () => {
    const prevIdx = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent(prevIdx);
  });
  lightboxNextBtn?.addEventListener('click', () => {
    const nextIdx = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent(nextIdx);
  });

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('pointer-events-auto')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrevBtn?.click();
    if (e.key === 'ArrowRight') lightboxNextBtn?.click();
  });

  // -------------------------------------------------------------
  // 6. Interior Slider: Drag & Button Controls
  // -------------------------------------------------------------
  const slider = document.getElementById('interiorSlider');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');

  if (slider) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });

    prevBtn?.addEventListener('click', () => {
      slider.scrollBy({ left: -window.innerWidth * 0.45, behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
      slider.scrollBy({ left: window.innerWidth * 0.45, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------
  // 7. Scroll Reveal Animation (Intersection Observer)
  // -------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach((el, index) => {
      // Stagger slightly if in the same group
      el.style.transitionDelay = `${(index % 3) * 0.12}s`;
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // -------------------------------------------------------------
  // 8. Google Maps Modal Logic
  // -------------------------------------------------------------
  const openMapBtn = document.getElementById('openMapModalBtn');
  const mapModal = document.getElementById('mapModal');
  const closeMapBtn = document.getElementById('closeMapModalBtn');

  const openMap = () => {
    mapModal?.classList.remove('opacity-0', 'pointer-events-none');
    mapModal?.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  };

  const closeMap = () => {
    mapModal?.classList.add('opacity-0', 'pointer-events-none');
    mapModal?.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = '';
  };

  openMapBtn?.addEventListener('click', openMap);
  closeMapBtn?.addEventListener('click', closeMap);
  mapModal?.addEventListener('click', (e) => {
    if (e.target === mapModal) closeMap();
  });

  // -------------------------------------------------------------
  // 9. Ambient Audio Synthesizer (Warm Lounge Room Ambiance)
  // -------------------------------------------------------------
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundLabel = document.getElementById('soundLabel');
  const soundContainer = document.querySelector('.ambient-sound-toggle');

  let audioCtx = null;
  let isSoundPlaying = false;
  let gainNode = null;
  let noiseNode = null;
  let chordOscillators = [];

  const startAmbientAudio = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Master Gain for smooth fade in
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 2.5); // Very delicate volume
    gainNode.connect(audioCtx.destination);

    // Filter for warm dark vinyl tone
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);
    filter.connect(gainNode);

    // Warm subtle chords (F# minor / Dmaj7 lounge tones)
    const freqs = [146.83, 185.00, 220.00, 277.18]; // D3, F#3, A3, C#4
    chordOscillators = freqs.map((freq, idx) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.8, audioCtx.currentTime);
      
      const oscGain = audioCtx.createGain();
      oscGain.gain.setValueAtTime(0.25, audioCtx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      return osc;
    });

    // Gentle vinyl-like warm noise texture
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.015;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1000;
    noiseFilter.Q.value = 0.5;

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(gainNode);
    noiseNode.start();

    isSoundPlaying = true;
    soundContainer?.classList.add('ambient-playing');
    if (soundLabel) soundLabel.textContent = 'Звук простору: Увімк';
  };

  const stopAmbientAudio = () => {
    if (gainNode && audioCtx) {
      gainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
      setTimeout(() => {
        chordOscillators.forEach((osc) => osc.stop());
        chordOscillators = [];
        if (noiseNode) {
          noiseNode.stop();
          noiseNode = null;
        }
      }, 1000);
    }
    isSoundPlaying = false;
    soundContainer?.classList.remove('ambient-playing');
    if (soundLabel) soundLabel.textContent = 'Звук простору: Вимк';
  };

  soundToggleBtn?.addEventListener('click', () => {
    if (isSoundPlaying) {
      stopAmbientAudio();
    } else {
      startAmbientAudio();
    }
  });

  // -------------------------------------------------------------
  // 10. Magnetic Button Hover Micro-interactions
  // -------------------------------------------------------------
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  if (window.matchMedia('(pointer: fine)').matches) {
    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }
});
