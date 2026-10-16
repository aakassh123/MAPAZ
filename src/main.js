import './style.css';
import { Hotel3DScene } from './hotel3d.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Hero Sunset Scene with Subtle Cinematic Parallax
  setupHeroSunsetScene();

  // 2. Setup Our Story Heritage Modal
  setupOurStoryModal();

  // 3. Setup Booking System & Modals
  setupBookingSystem();

  // 4. Setup Room Details Modal
  setupRoomDetails();

  // 4b. Setup 3D Sanctuary Atelier Showcase (5 Suites)
  setupRoomsStageShowcase();

  // 4b2. Setup 3D Curated Experiences Atelier Showcase (5 Bespoke Journeys)
  setupExperiencesStageShowcase();

  // 4c. Setup 3D Haute Cuisine Horizon Showcase (5 Signature Dishes)
  setupDiningStageShowcase();

  // 4d. Setup 3D Layer-by-Layer Celebration Deck (Banquet Section)
  setupBanquetLayerDeck();

  // 5. Setup Banquet & Event Modal
  setupEventModal();

  // 6. Setup Dining Menu & Table Reservation
  setupDiningMenu();

  // 7. Setup Gallery Filters & Lightbox
  setupGallery();

  // 8. Setup Mobile Nav & Header Scroll
  setupNavigation();

  // 9. Setup Cinematic Section Scroll Animations (Fade & float up on scroll away, reappear on scroll down)
  setupSectionScrollAnimations();

  // 10. Setup Interactive 3D Architecture & Virtual Tour Modal
  setupHotel3DVirtualTour();

  // 11. Setup Multi-Currency Engine (INR, USD, EUR, AED, GBP)
  setupMultiCurrency();

  // 12. Setup Curated VIP Experiences & Inquiry Desk
  setupCuratedExperiences();

  // 13. Setup Royal Celebration Planner
  setupRoyalCelebrationPlanner();
});

/* ==========================================================================
   HERO SUNSET SCENE & CINEMATIC DEPTH PARALLAX
   ========================================================================== */
