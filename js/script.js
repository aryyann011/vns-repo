/* ============================================
   EXPLORE VARANASI — JavaScript
   Navigation, Form Validation, Gallery Lightbox
   ============================================ */

(function () {
  'use strict';

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      mainNav.classList.toggle('open');
      document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close nav when clicking a link
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Image Fallback ---
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      if (!this.classList.contains('img-error')) {
        this.classList.add('img-error');
        var fallbackSrc = this.getAttribute('data-fallback');
        if (fallbackSrc && this.src !== fallbackSrc) {
          this.src = fallbackSrc;
        } else {
          // Show placeholder styling
          this.style.backgroundColor = '#F4EBDD';
          this.style.display = 'flex';
          this.style.alignItems = 'center';
          this.style.justifyContent = 'center';
          this.alt = this.alt || 'Image unavailable';
        }
      }
    });
  });

  // Also handle images without data-fallback
  document.querySelectorAll('img:not([data-fallback])').forEach(function (img) {
    img.addEventListener('error', function () {
      if (!this.classList.contains('img-error')) {
        this.classList.add('img-error');
        this.style.backgroundColor = '#F4EBDD';
      }
    });
  });

  // --- Booking Form Validation ---
  var bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    var today = new Date().toISOString().split('T')[0];
    var checkinInput = document.getElementById('checkin');
    var checkoutInput = document.getElementById('checkout');

    // Set minimum dates
    if (checkinInput) checkinInput.setAttribute('min', today);
    if (checkoutInput) checkoutInput.setAttribute('min', today);

    // Update checkout min when checkin changes
    if (checkinInput && checkoutInput) {
      checkinInput.addEventListener('change', function () {
        var checkinDate = this.value;
        if (checkinDate) {
          var nextDay = new Date(checkinDate);
          nextDay.setDate(nextDay.getDate() + 1);
          checkoutInput.setAttribute('min', nextDay.toISOString().split('T')[0]);

          // Clear checkout if it's before new checkin
          if (checkoutInput.value && checkoutInput.value <= checkinDate) {
            checkoutInput.value = '';
          }
        }
      });
    }

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      // Clear previous errors
      bookingForm.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });
      bookingForm.querySelectorAll('.error-msg').forEach(function (el) {
        el.classList.remove('visible');
      });

      // Validate required text fields
      var requiredFields = [
        { id: 'fullName', msg: 'Please enter your full name' },
        { id: 'email', msg: 'Please enter a valid email address' },
        { id: 'mobile', msg: 'Please enter a valid phone number' },
        { id: 'nationality', msg: 'Please enter your nationality' },
        { id: 'guests', msg: 'Please enter the number of guests' },
        { id: 'checkin', msg: 'Please select a check-in date' },
        { id: 'checkout', msg: 'Please select a check-out date' },
        { id: 'rooms', msg: 'Please enter the number of rooms' }
      ];

      requiredFields.forEach(function (field) {
        var input = document.getElementById(field.id);
        if (input && !input.value.trim()) {
          showError(input, field.msg);
          isValid = false;
        }
      });

      // Email validation
      var emailInput = document.getElementById('email');
      if (emailInput && emailInput.value.trim()) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          showError(emailInput, 'Please enter a valid email address');
          isValid = false;
        }
      }

      // Phone validation
      var mobileInput = document.getElementById('mobile');
      if (mobileInput && mobileInput.value.trim()) {
        var phoneRegex = /^[\d\s\-+()]{7,20}$/;
        if (!phoneRegex.test(mobileInput.value.trim())) {
          showError(mobileInput, 'Please enter a valid phone number');
          isValid = false;
        }
      }

      // Guest count validation
      var guestsInput = document.getElementById('guests');
      if (guestsInput && guestsInput.value) {
        if (parseInt(guestsInput.value) < 1 || parseInt(guestsInput.value) > 50) {
          showError(guestsInput, 'Please enter a valid number of guests (1-50)');
          isValid = false;
        }
      }

      // Room count validation
      var roomsInput = document.getElementById('rooms');
      if (roomsInput && roomsInput.value) {
        if (parseInt(roomsInput.value) < 1 || parseInt(roomsInput.value) > 20) {
          showError(roomsInput, 'Please enter a valid number of rooms (1-20)');
          isValid = false;
        }
      }

      // Date validation
      var checkinVal = checkinInput ? checkinInput.value : '';
      var checkoutVal = checkoutInput ? checkoutInput.value : '';

      if (checkinVal && checkinVal < today) {
        showError(checkinInput, 'Check-in date cannot be in the past');
        isValid = false;
      }

      if (checkinVal && checkoutVal && checkoutVal <= checkinVal) {
        showError(checkoutInput, 'Check-out must be after check-in');
        isValid = false;
      }

      // Terms checkbox
      var termsCheckbox = document.getElementById('terms');
      if (termsCheckbox && !termsCheckbox.checked) {
        var termsGroup = termsCheckbox.closest('.form-checkbox');
        if (termsGroup) {
          var termsError = termsGroup.querySelector('.error-msg');
          if (termsError) termsError.classList.add('visible');
        }
        isValid = false;
      }

      if (isValid) {
        showConfirmation();
      } else {
        // Scroll to first error
        var firstError = bookingForm.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    function showError(input, message) {
      input.classList.add('error');
      var errorMsg = input.parentElement.querySelector('.error-msg');
      if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.classList.add('visible');
      }
    }

    function showConfirmation() {
      var confirmation = document.getElementById('bookingConfirmation');
      if (!confirmation) return;

      var name = document.getElementById('fullName').value;
      var checkin = document.getElementById('checkin').value;
      var checkout = document.getElementById('checkout').value;
      var roomType = document.getElementById('roomType');
      var hotelCat = document.getElementById('hotelCategory');
      var guests = document.getElementById('guests').value;

      var detailsEl = confirmation.querySelector('.booking-confirmation__details');
      if (detailsEl) {
        var checkinFormatted = formatDate(checkin);
        var checkoutFormatted = formatDate(checkout);
        var roomText = roomType ? roomType.options[roomType.selectedIndex].text : '';
        var hotelText = hotelCat ? hotelCat.options[hotelCat.selectedIndex].text : '';

        detailsEl.innerHTML =
          '<strong>Guest:</strong> ' + escapeHTML(name) + '<br>' +
          '<strong>Check-in:</strong> ' + checkinFormatted + '<br>' +
          '<strong>Check-out:</strong> ' + checkoutFormatted + '<br>' +
          '<strong>Guests:</strong> ' + escapeHTML(guests) + '<br>' +
          '<strong>Room type:</strong> ' + escapeHTML(roomText) + '<br>' +
          '<strong>Hotel category:</strong> ' + escapeHTML(hotelText);
      }

      confirmation.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Close button
      var closeBtn = confirmation.querySelector('.booking-confirmation__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          confirmation.classList.remove('active');
          document.body.style.overflow = '';
          bookingForm.reset();
        });
      }

      // Close on background click
      confirmation.addEventListener('click', function (e) {
        if (e.target === confirmation) {
          confirmation.classList.remove('active');
          document.body.style.overflow = '';
          bookingForm.reset();
        }
      });
    }

    function formatDate(dateStr) {
      if (!dateStr) return '';
      var d = new Date(dateStr + 'T00:00:00');
      var months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    function escapeHTML(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }

  // --- Gallery Lightbox ---
  var galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
  var lightbox = document.getElementById('lightbox');

  if (galleryItems.length > 0 && lightbox) {
    var lightboxImg = lightbox.querySelector('.lightbox__img');
    var lightboxCaption = lightbox.querySelector('.lightbox__caption');
    var closeBtn = lightbox.querySelector('.lightbox__close');
    var prevBtn = lightbox.querySelector('.lightbox__prev');
    var nextBtn = lightbox.querySelector('.lightbox__next');
    var currentIndex = 0;
    var images = [];

    // Collect all gallery images
    galleryItems.forEach(function (item, index) {
      var img = item.querySelector('img');
      var caption = item.querySelector('.gallery-item__caption');
      images.push({
        src: img ? img.src : '',
        alt: img ? img.alt : '',
        caption: caption ? caption.textContent : ''
      });

      item.addEventListener('click', function (e) {
        // Don't open lightbox if clicking a link
        if (e.target.tagName === 'A') return;
        currentIndex = index;
        openLightbox();
      });

      // Keyboard support
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'View ' + (img ? img.alt : 'image'));

      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          currentIndex = index;
          openLightbox();
        }
      });
    });

    function openLightbox() {
      updateLightboxImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      // Return focus to the gallery item
      if (galleryItems[currentIndex]) {
        galleryItems[currentIndex].focus();
      }
    }

    function updateLightboxImage() {
      if (!lightboxImg || !images[currentIndex]) return;
      lightboxImg.src = images[currentIndex].src;
      lightboxImg.alt = images[currentIndex].alt;
      if (lightboxCaption) {
        lightboxCaption.textContent = images[currentIndex].caption;
      }
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightboxImage();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightboxImage();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);

    // Close on background click
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard controls
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
      }
    });
  }

})();