function setupHeroSunsetScene() {
  const heroSection = document.getElementById('hero');
  const bgImg = document.getElementById('hero-sunset-bg-img');
  if (!heroSection || !bgImg) return;

  // Subtle mouse movement depth on desktop
  let isMoving = false;
  heroSection.addEventListener(
    'mousemove',
    (e) => {
      if (window.innerWidth < 1024 || isMoving) return;
      isMoving = true;
      window.requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        const moveX = (normX * -18).toFixed(2);
        const moveY = (normY * -14).toFixed(2);

        bgImg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.035)`;
        isMoving = false;
      });
    },
    { passive: true }
  );

  heroSection.addEventListener('mouseleave', () => {
    bgImg.style.transform = 'translate3d(0, 0, 0) scale(1.01)';
  });
}

/* ==========================================================================
   OUR STORY HERITAGE MODAL
   ========================================================================== */
function setupOurStoryModal() {
  const btnStory = document.getElementById('btn-hero-story');
  const storyModal = document.getElementById('story-modal');
  const storyClose = document.getElementById('story-modal-close');
  const btnStoryRooms = document.getElementById('btn-story-rooms');
  const btnStoryDining = document.getElementById('btn-story-dining');

  if (!storyModal) return;

  const openStory = () => {
    storyModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeStory = () => {
    storyModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (btnStory) {
    btnStory.addEventListener('click', (e) => {
      e.preventDefault();
      openStory();
    });
  }

  const btnOurStory = document.getElementById('btn-our-story');
  if (btnOurStory) {
    btnOurStory.addEventListener('click', (e) => {
      e.preventDefault();
      openStory();
    });
  }

  if (storyClose) {
    storyClose.addEventListener('click', closeStory);
  }

  // Backdrop click closes modal
  storyModal.addEventListener('click', (e) => {
    if (e.target === storyModal) {
      closeStory();
    }
  });

  // Action links inside modal
  if (btnStoryRooms) {
    btnStoryRooms.addEventListener('click', () => {
      closeStory();
      const sec = document.getElementById('rooms');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnStoryDining) {
    btnStoryDining.addEventListener('click', () => {
      closeStory();
      const sec = document.getElementById('restaurant');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   BOOKING SYSTEM (Quick Strip & Full Modal)
   ========================================================================== */
const ROOM_PRICES = {
  deluxe: 3499,
  'super-deluxe': 4999,
  'skyline-suite': 5999,
  'maharaja-suite': 7999,
  'luxury-suite': 9999,
};

function setupBookingSystem() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (d) => d.toISOString().split('T')[0];

  // Initialize dates
  const quickCheckin = document.getElementById('book-checkin');
  const quickCheckout = document.getElementById('book-checkout');
  const modalCheckin = document.getElementById('modal-checkin');
  const modalCheckout = document.getElementById('modal-checkout');

  if (quickCheckin && quickCheckout) {
    quickCheckin.value = formatDate(today);
    quickCheckin.min = formatDate(today);
    quickCheckout.value = formatDate(tomorrow);
    quickCheckout.min = formatDate(tomorrow);
  }

  if (modalCheckin && modalCheckout) {
    modalCheckin.value = formatDate(today);
    modalCheckin.min = formatDate(today);
    modalCheckout.value = formatDate(tomorrow);
    modalCheckout.min = formatDate(tomorrow);
  }

  // Quick form submit -> Open modal with values pre-filled
  const quickForm = document.getElementById('quick-book-form');
  const bookingModal = document.getElementById('booking-modal');
  const bookingModalClose = document.getElementById('booking-modal-close');
  const btnOpenBookModal = document.getElementById('btn-open-book-modal');
  const btnFooterBook = document.getElementById('btn-footer-book');

  const openBookingModal = (roomType = 'super-deluxe') => {
    if (modalCheckin && quickCheckin) modalCheckin.value = quickCheckin.value;
    if (modalCheckout && quickCheckout) modalCheckout.value = quickCheckout.value;

    const modalRoomType = document.getElementById('modal-room-type');
    if (modalRoomType) modalRoomType.value = roomType;

    updatePriceCalculation();
    if (bookingModal) bookingModal.classList.add('open');
  };

  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const roomType = document.getElementById('book-room-type').value;
      openBookingModal(roomType);
    });
  }

  if (btnOpenBookModal) {
    btnOpenBookModal.addEventListener('click', () => openBookingModal());
  }

  const btnViewAllRooms = document.getElementById('btn-view-all-rooms');
  if (btnViewAllRooms) {
    btnViewAllRooms.addEventListener('click', () => openBookingModal());
  }

  if (btnFooterBook) {
    btnFooterBook.addEventListener('click', () => openBookingModal());
  }

  // Direct Book Buttons on Room Cards
  document.querySelectorAll('.btn-book-room-direct').forEach((btn) => {
    btn.addEventListener('click', () => {
      const roomType = btn.dataset.room || 'super-deluxe';
      openBookingModal(roomType);
    });
  });

  // VIP Concierge Guarantee button
  const btnRoomsInquireVip = document.getElementById('btn-rooms-inquire-vip');
  if (btnRoomsInquireVip) {
    btnRoomsInquireVip.addEventListener('click', () => {
      openBookingModal('luxury-suite');
    });
  }

  if (bookingModalClose && bookingModal) {
    bookingModalClose.addEventListener('click', () => bookingModal.classList.remove('open'));
  }

  // Close modals on clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('open');
    });
  });

  // Dynamic price calculation
  const modalRoomType = document.getElementById('modal-room-type');
  if (modalRoomType && modalCheckin && modalCheckout) {
    modalRoomType.addEventListener('change', updatePriceCalculation);
    modalCheckin.addEventListener('change', updatePriceCalculation);
    modalCheckout.addEventListener('change', updatePriceCalculation);
  }

  // Full reservation form submit
  const fullBookingForm = document.getElementById('full-booking-form');
  if (fullBookingForm) {
    fullBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-name').value;
      const roomSelect = document.getElementById('modal-room-type');
      const roomText = roomSelect.options[roomSelect.selectedIndex].text.split('(')[0].trim();
      const refId = 'MPZ-' + Math.floor(10000 + Math.random() * 90000);

      if (bookingModal) bookingModal.classList.remove('open');

      showToast(
        'Reservation Confirmed!',
        `Thank you ${name}! Ref: ${refId}. Your stay in ${roomText} is reserved.`
      );
      fullBookingForm.reset();
    });
  }
}

function updatePriceCalculation() {
  const modalCheckin = document.getElementById('modal-checkin');
  const modalCheckout = document.getElementById('modal-checkout');
  const modalRoomType = document.getElementById('modal-room-type');

  if (!modalCheckin || !modalCheckout || !modalRoomType) return;

  const d1 = new Date(modalCheckin.value);
  const d2 = new Date(modalCheckout.value);
  let nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
  if (isNaN(nights) || nights < 1) nights = 1;

  const roomKey = modalRoomType.value;
  const pricePerNight = ROOM_PRICES[roomKey] || 4999;
  const basePrice = pricePerNight * nights;
  const tax = Math.round(basePrice * 0.12);
  const total = basePrice + tax;

  const nightsEl = document.getElementById('calc-nights');
  const baseEl = document.getElementById('calc-base-price');
  const taxEl = document.getElementById('calc-tax');
  const totalEl = document.getElementById('calc-total');

  if (nightsEl) nightsEl.textContent = nights;
  if (baseEl) baseEl.textContent = formatCurrency(basePrice);
  if (taxEl) taxEl.textContent = formatCurrency(tax);
  if (totalEl) totalEl.textContent = formatCurrency(total);
}

/* ==========================================================================
   ROOM DETAILS MODAL
   ========================================================================== */
const ROOM_DATA = {
  deluxe: {
    title: 'Grand Deluxe Haven',
    price: '₹3,499 / night',
    desc: 'Curated with a bespoke emerald green leather headboard, warm ambient backlighting, botanical art prints, light oak herringbone parquet flooring, Italian Calacatta rain shower, and espresso bar.',
    img: '/images/deluxe-room.jpg',
    specs: [
      { label: 'Bed Type', val: 'Emerald King Bed' },
      { label: 'Occupancy', val: '2 Guests' },
      { label: 'Room Area', val: '300 sq. ft' },
      { label: 'Privilege', val: 'Champagne Breakfast' },
    ],
  },
  'super-deluxe': {
    title: 'Super Deluxe Executive Sanctuary',
    price: '₹4,999 / night',
    desc: 'Master residence featuring a sleek warm grey upholstered king bed, architectural floating tray ceiling with warm 3000K curved cove lighting, hanging Nordic brass dome pendants, and blackout drapery.',
    img: '/images/super-deluxe.jpg',
    specs: [
      { label: 'Bed Type', val: 'Grand King Bed' },
      { label: 'Occupancy', val: '2 - 3 Guests' },
      { label: 'Room Area', val: '400 sq. ft' },
      { label: 'Privilege', val: 'VIP Lounge & Butler' },
    ],
  },
  'skyline-suite': {
    title: 'Executive Skyline Corner Suite',
    price: '₹5,999 / night',
    desc: 'Spacious corner residence with an integrated living salon featuring a light grey sofa, black oval marble coffee table, blonde wood executive work desk, flat-screen smart TV, and herringbone oak floors.',
    img: '/images/executive-skyline.jpg',
    specs: [
      { label: 'Bed Type', val: 'Master Imperial King' },
      { label: 'Occupancy', val: '2 - 3 Guests' },
      { label: 'Room Area', val: '480 sq. ft' },
      { label: 'Privilege', val: 'Living Salon & Valet' },
    ],
  },
  'maharaja-suite': {
    title: 'Royal Heritage Maharaja Suite',
    price: '₹7,999 / night',
    desc: 'Imperial Awadhi residence boasting a grand king bed with emerald leather & brass cane wing headboard, hanging brass lantern pendants, golden cove tray ceiling, and dedicated khansama dining.',
    img: '/images/maharaja-suite.jpg',
    specs: [
      { label: 'Bed Type', val: 'Emperor Royal King' },
      { label: 'Occupancy', val: '2 - 4 Guests' },
      { label: 'Room Area', val: '620 sq. ft' },
      { label: 'Privilege', val: 'Royal Butler & Khansama' },
    ],
  },
  'luxury-suite': {
    title: 'The Presidential Crown Penthouse',
    price: '₹9,999 / night',
    desc: 'The crown penthouse residence featuring an expansive master bedroom with integrated living salon, blonde wood atelier desk, floor-to-ceiling sunset panoramic glass windows, and 24/7 dedicated senior butler care.',
    img: '/images/luxury-suite.jpg',
    specs: [
      { label: 'Bed Type', val: 'Emperor King Bed' },
      { label: 'Occupancy', val: '2 - 4 Guests' },
      { label: 'Room Area', val: '750+ sq. ft' },
      { label: 'Privilege', val: 'Dom Pérignon & Butler' },
    ],
  },
};

function setupRoomDetails() {
  const roomModal = document.getElementById('room-details-modal');
  const roomModalClose = document.getElementById('room-modal-close');
  const btnDetailList = document.querySelectorAll('.btn-room-detail');
  let selectedRoomKey = 'super-deluxe';

  btnDetailList.forEach((btn) => {
    btn.addEventListener('click', () => {
      const roomKey = btn.dataset.room || 'deluxe';
      selectedRoomKey = roomKey;
      const data = ROOM_DATA[roomKey];
      if (!data) return;

      const titleEl = document.getElementById('detail-room-title');
      const descEl = document.getElementById('detail-room-desc');
      const imgEl = document.getElementById('detail-room-img');
      const priceEl = document.getElementById('detail-room-price');
      const specsContainer = document.getElementById('detail-room-specs');

      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (imgEl) imgEl.src = data.img;
      if (priceEl) priceEl.textContent = data.price;

      if (specsContainer) {
        specsContainer.innerHTML = data.specs
          .map(
            (s) => `
          <div class="spec-cell">
            <strong>${s.val}</strong>
            <span>${s.label}</span>
          </div>
        `
          )
          .join('');
      }

      if (roomModal) roomModal.classList.add('open');
    });
  });

  if (roomModalClose && roomModal) {
    roomModalClose.addEventListener('click', () => roomModal.classList.remove('open'));
  }

  // Book from details modal
  const btnBookFromModal = document.getElementById('btn-room-modal-book');
  if (btnBookFromModal) {
    btnBookFromModal.addEventListener('click', () => {
      if (roomModal) roomModal.classList.remove('open');
      const bookingModal = document.getElementById('booking-modal');
      const modalRoomType = document.getElementById('modal-room-type');
      if (modalRoomType) modalRoomType.value = selectedRoomKey;
      updatePriceCalculation();
      if (bookingModal) bookingModal.classList.add('open');
    });
  }

  // "View All Rooms" button scrolls to rooms section smoothly
  const btnViewAll = document.getElementById('btn-view-all-rooms');
  if (btnViewAll) {
    btnViewAll.addEventListener('click', () => {
      const roomsSec = document.getElementById('rooms');
      if (roomsSec) roomsSec.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   3D SANCTUARY ATELIER SUITES SHOWCASE
   3D Horizon Spatial Carousel with Full-Bleed Photos, Floating Tariff Badges,
   Sculpted Inward Arch Feature Overlays, and Floating Booking Deck.
   Suites:
   0: Grand Deluxe Haven (deluxe)
   1: Super Deluxe Sanctuary (super-deluxe)
   2: Executive Skyline Suite (skyline-suite)
   3: Royal Maharaja Suite (maharaja-suite)
   4: The Crown Penthouse (luxury-suite)
   ========================================================================== */
function setupRoomsStageShowcase() {
  const track = document.getElementById('rooms-stage-track');
  const viewport = document.getElementById('rooms-stage-viewport');
  if (!track || !viewport) return;

  const cards = Array.from(track.querySelectorAll('.room-stage-card'));
  const tabs = Array.from(document.querySelectorAll('#rooms-step-tabs .rooms-step-tab'));
  const btnPrev = document.getElementById('btn-rooms-prev');
  const btnNext = document.getElementById('btn-rooms-next');
  const counterDisplay = document.getElementById('rooms-current-num');
  const progressFill = document.getElementById('rooms-progress-fill');
  const btnAutoPlayToggle = document.getElementById('btn-rooms-autoplay-toggle');
  const playIcon = document.getElementById('rooms-play-icon');
  const playText = document.getElementById('rooms-play-text');

  if (cards.length === 0) return;

  let currentIndex = 0;
  let isAutoPlayActive = true;
  let autoPlayTimer = null;
  const AUTOPLAY_DURATION = 5000; // 5 seconds per suite

  const restartProgressBar = () => {
    if (!progressFill) return;
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';

    if (isAutoPlayActive) {
      void progressFill.offsetWidth; // force layout reflow
      progressFill.style.transition = `width ${AUTOPLAY_DURATION}ms linear`;
      progressFill.style.width = '100%';
    }
  };

  const pauseProgressBar = () => {
    if (!progressFill) return;
    const computedWidth = window.getComputedStyle(progressFill).width;
    progressFill.style.transition = 'none';
    progressFill.style.width = computedWidth;
  };

  const updateStage = (newIndex) => {
    currentIndex = (newIndex + cards.length) % cards.length;

    // Reset entrance animation state
    cards.forEach((card) => {
      card.classList.remove('features-entered');
    });

    // 3D spatial layout
    cards.forEach((card, i) => {
      card.classList.remove('pos-center', 'pos-next', 'pos-prev', 'pos-right', 'pos-left', 'pos-far-next', 'pos-far-right', 'pos-far-left');
      const offset = (i - currentIndex + cards.length) % cards.length;

      if (offset === 0) {
        card.classList.add('pos-center');
        card.setAttribute('aria-hidden', 'false');

        // Staggered arrival of side feature boxes
        setTimeout(() => {
          if (card.classList.contains('pos-center')) {
            card.classList.add('features-entered');
          }
        }, 280);
      } else if (offset === 1) {
        card.classList.add('pos-next', 'pos-right');
        card.setAttribute('aria-hidden', 'true');
      } else if (offset === cards.length - 1) {
        card.classList.add('pos-prev', 'pos-left');
        card.setAttribute('aria-hidden', 'true');
      } else if (offset === 2) {
        card.classList.add('pos-far-next', 'pos-far-right');
        card.setAttribute('aria-hidden', 'true');
      } else {
        card.classList.add('pos-far-left');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    // Sync tabs
    tabs.forEach((tab) => {
      const idx = parseInt(tab.dataset.index, 10);
      if (idx === currentIndex) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // Counter display
    if (counterDisplay) {
      counterDisplay.textContent = `0${currentIndex + 1}`;
    }

    restartProgressBar();
  };

  const nextSuite = () => updateStage(currentIndex + 1);
  const prevSuite = () => updateStage(currentIndex - 1);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (isAutoPlayActive) {
      restartProgressBar();
      autoPlayTimer = setInterval(nextSuite, AUTOPLAY_DURATION);
    }
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
    pauseProgressBar();
  };

  // Click on cards to bring them to center
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.room-floating-deck') || e.target.closest('.btn')) {
        return; // allow buttons to perform direct actions
      }
      if (idx !== currentIndex) {
        updateStage(idx);
        startAutoPlay();
      }
    });
  });

  // Tab clicks
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index, 10);
      if (!isNaN(idx)) {
        updateStage(idx);
        startAutoPlay();
      }
    });
  });

  // Controls
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      nextSuite();
      startAutoPlay();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      prevSuite();
      startAutoPlay();
    });
  }

  // Toggle Auto-Tour
  if (btnAutoPlayToggle) {
    btnAutoPlayToggle.addEventListener('click', () => {
      isAutoPlayActive = !isAutoPlayActive;
      if (isAutoPlayActive) {
        if (playIcon) playIcon.textContent = '⏸';
        if (playText) playText.textContent = 'Auto-Tour';
        btnAutoPlayToggle.classList.remove('paused');
        startAutoPlay();
      } else {
        if (playIcon) playIcon.textContent = '▶';
        if (playText) playText.textContent = 'Paused';
        btnAutoPlayToggle.classList.add('paused');
        stopAutoPlay();
      }
    });
  }

  // Hover pause
  viewport.addEventListener('mouseenter', () => {
    if (isAutoPlayActive && autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
      pauseProgressBar();
    }
  });

  viewport.addEventListener('mouseleave', () => {
    if (isAutoPlayActive) {
      startAutoPlay();
    }
  });

  // Touch Swipe on mobile
  let touchStartX = 0;
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextSuite();
      else prevSuite();
      startAutoPlay();
    }
  }, { passive: true });

  // Keyboard navigation
  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSuite();
      startAutoPlay();
    } else if (e.key === 'ArrowLeft') {
      prevSuite();
      startAutoPlay();
    }
  });

  // Re-hook direct booking and details buttons inside the floating decks
  document.querySelectorAll('.room-floating-deck .btn-book-room-direct').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const roomType = btn.dataset.room || 'super-deluxe';
      const bookingModal = document.getElementById('booking-modal');
      const roomSelect = document.getElementById('booking-room-type');
      if (roomSelect) {
        roomSelect.value = roomType;
      }
      if (bookingModal) {
        bookingModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelectorAll('.room-floating-deck .btn-room-detail').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const roomType = btn.dataset.room || 'deluxe';
      const detailModal = document.getElementById('room-detail-modal');
      if (detailModal) {
        // Trigger specs modal
        const specsTabBtn = document.querySelector(`.room-spec-tab[data-room="${roomType}"]`);
        if (specsTabBtn) specsTabBtn.click();
        detailModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Kick off initial stage
  updateStage(0);
  startAutoPlay();
}

/* ==========================================================================
   3D CURATED EXPERIENCES ATELIER SHOWCASE (5 BESPOKE JOURNEYS)
   0: Aviation & Maybach Fleet (exp-card-0)
   1: VIP Gorakhnath Temple Darshan (exp-card-1)
   2: Ramgarh Tal Sunset Yacht (exp-card-2)
   3: Historic Kushinagar Expedition (exp-card-3)
   4: In-Suite Royal Ayurvedic Spa (exp-card-4)
   ========================================================================== */
function setupExperiencesStageShowcase() {
  const track = document.getElementById('exp-stage-track');
  const viewport = document.getElementById('exp-stage-viewport');
  if (!track || !viewport) return;

  const cards = Array.from(track.querySelectorAll('.exp-stage-card'));
  const tabs = Array.from(document.querySelectorAll('#exp-step-tabs .rooms-step-tab'));
  const btnPrev = document.getElementById('btn-exp-prev');
  const btnNext = document.getElementById('btn-exp-next');
  const counterDisplay = document.getElementById('exp-current-num');
  const progressFill = document.getElementById('exp-progress-fill');
  const btnAutoPlayToggle = document.getElementById('btn-exp-autoplay-toggle');
  const playIcon = document.getElementById('exp-play-icon');
  const playText = document.getElementById('exp-play-text');

  if (cards.length === 0) return;

  let currentIndex = 0;
  let isAutoPlayActive = true;
  let autoPlayTimer = null;
  const AUTOPLAY_DURATION = 5000; // 5 seconds per experience

  const restartProgressBar = () => {
    if (!progressFill) return;
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';

    if (isAutoPlayActive) {
      void progressFill.offsetWidth;
      progressFill.style.transition = `width ${AUTOPLAY_DURATION}ms linear`;
      progressFill.style.width = '100%';
    }
  };

  const pauseProgressBar = () => {
    if (!progressFill) return;
    const computedWidth = window.getComputedStyle(progressFill).width;
    progressFill.style.transition = 'none';
    progressFill.style.width = computedWidth;
  };

  const updateStage = (newIndex) => {
    currentIndex = (newIndex + cards.length) % cards.length;

    cards.forEach((card) => {
      card.classList.remove('features-entered');
    });

    cards.forEach((card, i) => {
      card.classList.remove('pos-center', 'pos-next', 'pos-prev', 'pos-right', 'pos-left', 'pos-far-next', 'pos-far-right', 'pos-far-left');
      const offset = (i - currentIndex + cards.length) % cards.length;

      if (offset === 0) {
        card.classList.add('pos-center');
        card.setAttribute('aria-hidden', 'false');

        setTimeout(() => {
          if (card.classList.contains('pos-center')) {
            card.classList.add('features-entered');
          }
        }, 280);
      } else if (offset === 1) {
        card.classList.add('pos-next', 'pos-right');
        card.setAttribute('aria-hidden', 'true');
      } else if (offset === cards.length - 1) {
        card.classList.add('pos-prev', 'pos-left');
        card.setAttribute('aria-hidden', 'true');
      } else if (offset === 2) {
        card.classList.add('pos-far-next', 'pos-far-right');
        card.setAttribute('aria-hidden', 'true');
      } else {
        card.classList.add('pos-far-left');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    tabs.forEach((tab) => {
      const idx = parseInt(tab.dataset.index, 10);
      if (idx === currentIndex) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    if (counterDisplay) {
      counterDisplay.textContent = `0${currentIndex + 1}`;
    }

    restartProgressBar();
  };

  const nextExp = () => updateStage(currentIndex + 1);
  const prevExp = () => updateStage(currentIndex - 1);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (isAutoPlayActive) {
      restartProgressBar();
      autoPlayTimer = setInterval(nextExp, AUTOPLAY_DURATION);
    }
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
    pauseProgressBar();
  };

  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.room-floating-deck') || e.target.closest('.btn')) {
        return;
      }
      if (idx !== currentIndex) {
        updateStage(idx);
        startAutoPlay();
      }
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index, 10);
      if (!isNaN(idx)) {
        updateStage(idx);
        startAutoPlay();
      }
    });
  });

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      nextExp();
      startAutoPlay();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      prevExp();
      startAutoPlay();
    });
  }

  if (btnAutoPlayToggle) {
    btnAutoPlayToggle.addEventListener('click', () => {
      isAutoPlayActive = !isAutoPlayActive;
      if (isAutoPlayActive) {
        if (playIcon) playIcon.textContent = '⏸';
        if (playText) playText.textContent = 'Auto-Tour';
        btnAutoPlayToggle.classList.remove('paused');
        startAutoPlay();
      } else {
        if (playIcon) playIcon.textContent = '▶';
        if (playText) playText.textContent = 'Paused';
        btnAutoPlayToggle.classList.add('paused');
        stopAutoPlay();
      }
    });
  }

  viewport.addEventListener('mouseenter', () => {
    if (isAutoPlayActive && autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
      pauseProgressBar();
    }
  });

  viewport.addEventListener('mouseleave', () => {
    if (isAutoPlayActive) {
      startAutoPlay();
    }
  });

  let touchStartX = 0;
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextExp();
      else prevExp();
      startAutoPlay();
    }
  }, { passive: true });

  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextExp();
      startAutoPlay();
    } else if (e.key === 'ArrowLeft') {
      prevExp();
      startAutoPlay();
    }
  });

  // Direct Inquiry Button Handler on each Experience Card
  document.querySelectorAll('.exp-stage-card .btn-inquire-exp').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expTitle = btn.dataset.experience || 'VIP Concierge Experience';
      const eventModal = document.getElementById('event-modal');
      const eventNotes = document.getElementById('event-notes');
      const eventType = document.getElementById('event-type');

      if (eventNotes) {
        eventNotes.value = `Inquiring for: ${expTitle}. Please share custom itinerary details, luxury transfers, and concierge packages.`;
      }
      if (eventType) {
        eventType.value = 'corporate';
      }
      if (eventModal) {
        eventModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  updateStage(0);
  startAutoPlay();
}

/* ==========================================================================
   3D HAUTE CUISINE HORIZON SHOWCASE (5 SIGNATURE CREATIONS)
   0: Dum Pukht Awadhi Biryani Royale (dining-card-0)
   1: Galouti Kebab Nawabi Platter (dining-card-1)
   2: Chef's Pan-Seared Herb Lamb Chops (dining-card-2)
   3: Norwegian Grilled Salmon & Caviar (dining-card-3)
   4: Shahi Tukda Royale & Kesariya Rabdi (dining-card-4)
   ========================================================================== */
function setupDiningStageShowcase() {
  const track = document.getElementById('dining-stage-track');
  const viewport = document.getElementById('dining-stage-viewport');
  if (!track || !viewport) return;

  const cards = Array.from(track.querySelectorAll('.dining-stage-card'));
  const tabs = Array.from(document.querySelectorAll('#dining-step-tabs .rooms-step-tab'));
  const btnPrev = document.getElementById('btn-dining-prev');
  const btnNext = document.getElementById('btn-dining-next');
  const counterDisplay = document.getElementById('dining-current-num');
  const progressFill = document.getElementById('dining-progress-fill');
  const btnAutoPlayToggle = document.getElementById('btn-dining-autoplay-toggle');
  const playIcon = document.getElementById('dining-play-icon');
  const playText = document.getElementById('dining-play-text');

  if (cards.length === 0) return;

  let currentIndex = 0;
  let isAutoPlayActive = true;
  let autoPlayTimer = null;
  const AUTOPLAY_DURATION = 5000; // 5 seconds per dish

  const restartProgressBar = () => {
    if (!progressFill) return;
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';

    if (isAutoPlayActive) {
      void progressFill.offsetWidth;
      progressFill.style.transition = `width ${AUTOPLAY_DURATION}ms linear`;
      progressFill.style.width = '100%';
    }
  };

  const pauseProgressBar = () => {
    if (!progressFill) return;
    const computedWidth = window.getComputedStyle(progressFill).width;
    progressFill.style.transition = 'none';
    progressFill.style.width = computedWidth;
  };

  const updateStage = (newIndex) => {
    currentIndex = (newIndex + cards.length) % cards.length;

    cards.forEach((card) => {
      card.classList.remove('features-entered');
    });

    cards.forEach((card, i) => {
      card.classList.remove('pos-center', 'pos-next', 'pos-prev', 'pos-right', 'pos-left', 'pos-far-next', 'pos-far-right', 'pos-far-left');
      const offset = (i - currentIndex + cards.length) % cards.length;

      if (offset === 0) {
        card.classList.add('pos-center');
        card.setAttribute('aria-hidden', 'false');

        setTimeout(() => {
          if (card.classList.contains('pos-center')) {
            card.classList.add('features-entered');
          }
        }, 280);
      } else if (offset === 1) {
        card.classList.add('pos-next', 'pos-right');
        card.setAttribute('aria-hidden', 'true');
      } else if (offset === cards.length - 1) {
        card.classList.add('pos-prev', 'pos-left');
        card.setAttribute('aria-hidden', 'true');
      } else if (offset === 2) {
        card.classList.add('pos-far-next', 'pos-far-right');
        card.setAttribute('aria-hidden', 'true');
      } else {
        card.classList.add('pos-far-left');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    tabs.forEach((tab) => {
      const idx = parseInt(tab.dataset.index, 10);
      if (idx === currentIndex) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    if (counterDisplay) {
      counterDisplay.textContent = `0${currentIndex + 1}`;
    }

    restartProgressBar();
  };

  const nextDish = () => updateStage(currentIndex + 1);
  const prevDish = () => updateStage(currentIndex - 1);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (isAutoPlayActive) {
      restartProgressBar();
      autoPlayTimer = setInterval(nextDish, AUTOPLAY_DURATION);
    }
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
    pauseProgressBar();
  };

  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.room-floating-deck') || e.target.closest('.btn')) {
        return;
      }
      if (idx !== currentIndex) {
        updateStage(idx);
        startAutoPlay();
      }
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index, 10);
      if (!isNaN(idx)) {
        updateStage(idx);
        startAutoPlay();
      }
    });
  });

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      nextDish();
      startAutoPlay();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      prevDish();
      startAutoPlay();
    });
  }

  if (btnAutoPlayToggle) {
    btnAutoPlayToggle.addEventListener('click', () => {
      isAutoPlayActive = !isAutoPlayActive;
      if (isAutoPlayActive) {
        if (playIcon) playIcon.textContent = '⏸';
        if (playText) playText.textContent = 'Auto-Tour';
        btnAutoPlayToggle.classList.remove('paused');
        startAutoPlay();
      } else {
        if (playIcon) playIcon.textContent = '▶';
        if (playText) playText.textContent = 'Paused';
        btnAutoPlayToggle.classList.add('paused');
        stopAutoPlay();
      }
    });
  }

  viewport.addEventListener('mouseenter', () => {
    if (isAutoPlayActive && autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
      pauseProgressBar();
    }
  });

  viewport.addEventListener('mouseleave', () => {
    if (isAutoPlayActive) {
      startAutoPlay();
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    },
    { passive: true }
  );

  viewport.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextDish();
        } else {
          prevDish();
        }
      }
      if (isAutoPlayActive) startAutoPlay();
    },
    { passive: true }
  );

  document.addEventListener('keydown', (e) => {
    const diningSection = document.getElementById('restaurant');
    if (!diningSection) return;
    const rect = diningSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isVisible) return;

    if (e.key === 'ArrowRight') {
      nextDish();
      if (isAutoPlayActive) startAutoPlay();
    } else if (e.key === 'ArrowLeft') {
      prevDish();
      if (isAutoPlayActive) startAutoPlay();
    }
  });

  updateStage(0);
  startAutoPlay();
}

/* ==========================================================================
   3D LAYER-BY-LAYER BANQUET CELEBRATION DECK
   Layers:
   0: Grand Royale Imperial Ballroom (Floor & Mandap)
   1: Shahi Dawat Royal Khansama Feast (Live Gastronomy)
   2: The Summit Executive Ballroom (Corporate & 4K Tech)
   3: The Starlit Skyline Terrace (Poolside & Sangeet)
   ========================================================================== */
function setupBanquetLayerDeck() {
  const track = document.getElementById('banquet-stage-track');
  const viewport = document.getElementById('banquet-stage-viewport');
  if (!track || !viewport) return;

  const cards = Array.from(track.querySelectorAll('.banquet-stage-card'));
  const tabs = Array.from(document.querySelectorAll('#banquet-step-tabs .banquet-step-tab'));
  const btnPrev = document.getElementById('btn-banquet-prev');
  const btnNext = document.getElementById('btn-banquet-next');
  const counterDisplay = document.getElementById('banquet-current-num');
  const progressFill = document.getElementById('banquet-progress-fill');
  const btnAutoPlayToggle = document.getElementById('btn-banquet-autoplay-toggle');
  const playIcon = document.getElementById('banquet-play-icon');
  const playText = document.getElementById('banquet-play-text');

  if (cards.length === 0) return;

  let currentIndex = 0;
  let isAutoPlayActive = true;
  let autoPlayTimer = null;
  const AUTOPLAY_DURATION = 4500; // 4.5 seconds per transition

  // Reset and restart the CSS progress bar animation
  const restartProgressBar = () => {
    if (!progressFill) return;
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';

    if (isAutoPlayActive) {
      // Force layout reflow before triggering smooth progress transition
      void progressFill.offsetWidth;
      progressFill.style.transition = `width ${AUTOPLAY_DURATION}ms linear`;
      progressFill.style.width = '100%';
    }
  };

  const pauseProgressBar = () => {
    if (!progressFill) return;
    const computedWidth = window.getComputedStyle(progressFill).width;
    progressFill.style.transition = 'none';
    progressFill.style.width = computedWidth;
  };

  const updateStage = (newIndex) => {
    currentIndex = (newIndex + cards.length) % cards.length;

    // Reset feature entrance state on all cards so features wait outside the box
    cards.forEach((card) => {
      card.classList.remove('features-entered');
    });

    // Update 3D card physical spatial layout
    cards.forEach((card, i) => {
      card.classList.remove('pos-center', 'pos-next', 'pos-prev', 'pos-right', 'pos-left', 'pos-far-next', 'pos-far-right', 'pos-far-left');
      const offset = (i - currentIndex + cards.length) % cards.length;

      if (offset === 0) {
        card.classList.add('pos-center');
        card.setAttribute('aria-hidden', 'false');

        // Allow the card & photo to glide into center first,
        // then trigger the delayed entrance of side features from outside the box!
        setTimeout(() => {
          if (card.classList.contains('pos-center')) {
            card.classList.add('features-entered');
          }
        }, 280);
      } else if (offset === 1) {
        card.classList.add('pos-next', 'pos-right');
        card.setAttribute('aria-hidden', 'true');
      } else if (offset === cards.length - 1) {
        card.classList.add('pos-prev', 'pos-left');
        card.setAttribute('aria-hidden', 'true');
      } else if (offset === 2) {
        card.classList.add('pos-far-next', 'pos-far-right');
        card.setAttribute('aria-hidden', 'true');
      } else {
        card.classList.add('pos-far-left');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    // Update Top Step Tabs
    tabs.forEach((tab) => {
      const idx = parseInt(tab.dataset.index, 10);
      if (idx === currentIndex) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // Update Counter badge
    if (counterDisplay) {
      counterDisplay.textContent = `0${currentIndex + 1}`;
    }

    // Restart the smooth progress animation
    restartProgressBar();
  };

  const nextVenue = () => updateStage(currentIndex + 1);
  const prevVenue = () => updateStage(currentIndex - 1);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (isAutoPlayActive) {
      restartProgressBar();
      autoPlayTimer = setInterval(nextVenue, AUTOPLAY_DURATION);
    }
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  // Nav Arrow Buttons
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      nextVenue();
      startAutoPlay();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      prevVenue();
      startAutoPlay();
    });
  }

  // Step Tabs Click
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index, 10);
      if (!isNaN(idx)) {
        updateStage(idx);
        startAutoPlay();
      }
    });
  });

  // Clicking directly on side peek cards brings them immediately into center
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      const idx = parseInt(card.dataset.index, 10);
      if (!isNaN(idx) && idx !== currentIndex) {
        updateStage(idx);
        startAutoPlay();
      }
    });
  });

  // Auto-Play Toggle Button
  if (btnAutoPlayToggle) {
    btnAutoPlayToggle.addEventListener('click', () => {
      isAutoPlayActive = !isAutoPlayActive;
      if (isAutoPlayActive) {
        if (playIcon) playIcon.textContent = '⏸';
        if (playText) playText.textContent = 'Auto-Moving';
        startAutoPlay();
      } else {
        if (playIcon) playIcon.textContent = '▶';
        if (playText) playText.textContent = 'Paused (Play)';
        stopAutoPlay();
        pauseProgressBar();
      }
    });
  }

  // Hover on viewport pauses auto-move so user can comfortably inspect details or click
  viewport.addEventListener('mouseenter', () => {
    if (isAutoPlayActive) {
      stopAutoPlay();
      pauseProgressBar();
    }
  });

  viewport.addEventListener('mouseleave', () => {
    if (isAutoPlayActive) {
      startAutoPlay();
    }
  });

  // Mobile Touch Swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
      pauseProgressBar();
    },
    { passive: true }
  );

  viewport.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) nextVenue();
        else prevVenue();
      }
      if (isAutoPlayActive) {
        startAutoPlay();
      }
    },
    { passive: true }
  );

  // Initial State
  updateStage(0);
  startAutoPlay();
}

/* ==========================================================================
   BANQUET & EVENT PLANNING MODAL
   ========================================================================== */
function setupEventModal() {
  const eventModal = document.getElementById('event-modal');
  const eventModalClose = document.getElementById('event-modal-close');
  const btnBanquetPlan = document.getElementById('btn-banquet-plan');
  const eventForm = document.getElementById('event-inquiry-form');

  const openEventModalWithLayer = (layerTitle = '') => {
    if (eventModal) eventModal.classList.add('open');
    const notesEl = document.getElementById('event-notes');
    if (notesEl && layerTitle) {
      notesEl.value = `Inquiring for: ${layerTitle}. Please share customized floorplans and banquet packages.`;
    }
    const typeSelect = document.getElementById('event-type');
    if (typeSelect && layerTitle) {
      const lower = layerTitle.toLowerCase();
      if (lower.includes('wedding') || lower.includes('ballroom')) {
        typeSelect.value = 'wedding';
      } else if (lower.includes('catering') || lower.includes('dawat')) {
        typeSelect.value = 'reception';
      } else if (lower.includes('summit') || lower.includes('corporate')) {
        typeSelect.value = 'corporate';
      } else if (lower.includes('terrace') || lower.includes('sangeet')) {
        typeSelect.value = 'engagement';
      }
    }
  };

  if (btnBanquetPlan) btnBanquetPlan.addEventListener('click', () => openEventModalWithLayer('Grand Royal Celebration'));

  // Direct buttons on all celebration layers
  document.querySelectorAll('.btn-plan-layer').forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.layerTitle || 'Celebration Layer';
      openEventModalWithLayer(title);
    });
  });

  document.querySelectorAll('.btn-layer-quote').forEach((btn) => {
    btn.addEventListener('click', () => {
      const layerId = btn.dataset.layerId || 'banquet';
      openEventModalWithLayer(`Floorplan & Specifications (${layerId.toUpperCase()})`);
    });
  });

  if (eventModalClose && eventModal) {
    eventModalClose.addEventListener('click', () => eventModal.classList.remove('open'));
  }

  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('event-name').value;
      const typeSelect = document.getElementById('event-type');
      const eventText = typeSelect.options[typeSelect.selectedIndex].text;

      if (eventModal) eventModal.classList.remove('open');
      showToast(
        'Inquiry Submitted!',
        `Thank you ${name}. Our Royal Banquet Concierge will contact you shortly regarding your ${eventText}.`
      );
      eventForm.reset();
    });
  }
}

/* ==========================================================================
   FINE DINING MENU & TABLE RESERVATIONS
   ========================================================================== */
const MENU_DATA = {
  starters: [
    {
      name: 'Galouti Kebab Royale',
      price: '₹599',
      desc: 'Melt-in-mouth smoked lamb patties infused with 16 secret Awadhi spices, served on ulte tawe ka paratha.',
    },
    {
      name: 'Paneer Angara Tikka',
      price: '₹480',
      desc: 'Charcoal-grilled cottage cheese cubes marinated in Kashmiri chili, crushed coriander and royal saffron yogurt.',
    },
    {
      name: 'Truffle Golden Arancini',
      price: '₹520',
      desc: 'Crispy arborio risotto croquettes with wild forest mushrooms, melted bocconcini and gold leaf.',
    },
    {
      name: 'Crispy Calamari Peri Peri',
      price: '₹550',
      desc: 'Tender ocean calamari rings dusted in citrus peri-peri crumb, served with saffron aioli.',
    },
  ],
  royal: [
    {
      name: 'Dum Pukht Awadhi Biryani',
      price: '₹750',
      desc: 'Aromatic long-grain basmati sealed in clay pot with spring lamb, saffron broth, and silver leaf.',
    },
    {
      name: 'Dal MAPAZ Maharani',
      price: '₹490',
      desc: 'Slow-simmered black lentils cooked overnight for 24 hours with churned butter and hand-crushed tomatoes.',
    },
    {
      name: 'Murgh Begum Pasand',
      price: '₹680',
      desc: 'Succulent chicken breast braised in cashew almond velvety gravy scented with green cardamom.',
    },
    {
      name: 'Subz Nizami Handi',
      price: '₹520',
      desc: 'Seasonal organic farm vegetables tossed in a spiced onion-tomato gravy with toasted royal cumin.',
    },
  ],
  global: [
    {
      name: 'Chef’s Pan-Seared Lamb Chops',
      price: '₹950',
      desc: 'Herb-crusted lamb rack glazed with dark berry jus, rainbow heirloom carrots, and potato mousseline.',
    },
    {
      name: 'Norwegian Grilled Salmon',
      price: '₹1,050',
      desc: 'Wild salmon fillet served on bed of asparagus, lemon dill velouté, and caperberry crunch.',
    },
    {
      name: 'Handmade Truffle Tagliatelle',
      price: '₹690',
      desc: 'Fresh artisan ribbon pasta tossed in black truffle emulsion, 24-month aged Parmigiano Reggiano.',
    },
    {
      name: 'Artisan Wood-Fired Margherita',
      price: '₹560',
      desc: 'San Marzano tomato base, fresh buffalo mozzarella, hand-picked garden basil, extra virgin olive oil.',
    },
  ],
  desserts: [
    {
      name: 'Shahi Tukda Elegance',
      price: '₹380',
      desc: 'Gilded saffron brioche soaked in cardamom milk reduction, pistachio rabdi and pure 24k gold leaf.',
    },
    {
      name: 'Belgian Chocolate Fondant',
      price: '₹420',
      desc: 'Warm molten 70% dark chocolate center, served with house-churned Madagascar vanilla bean gelato.',
    },
    {
      name: 'Kesariya Rasmalai Cloud',
      price: '₹350',
      desc: 'Delicate cottage cheese discs floating in thickened saffron clotted cream with toasted almond flakes.',
    },
    {
      name: 'Royal Hibiscus & Rose Mocktail',
      price: '₹320',
      desc: 'Sparkling infusion of wild organic hibiscus flowers, Damascus rose essence, and lime foam.',
    },
  ],
};

function setupDiningMenu() {
  const menuModal = document.getElementById('menu-modal');
  const menuModalClose = document.getElementById('menu-modal-close');
  const btnViewMenu = document.getElementById('btn-view-menu');
  const tableModal = document.getElementById('table-modal');
  const tableModalClose = document.getElementById('table-modal-close');
  const btnReserveTable = document.getElementById('btn-reserve-table');
  const tableForm = document.getElementById('table-reserve-form');

  const menuContainer = document.getElementById('menu-items-container');
  const menuTabs = document.querySelectorAll('.menu-tab-btn');

  const renderMenu = (category) => {
    if (!menuContainer) return;
    const items = MENU_DATA[category] || MENU_DATA.royal;
    menuContainer.innerHTML = items
      .map(
        (item) => `
      <div class="menu-item-row">
        <div class="menu-item-info">
          <h5>${item.name}</h5>
          <p>${item.desc}</p>
        </div>
        <div class="menu-item-price">${item.price}</div>
      </div>
    `
      )
      .join('');
  };

  const openMenuModal = (category = 'royal') => {
    menuTabs.forEach((t) => {
      if (t.dataset.menucat === category) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
    renderMenu(category);
    if (menuModal) menuModal.classList.add('open');
  };

  const openTableModal = (dishName = '') => {
    if (menuModal) menuModal.classList.remove('open');
    if (tableModal) tableModal.classList.add('open');
    if (dishName) {
      showToast('Dining Reservation Desk', `Reserving an exclusive table for ${dishName}.`);
    }
  };

  menuTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      menuTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      renderMenu(tab.dataset.menucat);
    });
  });

  if (btnViewMenu) {
    btnViewMenu.addEventListener('click', () => {
      openMenuModal('starters');
    });
  }

  // Direct buttons on 3D culinary cards
  document.querySelectorAll('.btn-reserve-table-direct').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dish = btn.dataset.food || '';
      openTableModal(dish);
    });
  });

  document.querySelectorAll('.btn-food-menu-cat').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = btn.dataset.menucat || 'royal';
      openMenuModal(cat);
    });
  });

  const btnDiningReserveTable = document.getElementById('btn-dining-reserve-table');
  if (btnDiningReserveTable) {
    btnDiningReserveTable.addEventListener('click', () => openTableModal());
  }

  const btnDiningReserveChef = document.getElementById('btn-dining-reserve-chef-table');
  if (btnDiningReserveChef) {
    btnDiningReserveChef.addEventListener('click', () => {
      const seatingSelect = document.getElementById('table-seating');
      if (seatingSelect) seatingSelect.value = 'terrace';
      openTableModal("Chef's Tasting Degustation Table");
    });
  }

  // Dining cards click triggers
  const cardAmbience = document.getElementById('card-dining-ambience');
  const cardMenu = document.getElementById('card-dining-menu');
  const cardExp = document.getElementById('card-dining-experience');

  if (cardMenu) {
    cardMenu.addEventListener('click', () => {
      openMenuModal('royal');
    });
  }

  if (cardAmbience || cardExp) {
    [cardAmbience, cardExp].forEach((c) => {
      if (c) {
        c.addEventListener('click', () => {
          openTableModal();
        });
      }
    });
  }

  if (menuModalClose && menuModal) {
    menuModalClose.addEventListener('click', () => menuModal.classList.remove('open'));
  }

  // Table reservation
  if (btnReserveTable) {
    btnReserveTable.addEventListener('click', () => {
      if (menuModal) menuModal.classList.remove('open');
      if (tableModal) tableModal.classList.add('open');
    });
  }

  if (tableModalClose && tableModal) {
    tableModalClose.addEventListener('click', () => tableModal.classList.remove('open'));
  }

  if (tableForm) {
    const todayStr = new Date().toISOString().split('T')[0];
    const tableDate = document.getElementById('table-date');
    if (tableDate) {
      tableDate.value = todayStr;
      tableDate.min = todayStr;
    }

    tableForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('table-guest-name').value;
      const slot = document.getElementById('table-time').value;

      if (tableModal) tableModal.classList.remove('open');
      showToast(
        'Table Reserved!',
        `Thank you ${guestName}! Your dining table at MAPAZ Restaurant is booked for ${slot}.`
      );
      tableForm.reset();
    });
  }
}

/* ==========================================================================
   GALLERY & LIGHTBOX
   ========================================================================== */
function setupGallery() {
  const tabs = document.querySelectorAll('#gallery-filter-tabs .tab-btn');
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const visibleItems = () => Array.from(items).filter((i) => i.style.display !== 'none');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      items.forEach((item) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  const showLightbox = (index) => {
    const list = visibleItems();
    if (!list.length) return;
    currentGalleryIndex = (index + list.length) % list.length;
    const targetItem = list[currentGalleryIndex];
    const img = targetItem.querySelector('img');
    const h4 = targetItem.querySelector('h4');

    if (lightboxImg && img) lightboxImg.src = img.src;
    if (lightboxCaption && h4) lightboxCaption.textContent = h4.textContent;
    if (lightbox) lightbox.classList.add('open');
  };

  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      const list = visibleItems();
      const actualIdx = list.indexOf(item);
      showLightbox(actualIdx >= 0 ? actualIdx : 0);
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => showLightbox(currentGalleryIndex - 1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => showLightbox(currentGalleryIndex + 1));
  }

  // Full gallery button
  const btnFullGallery = document.getElementById('btn-full-gallery');
  if (btnFullGallery) {
    btnFullGallery.addEventListener('click', () => showLightbox(0));
  }
}

/* ==========================================================================
   NAVIGATION & UTILITIES
   ========================================================================== */
function setupNavigation() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Smart Sticky & Auto-Hide Header on Scroll Down, Reveal on Scroll Up
  let lastScrollY = window.scrollY;

  window.addEventListener(
    'scroll',
    () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;

      // Sticky header shadow
      if (currentScrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Auto-hide on scroll down, reveal on scroll up
      if (currentScrollY > 140) {
        if (diff > 8 && (!navMenu || !navMenu.classList.contains('open'))) {
          header.classList.add('header-hidden');
        } else if (diff < -8) {
          header.classList.remove('header-hidden');
        }
      } else {
        header.classList.remove('header-hidden');
      }

      lastScrollY = currentScrollY;

      // Active nav link spy
      const sections = ['hero', 'about', 'rooms', 'banquet', 'restaurant', 'gallery', 'contact'];
      const current = sections.find((secId) => {
        const el = document.getElementById(secId);
        if (el) {
          const top = el.getBoundingClientRect().top;
          return top <= 140 && top >= -el.offsetHeight + 140;
        }
        return false;
      });

      if (current) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
      }
    },
    { passive: true }
  );

  // Mobile drawer controls
  const openDrawer = () => {
    if (navMenu) navMenu.classList.add('open');
    if (menuToggle) {
      menuToggle.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
    if (navBackdrop) {
      navBackdrop.classList.add('open');
    }
    document.body.classList.add('nav-open');
  };

  const closeDrawer = () => {
    if (navMenu) navMenu.classList.remove('open');
    if (menuToggle) {
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    if (navBackdrop) {
      navBackdrop.classList.remove('open');
    }
    document.body.classList.remove('nav-open');
  };

  const toggleDrawer = () => {
    if (navMenu && navMenu.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const navBackdrop = document.getElementById('nav-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  const btnDrawerReserve = document.getElementById('btn-drawer-reserve');

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleDrawer);
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      closeDrawer();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Mobile drawer reserve button
  if (btnDrawerReserve) {
    btnDrawerReserve.addEventListener('click', () => {
      closeDrawer();
      const bookingModal = document.getElementById('booking-modal');
      if (bookingModal) {
        bookingModal.classList.add('open');
      }
    });
  }
}

/* ==========================================================================
   CINEMATIC SECTION SCROLL-DRIVEN ANIMATIONS
   ("website ke all section scroll krne pe uper gayab ho jaye and jub neeche kre to aajaye")
   ========================================================================== */
function setupSectionScrollAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const targetList = [
    {
      id: 'hero',
      el: document.querySelector('#hero .hero-container'),
      section: document.getElementById('hero'),
      isHero: true,
    },
    {
      id: 'booking-strip',
      el: document.querySelector('.hero-booking-strip .booking-strip-wrap'),
      section: document.querySelector('.hero-booking-strip'),
    },
    {
      id: 'about',
      el: document.querySelector('#about .container'),
      section: document.getElementById('about'),
    },
    {
      id: 'rooms',
      el: document.querySelector('#rooms .container'),
      section: document.getElementById('rooms'),
    },
    {
      id: 'banquet',
      el: document.querySelector('#banquet .container'),
      section: document.getElementById('banquet'),
    },
    {
      id: 'restaurant',
      el: document.querySelector('#restaurant .container'),
      section: document.getElementById('restaurant'),
    },
    {
      id: 'gallery',
      el: document.querySelector('#gallery .container'),
      section: document.getElementById('gallery'),
    },
    {
      id: 'contact',
      el: document.querySelector('#contact .container'),
      section: document.getElementById('contact'),
    },
  ].filter((item) => item.el && item.section);

  if (targetList.length === 0) return;

  let ticking = false;

  const updateSectionPositions = () => {
    const vh = window.innerHeight;
    const scrollY = window.scrollY;

    targetList.forEach(({ el, section, isHero }) => {
      const rect = section.getBoundingClientRect();

      // 1. Off-screen check: Far below or far above
      if (rect.bottom < -120 || rect.top > vh + 120) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        return;
      }

      let opacity = 1;
      let translateY = 0;

      // 2. Top Exit Phase: Glides UP and fades away ("uper gayab ho jaye")
      const exitThreshold = vh * 0.70;
      if (rect.bottom < exitThreshold) {
        const exitProgress = Math.min(1, Math.max(0, (exitThreshold - rect.bottom) / exitThreshold));
        // Exponential fade for royal ease
        opacity = Math.max(0, 1 - Math.pow(exitProgress, 1.2));
        translateY = -exitProgress * 65; // Floats upwards by up to 65px
      }

      // 3. Bottom Enter Phase: Rises from below and appears ("jub neeche kre to aajaye")
      const enterThreshold = vh * 0.88;
      if (rect.top > enterThreshold && !isHero) {
        const enterProgress = Math.max(0, Math.min(1, (vh - rect.top) / (vh - enterThreshold)));
        opacity = Math.min(opacity, enterProgress);
        translateY = (1 - enterProgress) * 40; // Glides smoothly into place
      }

      // 4. Hero smooth scroll glide
      if (isHero && scrollY > 30) {
        const heroExit = Math.min(1, scrollY / (rect.height * 0.82));
        opacity = Math.max(0, 1 - Math.pow(heroExit, 1.25));
        translateY = -heroExit * 80;
      }

      el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      el.style.opacity = opacity.toFixed(2);
      el.style.pointerEvents = opacity > 0.1 ? 'auto' : 'none';
    });

    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateSectionPositions);
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    window.requestAnimationFrame(updateSectionPositions);
  });

  // Initial calculation on load
  window.requestAnimationFrame(updateSectionPositions);
}

/* ==========================================================================
   TOAST NOTIFICATION SYSTEM
   ========================================================================== */
let toastTimeout = null;
function showToast(title, message) {
  const toast = document.getElementById('toast-notify');
  const titleEl = document.getElementById('toast-title');
  const descEl = document.getElementById('toast-desc');

  if (!toast || !titleEl || !descEl) return;

  titleEl.textContent = title;
  descEl.textContent = message;

  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   MULTI-CURRENCY SYSTEM (INR, USD, EUR, AED, GBP)
   ========================================================================== */
const CURRENCY_RATES = {
  INR: { symbol: '₹', rate: 1, locale: 'en-IN' },
  USD: { symbol: '$', rate: 0.012, locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.011, locale: 'de-DE' },
  AED: { symbol: 'د.إ ', rate: 0.044, locale: 'en-AE' },
  GBP: { symbol: '£', rate: 0.0094, locale: 'en-GB' },
};

let currentCurrency = localStorage.getItem('mapaz_currency') || 'INR';

function formatCurrency(amountInInr, currencyKey = currentCurrency) {
  const conf = CURRENCY_RATES[currencyKey] || CURRENCY_RATES.INR;
  const converted = Math.round(amountInInr * conf.rate);
  return `${conf.symbol}${converted.toLocaleString(conf.locale)}`;
}

function setupMultiCurrency() {
  const currencySelect = document.getElementById('currency-select');
  const currencySelectMobile = document.getElementById('currency-select-mobile');

  const onCurrencyChange = (newVal) => {
    currentCurrency = newVal;
    localStorage.setItem('mapaz_currency', currentCurrency);
    if (currencySelect) currencySelect.value = currentCurrency;
    if (currencySelectMobile) currencySelectMobile.value = currentCurrency;
    applyCurrencyToPage();
  };

  if (currencySelect) {
    currencySelect.value = currentCurrency;
    currencySelect.addEventListener('change', (e) => onCurrencyChange(e.target.value));
  }

  if (currencySelectMobile) {
    currencySelectMobile.value = currentCurrency;
    currencySelectMobile.addEventListener('change', (e) => onCurrencyChange(e.target.value));
  }

  // Initial application on page load
  applyCurrencyToPage();
}

function applyCurrencyToPage() {
  // 1. Update Room Compact Track prices
  const roomCardPrices = {
    deluxe: 3499,
    'super-deluxe': 4999,
    'skyline-suite': 5999,
    'maharaja-suite': 7999,
    'luxury-suite': 9999,
  };

  document.querySelectorAll('.room-card-compact').forEach((card) => {
    const roomId = card.dataset.roomId;
    const base = roomCardPrices[roomId];
    if (base) {
      const priceVal = card.querySelector('.price-val');
      if (priceVal) priceVal.textContent = formatCurrency(base);
    }
  });

  // 2. Update Room Step Nav Tabs pills
  const roomTabPills = document.querySelectorAll('.rooms-tab-pill');
  const tabPrices = [3499, 4999, 5999, 7999, 9999];
  roomTabPills.forEach((pill, idx) => {
    const rateEl = pill.querySelector('.pill-rate');
    if (rateEl && tabPrices[idx]) {
      rateEl.textContent = formatCurrency(tabPrices[idx]);
    }
  });

  // 3. Update Quick Booking options
  const quickRoomSelect = document.getElementById('book-room-type');
  if (quickRoomSelect) {
    Array.from(quickRoomSelect.options).forEach((opt) => {
      const base = Number(opt.dataset.basePrice) || roomCardPrices[opt.value];
      if (base) {
        const title = opt.text.split('(')[0].trim();
        opt.text = `${title} (${formatCurrency(base)})`;
      }
    });
  }

  // 4. Update Modal Booking Select options
  const modalRoomSelect = document.getElementById('modal-room-type');
  if (modalRoomSelect) {
    Array.from(modalRoomSelect.options).forEach((opt) => {
      const base = Number(opt.dataset.price) || roomCardPrices[opt.value];
      if (base) {
        const title = opt.text.split('(')[0].trim();
        opt.text = `${title} (${formatCurrency(base)} / night)`;
      }
    });
  }

  // 5. Update Dining Circular Carousel Prices
  const foodPrices = [750, 599, 950, 1050, 380];
  const circularTabs = document.querySelectorAll('#food-circular-tabs .circular-tab-btn');
  circularTabs.forEach((tab, idx) => {
    const pEl = tab.querySelector('.tab-price');
    if (pEl && foodPrices[idx]) {
      pEl.textContent = formatCurrency(foodPrices[idx]);
    }
  });

  const foodCards = document.querySelectorAll('.circular-food-card');
  foodCards.forEach((card, idx) => {
    const valEl = card.querySelector('.price-val');
    if (valEl && foodPrices[idx]) {
      valEl.textContent = formatCurrency(foodPrices[idx]);
    }
  });

  // 6. Refresh modal calculation if open
  updatePriceCalculation();
}

/* ==========================================================================
   INTERACTIVE 3D VIRTUAL TOUR & ARCHITECTURE ENGINE
   ========================================================================== */
let hotel3dInstance = null;

function setupHotel3DVirtualTour() {
  const modal3D = document.getElementById('hotel-3d-modal');
  const btnClose3D = document.getElementById('hotel-3d-close');
  const btnHero3D = document.getElementById('btn-hero-3d-tour');
  const btnNav3D = document.getElementById('btn-nav-3d-tour');
  const btnMobile3D = document.getElementById('btn-mobile-3d-tour');
  const container3D = document.getElementById('hotel-3d-canvas-container');
  const loader3D = document.getElementById('canvas-3d-loader');

  if (!modal3D || !container3D) return;

  const open3DModal = (camPreset = 'angle') => {
    modal3D.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Lazy instantiate on first open
    if (!hotel3dInstance) {
      if (loader3D) loader3D.style.display = 'flex';
      setTimeout(() => {
        hotel3dInstance = new Hotel3DScene('hotel-3d-canvas-container');
        if (loader3D) loader3D.style.display = 'none';

        // Connect hotspot selection callback
        hotel3dInstance.onHotspotSelected = (hotspot) => {
          showHotspotCard(hotspot);
        };

        if (camPreset) {
          hotel3dInstance.setCameraPreset(camPreset);
        }
      }, 60);
    } else {
      setTimeout(() => {
        hotel3dInstance.onWindowResize();
        if (camPreset) hotel3dInstance.setCameraPreset(camPreset);
      }, 100);
    }
  };

  const close3DModal = () => {
    modal3D.classList.remove('open');
    document.body.style.overflow = '';
    const hotspotCard = document.getElementById('hotspot-popup-card');
    if (hotspotCard) hotspotCard.classList.remove('open');
  };

  if (btnHero3D) btnHero3D.addEventListener('click', () => open3DModal('angle'));
  if (btnNav3D) btnNav3D.addEventListener('click', () => open3DModal('front'));
  if (btnMobile3D) btnMobile3D.addEventListener('click', () => open3DModal('front'));
  if (btnClose3D) btnClose3D.addEventListener('click', close3DModal);

  modal3D.addEventListener('click', (e) => {
    if (e.target === modal3D) close3DModal();
  });

  // Lighting buttons
  const lightBtns = modal3D.querySelectorAll('.light-btn');
  lightBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      lightBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.light || 'day';
      if (hotel3dInstance) hotel3dInstance.setLightingMode(mode);
    });
  });

  // Camera presets
  const camBtns = modal3D.querySelectorAll('.hud-btn[data-cam]');
  camBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      camBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cam = btn.dataset.cam;
      if (hotel3dInstance) hotel3dInstance.setCameraPreset(cam);
    });
  });

  // Auto-rotate toggle
  const btnAutoRotate = document.getElementById('btn-3d-autorotate');
  if (btnAutoRotate) {
    btnAutoRotate.addEventListener('click', () => {
      if (hotel3dInstance) {
        const isRotating = hotel3dInstance.toggleAutoRotate();
        btnAutoRotate.classList.toggle('active', isRotating);
      }
    });
  }

  // Zoom In / Out
  const btnZoomIn = document.getElementById('btn-3d-zoomin');
  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      if (hotel3dInstance) hotel3dInstance.zoomIn();
    });
  }

  const btnZoomOut = document.getElementById('btn-3d-zoomout');
  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      if (hotel3dInstance) hotel3dInstance.zoomOut();
    });
  }

  // Hotspot Card
  const hotspotCard = document.getElementById('hotspot-popup-card');
  const hotspotTitle = document.getElementById('hotspot-popup-title');
  const hotspotDesc = document.getElementById('hotspot-popup-desc');
  const hotspotClose = document.getElementById('hotspot-popup-close');
  const btnHotspotReserve = document.getElementById('btn-hotspot-reserve');

  function showHotspotCard(data) {
    if (!hotspotCard) return;
    if (hotspotTitle) hotspotTitle.textContent = data.title;
    if (hotspotDesc) hotspotDesc.textContent = data.desc;
    hotspotCard.classList.add('open');
  }

  if (hotspotClose) {
    hotspotClose.addEventListener('click', () => {
      hotspotCard.classList.remove('open');
    });
  }

  if (btnHotspotReserve) {
    btnHotspotReserve.addEventListener('click', () => {
      close3DModal();
      const openBook = document.getElementById('btn-open-book-modal');
      if (openBook) openBook.click();
    });
  }
}

/* ==========================================================================
   CURATED VIP EXPERIENCES & INQUIRY MODAL
   ========================================================================== */
function setupCuratedExperiences() {
  const expModal = document.getElementById('experience-modal');
  const expClose = document.getElementById('experience-modal-close');
  const expSelect = document.getElementById('exp-inquiry-select');
  const expDate = document.getElementById('exp-date');
  const expForm = document.getElementById('experience-inquiry-form');

  if (expDate) {
    const today = new Date().toISOString().split('T')[0];
    expDate.value = today;
    expDate.min = today;
  }

  const openExpModal = (expName = '') => {
    if (expSelect && expName) {
      expSelect.value = expName;
    }
    if (expModal) expModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeExpModal = () => {
    if (expModal) expModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.btn-inquire-exp').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expName = btn.dataset.experience || '';
      openExpModal(expName);
    });
  });

  if (expClose) expClose.addEventListener('click', closeExpModal);

  if (expModal) {
    expModal.addEventListener('click', (e) => {
      if (e.target === expModal) closeExpModal();
    });
  }

  if (expForm) {
    expForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('exp-name')?.value || 'Guest';
      const expTitle = expSelect ? expSelect.value : 'Curated VIP Experience';
      const refId = 'EXP-' + Math.floor(10000 + Math.random() * 90000);

      closeExpModal();
      showToast(
        'Bespoke Itinerary Received!',
        `Thank you ${name}! Ref: ${refId}. Our Chief Concierge will coordinate your ${expTitle}.`
      );
      expForm.reset();
    });
  }
}

/* ==========================================================================
   ROYAL CELEBRATION CAPACITY PLANNER
   ========================================================================== */
function setupRoyalCelebrationPlanner() {
  const pills = document.querySelectorAll('#planner-guest-pills .planner-pill');
  const resVenue = document.getElementById('planner-res-venue');
  const resCap = document.getElementById('planner-res-cap');
  const resArea = document.getElementById('planner-res-area');
  const resCatering = document.getElementById('planner-res-catering');
  const resFeatures = document.getElementById('planner-res-features');
  const btnInquire = document.getElementById('btn-planner-inquire');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      if (resVenue) resVenue.textContent = pill.dataset.venue || '';
      if (resCap) resCap.textContent = `👥 Capacity: ${pill.dataset.capacity || ''}`;
      if (resArea) resArea.textContent = `📐 Area: ${pill.dataset.area || ''}`;
      if (resCatering) resCatering.textContent = `🍽️ Dining: ${pill.dataset.catering || ''}`;
      if (resFeatures) resFeatures.textContent = pill.dataset.features || '';
    });
  });

  if (btnInquire) {
    btnInquire.addEventListener('click', () => {
      const activePill = document.querySelector('#planner-guest-pills .planner-pill.active');
      const venueName = activePill ? activePill.dataset.venue : 'Grand Royale Ballroom';
      const guests = activePill ? activePill.dataset.guests : '500';

      const eventModal = document.getElementById('event-modal');
      const eventNotes = document.getElementById('event-notes');
      const eventGuests = document.getElementById('event-guests');

      if (eventGuests) {
        if (Number(guests) <= 250) eventGuests.value = '100-250';
        else if (Number(guests) <= 500) eventGuests.value = '250-500';
        else if (Number(guests) <= 1000) eventGuests.value = '500-1000';
        else eventGuests.value = '1000+';
      }

      if (eventNotes) {
        eventNotes.value = `VIP Inquiry for ${venueName} celebration package.`;
      }

      if (eventModal) {
        eventModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Mobile Sticky Bar Reserve button
  const btnMobileBook = document.getElementById('btn-mobile-book');
  if (btnMobileBook) {
    btnMobileBook.addEventListener('click', () => {
      const openBook = document.getElementById('btn-open-book-modal');
      if (openBook) openBook.click();
    });
  }
}
