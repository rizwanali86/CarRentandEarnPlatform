 // Car Data with modern fields
    const defaultCars = [
      { id: 1, name: "Tesla Model 3", category: "Luxury", price: 33500, rating: 4.8, reviews: 45, seats: 5, transmission: "Auto", fuel: "Electric", img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=400", badge: "new", availability: "available" },
      { id: 2, name: "Honda Civic", category: "Economy", price: 8000, rating: 4.5, reviews: 38, seats: 5, transmission: "Auto", fuel: "Gasoline", img: "https://carlo.pk/wp-content/uploads/2025/02/g-c-321x240.webp", badge: "popular", availability: "available" },
      { id: 3, name: "Toyota Revo", category: "SUV", price: 18000, rating: 4.6, reviews: 52, seats: 7, transmission: "Auto", fuel: "Hybrid", img: "https://carlo.pk/wp-content/uploads/2025/02/Toyota-Revo-410x231.webp", badge: "", availability: "available" },
      { id: 4, name: "BMW X5", category: "Luxury", price: 42000, rating: 4.9, reviews: 67, seats: 5, transmission: "Auto", fuel: "Gasoline", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400", badge: "popular", availability: "booked" },
      { id: 5, name: "Ford Fiesta", category: "Economy", price: 9750, rating: 4.3, reviews: 29, seats: 5, transmission: "Manual", fuel: "Gasoline", img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=400", badge: "", availability: "available" },
      { id: 6, name: "Audi A6", category: "Luxury", price: 38500, rating: 4.7, reviews: 41, seats: 5, transmission: "Auto", fuel: "Gasoline", img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=400", badge: "new", availability: "available" },
      { id: 7, name: "Suzuki Alto", category: "Economy", price: 7500, rating: 4.2, reviews: 33, seats: 4, transmission: "Manual", fuel: "Gasoline", img: "https://images.unsplash.com/photo-1583267746897-c5e0c8c3e6d3?auto=format&fit=crop&q=80&w=400", badge: "", availability: "available" },
      { id: 8, name: "Land Cruiser", category: "SUV", price: 45000, rating: 4.9, reviews: 58, seats: 7, transmission: "Auto", fuel: "Diesel", img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=400", badge: "popular", availability: "coming" },
      { id: 9, name: "Mercedes S-Class", category: "Luxury", price: 55000, rating: 5.0, reviews: 71, seats: 5, transmission: "Auto", fuel: "Gasoline", img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400", badge: "new", availability: "available" },
      { id: 10, name: "Hyundai Tucson", category: "SUV", price: 18500, rating: 4.4, reviews: 44, seats: 5, transmission: "Auto", fuel: "Gasoline", img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=400", badge: "", availability: "available" }
    ];

    let carData = JSON.parse(localStorage.getItem('carData')) || defaultCars;
    let filter = 'all', sort = 'default', search = '', selectedCar = null;

    // Storage helper
    const Storage = {
      get: k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } },
      set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true } catch { return false } }
    };

    // Toast
    const showToast = (msg, isErr = false) => {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.toggle('error', isErr);
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 3000);
    };

    // Loader
    window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('loader-hidden'), 800));

    // Theme
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const setTheme = t => {
      html.setAttribute('data-theme', t);
      Storage.set('theme', t);
      themeBtn.innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
    themeBtn.addEventListener('click', () => setTheme(html.getAttribute('data-theme') === 'light' ? 'dark' : 'light'));
    setTheme(Storage.get('theme') || 'light');

    // Mobile Menu
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const toggleMenu = () => {
      navMenu.classList.toggle('nav-active');
      navOverlay.classList.toggle('active');
      burger.classList.toggle('toggle');
    };
    burger.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);
    document.querySelectorAll('#nav-menu li a').forEach(link => link.addEventListener('click', () => {
      if (navMenu.classList.contains('nav-active')) toggleMenu();
    }));

    // Reveal Animation
    const reveal = () => document.querySelectorAll('.reveal:not(.active)').forEach(e => {
      if (e.getBoundingClientRect().top < window.innerHeight - 100) e.classList.add('active');
    });
    window.addEventListener('scroll', reveal);
    reveal();

    // Animated Counters
    const animateCounters = () => {
      document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseFloat(el.dataset.target);
        const increment = target / 50;
        let current = 0;
        const update = () => {
          current += increment;
          if (current < target) {
            el.textContent = Math.ceil(current).toLocaleString();
            requestAnimationFrame(update);
          } else {
            el.textContent = target % 1 === 0 ? target.toLocaleString() : target.toFixed(1);
          }
        };
        update();
      });
    };
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounters(); statsObserver.disconnect() } });
    });
    const statsEl = document.querySelector('.stats-animated');
    if (statsEl) statsObserver.observe(statsEl);

    // Cars
    const getCars = () => {
      let cars = [...carData];
      if (filter !== 'all') cars = cars.filter(c => c.category === filter);
      if (search) cars = cars.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
      if (sort === 'price-low') cars.sort((a, b) => a.price - b.price);
      if (sort === 'price-high') cars.sort((a, b) => b.price - a.price);
      if (sort === 'rating') cars.sort((a, b) => b.rating - a.rating);
      return cars;
    };

    const renderCars = () => {
      const grid = document.getElementById('car-grid');
      const cars = getCars();
      grid.innerHTML = '';

      if (!cars.length) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--mut)">No cars found.</p>';
        document.getElementById('view-all-container').style.display = 'none';
        return;
      }

      cars.forEach((car, i) => {
        const card = document.createElement('div');
        card.className = 'car-card reveal';
        if (i >= 6) card.classList.add('hidden');

        const badgeHTML = car.badge === 'new' ? '<div class="car-badge-new"><i class="fas fa-star"></i> New</div>' :
          car.badge === 'popular' ? '<div class="car-badge-popular"><i class="fas fa-fire"></i> Popular</div>' : '';

        const categoryClass = car.category === 'Economy' ? 'badge-economy' :
          car.category === 'SUV' ? 'badge-suv' : 'badge-luxury';

        const availStatus = car.availability === 'available' ? { text: 'Available Now', class: 'status-available' } :
          car.availability === 'booked' ? { text: 'Booked', class: 'status-booked' } :
            { text: 'Coming Soon', class: 'status-coming' };

        const stars = '★'.repeat(Math.floor(car.rating)) + (car.rating % 1 >= 0.5 ? '⯨' : '');

        card.innerHTML = `
      <div class="car-card-image">
        ${badgeHTML}
        <div class="car-favorite" onclick="toggleFavorite(event,${car.id})">
          <i class="far fa-heart"></i>
        </div>
        <div class="car-category-badge ${categoryClass}">${car.category}</div>
        <img src="${car.img}" alt="${car.name}" loading="lazy">
      </div>
      <div class="car-info">
        <div class="car-header">
          <h3 class="car-name">${car.name}</h3>
        </div>
        <div class="car-rating">
          <span class="stars">${stars}</span>
          <span class="reviews">(${car.reviews} reviews)</span>
        </div>
        <div class="car-features">
          <div class="car-feature">
            <i class="fas fa-users"></i>
            <span>${car.seats}</span>
            <div class="tooltip">${car.seats} Seats</div>
          </div>
          <div class="car-feature">
            <i class="fas fa-cog"></i>
            <span>${car.transmission}</span>
            <div class="tooltip">${car.transmission} Transmission</div>
          </div>
          <div class="car-feature">
            <i class="fas fa-gas-pump"></i>
            <span>${car.fuel}</span>
            <div class="tooltip">${car.fuel} Fuel</div>
          </div>
        </div>
        <div class="car-availability">
          <span class="status-dot ${availStatus.class}"></span>
          <span style="color:var(--mut)">${availStatus.text}</span>
        </div>
        <div class="car-price-section">
          <div>
            <div class="car-price">Rs ${car.price.toLocaleString()}</div>
            <div class="car-price-label">per day</div>
          </div>
        </div>
        <div class="car-actions">
          <button class="btn-ghost" onclick="quickView(${car.id})">
            <i class="fas fa-eye"></i> Quick View
          </button>
          <button class="btn-primary-car" onclick="bookCar(${car.id})">
            <i class="fas fa-calendar-check"></i> Book Now
          </button>
        </div>
      </div>
    `;

        grid.appendChild(card);
        setTimeout(() => card.classList.add('active'), i * 50);
      });

      document.getElementById('view-all-container').style.display = cars.length > 6 ? 'block' : 'none';
    };

    document.getElementById('search-cars').addEventListener('input', e => { search = e.target.value; renderCars() });
    document.getElementById('sort-cars').addEventListener('change', e => { sort = e.target.value; renderCars() });
    document.querySelector('.filter-btns').addEventListener('click', e => {
      if (e.target.classList.contains('filter-btn')) {
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        filter = e.target.dataset.filter;
        renderCars();
      }
    });

    // Add Car
    document.getElementById('add-car-btn').addEventListener('click', () => document.getElementById('add-car-modal').classList.add('active'));
    document.getElementById('add-car-form').addEventListener('submit', e => {
      e.preventDefault();
      const newCar = {
        id: Date.now(),
        name: document.getElementById('car-name').value,
        category: document.getElementById('car-category').value,
        price: parseInt(document.getElementById('car-price').value),
        rating: 4.5,
        seats: parseInt(document.getElementById('car-seats').value),
        transmission: document.getElementById('car-transmission').value,
        fuel: document.getElementById('car-fuel').value,
        img: document.getElementById('car-image').value
      };
      carData.push(newCar);
      Storage.set('carData', carData);
      document.getElementById('add-car-modal').classList.remove('active');
      e.target.reset();
      showToast('Car added successfully!');
      renderCars();
    });

    // Booking
    const calcRental = () => {
      const p = document.getElementById('pickup-date').value;
      const d = document.getElementById('dropoff-date').value;
      if (p && d && selectedCar) {
        const days = Math.max(1, Math.ceil((new Date(d) - new Date(p)) / 86400000));
        document.getElementById('rental-duration').textContent = `${days} day${days > 1 ? 's' : ''}`;
        document.getElementById('daily-rate').textContent = `Rs ${selectedCar.price.toLocaleString()}`;
        document.getElementById('total-price').textContent = `Rs ${(days * selectedCar.price).toLocaleString()}`;
      }
    };
    document.getElementById('pickup-date').addEventListener('change', calcRental);
    document.getElementById('dropoff-date').addEventListener('change', calcRental);
    document.getElementById('booking-form').addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('booking-modal').classList.remove('active');
      e.target.reset();
      showToast(`Booking confirmed for ${selectedCar.name}!`);
    });

    // Contact Form
    document.getElementById('contact-message').addEventListener('input', e => {
      document.getElementById('char-count').textContent = e.target.value.length;
    });
    document.getElementById('contactForm').addEventListener('submit', e => {
      e.preventDefault();
      showToast('Thank you! Your message has been sent.');
      e.target.reset();
      document.getElementById('char-count').textContent = '0';
    });

    // Newsletter
    document.getElementById('newsletter-form').addEventListener('submit', e => {
      e.preventDefault();
      showToast('Thanks for subscribing!');
      e.target.reset();
    });

    // Business Hours Status
    const updateBusinessStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const badge = document.getElementById('status-badge');
      const isOpen = (day >= 1 && day <= 5 && hour >= 9 && hour < 18) || (day === 6 && hour >= 10 && hour < 16);
      badge.textContent = isOpen ? 'Open Now' : 'Closed';
      badge.className = `status-badge ${isOpen ? 'status-open' : 'status-closed'}`;
    };
    updateBusinessStatus();
    setInterval(updateBusinessStatus, 60000);

    // Chat
    let chatOpen = false;
    function sendChatMessage() {
      const input = document.getElementById('chat-input');
      const msg = input.value.trim();
      if (!msg) return;
      const body = document.getElementById('chat-body');
      body.innerHTML += `<div class="chat-message" style="background:#007bff;color:#fff;margin-left:auto;margin-right:0">${msg}</div>`;
      input.value = '';
      body.scrollTop = body.scrollHeight;
      setTimeout(() => {
        body.innerHTML += `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
        body.scrollTop = body.scrollHeight;
      }, 500);
      setTimeout(() => {
        body.querySelector('.typing-indicator').remove();
        body.innerHTML += `<div class="chat-message"><strong>Agent Sara</strong><br>Thanks for your message! Our team will assist you shortly.</div>`;
        body.scrollTop = body.scrollHeight;
      }, 2000);
    }
    document.getElementById('chat-input').addEventListener('keypress', e => { if (e.key === 'Enter') sendChatMessage() });

    // Back to Top
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    });

    // Modals
    document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    }));
    document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('active');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    });

    // FAQ
    document.querySelectorAll('.faq-question').forEach(btn => btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    }));

    // Hero Particles Animation
    const createParticles = () => {
      const container = document.getElementById('hero-particles');
      if (!container) return;
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
        container.appendChild(particle);
      }
    };
    createParticles();

    // Booking State
    let bookingState = { driverOption: 'self-drive', uploadedFiles: {}, paymentMethod: 'card' };

    // Driver Option Selection
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.driver-option').forEach(option => {
        option.addEventListener('click', function () {
          const optionValue = this.dataset.option;
          document.querySelectorAll('.driver-option').forEach(opt => opt.classList.remove('active'));
          this.classList.add('active');
          this.querySelector('input[type="radio"]').checked = true;
          bookingState.driverOption = optionValue;

          if (optionValue === 'self-drive') {
            document.getElementById('self-drive-fields').classList.add('active');
            document.getElementById('with-driver-fields').classList.remove('active');
            ['cnic-front', 'cnic-back', 'license', 'selfie', 'self-address'].forEach(id => {
              const el = document.getElementById(id);
              if (el) el.required = true;
            });
            ['pickup-location', 'dropoff-location', 'driver-contact'].forEach(id => {
              const el = document.getElementById(id);
              if (el) el.required = false;
            });
          } else {
            document.getElementById('self-drive-fields').classList.remove('active');
            document.getElementById('with-driver-fields').classList.add('active');
            ['cnic-front', 'cnic-back', 'license', 'selfie', 'self-address'].forEach(id => {
              const el = document.getElementById(id);
              if (el) el.required = false;
            });
            ['pickup-location', 'dropoff-location', 'driver-contact'].forEach(id => {
              const el = document.getElementById(id);
              if (el) el.required = true;
            });
          }
          calculateBookingPrice();
        });
      });

      // File Upload Setup
      function setupFileUpload(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        if (!input || !preview) return;

        input.addEventListener('change', function (e) {
          const file = e.target.files[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) {
            showToast('File size must be less than 5MB', true);
            input.value = '';
            return;
          }
          if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file', true);
            input.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = function (e) {
            preview.querySelector('.file-preview-img').src = e.target.result;
            preview.querySelector('.file-preview-name').textContent = file.name;
            preview.querySelector('.file-preview-size').textContent = formatFileSize(file.size);
            preview.classList.add('active');
            bookingState.uploadedFiles[inputId] = { name: file.name, size: file.size, type: file.type, data: e.target.result };
          };
          reader.readAsDataURL(file);
        });

        const deleteBtn = preview.querySelector('.file-preview-delete');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', function () {
            input.value = '';
            preview.classList.remove('active');
            delete bookingState.uploadedFiles[inputId];
          });
        }
      }

      ['cnic-front', 'cnic-back', 'license', 'selfie'].forEach(id => {
        setupFileUpload(id, id + '-preview');
      });

      // Address character count
      const addressField = document.getElementById('self-address');
      const addressCount = document.getElementById('address-count');
      if (addressField && addressCount) {
        addressField.addEventListener('input', function () {
          addressCount.textContent = this.value.length;
        });
      }

      // Payment Method Selection
      document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function () {
          const methodValue = this.dataset.method;
          document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
          this.classList.add('active');
          this.querySelector('input[type="radio"]').checked = true;
          bookingState.paymentMethod = methodValue;
          document.querySelectorAll('.payment-details').forEach(d => d.classList.remove('active'));
          document.getElementById(methodValue + '-details').classList.add('active');

          if (methodValue === 'cash') {
            const totalText = document.getElementById('total-amount').textContent;
            const total = parseInt(totalText.replace(/\D/g, ''));
            const advance = Math.ceil(total / 2);
            document.getElementById('payment-amount').textContent = 'Rs ' + advance.toLocaleString();
          } else {
            const totalText = document.getElementById('total-amount').textContent;
            document.getElementById('payment-amount').textContent = totalText;
          }
        });
      });

      // Card formatting
      function formatCardNumber(input) {
        let value = input.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        input.value = formattedValue;
      }
      ['card-number', 'cash-card-number'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('input', function () { formatCardNumber(this) });
      });

      function formatExpiry(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
        input.value = value;
      }
      ['card-expiry', 'cash-card-expiry'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('input', function () { formatExpiry(this) });
      });

      // Proceed to Payment
      const proceedBtn = document.getElementById('proceed-payment-btn');
      if (proceedBtn) {
        proceedBtn.addEventListener('click', function () {
          const form = document.getElementById('booking-form');
          if (!form.checkValidity()) {
            form.reportValidity();
            return;
          }
          if (bookingState.driverOption === 'self-drive') {
            const requiredFiles = ['cnic-front', 'cnic-back', 'license', 'selfie'];
            for (const fileId of requiredFiles) {
              if (!bookingState.uploadedFiles[fileId]) {
                showToast('Please upload all required documents', true);
                return;
              }
            }
          }
          document.getElementById('booking-step').style.display = 'none';
          document.getElementById('payment-step').style.display = 'block';
          document.getElementById('step1-circle').classList.remove('active');
          document.getElementById('step1-circle').classList.add('completed');
          document.getElementById('progress-line').classList.add('completed');
          document.getElementById('step2-circle').classList.add('active');
          document.querySelector('.modal-content').scrollTop = 0;
        });
      }

      // Back to Booking
      const backBtn = document.getElementById('back-to-booking-btn');
      if (backBtn) {
        backBtn.addEventListener('click', function () {
          document.getElementById('payment-step').style.display = 'none';
          document.getElementById('booking-step').style.display = 'block';
          document.getElementById('step1-circle').classList.add('active');
          document.getElementById('step1-circle').classList.remove('completed');
          document.getElementById('progress-line').classList.remove('completed');
          document.getElementById('step2-circle').classList.remove('active');
        });
      }

      // Complete Payment
      const completeBtn = document.getElementById('complete-payment-btn');
      if (completeBtn) {
        completeBtn.addEventListener('click', function () {
          const btn = this;
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
          setTimeout(() => {
            const bookingId = 'CS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            document.getElementById('booking-modal').classList.remove('active');
            document.getElementById('success-modal').classList.add('active');
            document.getElementById('generated-booking-id').textContent = bookingId;
            document.getElementById('confirm-email').textContent = document.getElementById('booking-email').value;
            document.getElementById('booking-form').reset();
            document.getElementById('booking-step').style.display = 'block';
            document.getElementById('payment-step').style.display = 'none';
            document.getElementById('step1-circle').classList.add('active');
            document.getElementById('step1-circle').classList.remove('completed');
            document.getElementById('progress-line').classList.remove('completed');
            document.getElementById('step2-circle').classList.remove('active');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-lock"></i> Complete Payment';
            bookingState.uploadedFiles = {};
            document.querySelectorAll('.file-preview').forEach(p => p.classList.remove('active'));
          }, 2000);
        });
      }
    });

    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function calculateBookingPrice() {
      const pickup = document.getElementById('pickup-date').value;
      const dropoff = document.getElementById('dropoff-date').value;
      if (!pickup || !dropoff || !selectedCar) return;
      const days = Math.max(1, Math.ceil((new Date(dropoff) - new Date(pickup)) / 86400000));
      const basePrice = selectedCar.price * days;
      const driverPrice = bookingState.driverOption === 'with-driver' ? 2000 * days : 0;
      const securityDeposit = 10000;
      const total = basePrice + driverPrice + securityDeposit;
      document.getElementById('rental-days').textContent = days;
      document.getElementById('base-price').textContent = 'Rs ' + basePrice.toLocaleString();
      const driverRow = document.getElementById('driver-charge-row');
      if (bookingState.driverOption === 'with-driver') {
        driverRow.style.display = 'flex';
        document.getElementById('driver-days').textContent = days;
        document.getElementById('driver-price').textContent = 'Rs ' + driverPrice.toLocaleString();
      } else {
        driverRow.style.display = 'none';
      }
      document.getElementById('total-amount').textContent = 'Rs ' + total.toLocaleString();
      document.getElementById('payment-amount').textContent = 'Rs ' + total.toLocaleString();
      const advance = Math.ceil(total / 2);
      const remaining = total - advance;
      document.getElementById('advance-amount').textContent = advance.toLocaleString();
      document.getElementById('remaining-amount').textContent = remaining.toLocaleString();
    }

    // View All Cars Toggle
    let showingAll = false;
    document.addEventListener('DOMContentLoaded', () => {
      const viewAllBtn = document.getElementById('view-all-btn');
      if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
          const hiddenCards = document.querySelectorAll('.car-card.hidden');
          const btn = document.getElementById('view-all-btn');
          const text = document.getElementById('view-all-text');

          if (!showingAll) {
            hiddenCards.forEach((card, i) => {
              setTimeout(() => {
                card.classList.remove('hidden');
                card.classList.add('car-card-reveal');
                card.style.animationDelay = i * 0.1 + 's';
              }, i * 100);
            });
            text.textContent = 'Show Less';
            btn.classList.add('active');
            showingAll = true;
            setTimeout(() => {
              document.querySelector('#cars').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, hiddenCards.length * 100);
          } else {
            const allCards = document.querySelectorAll('.car-card');
            allCards.forEach((card, i) => {
              if (i >= 6) {
                card.classList.add('hidden');
                card.classList.remove('car-card-reveal');
              }
            });
            text.textContent = 'View All Cars';
            btn.classList.remove('active');
            showingAll = false;
            document.querySelector('#cars').scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    });

    // Toggle Favorite
    const favorites = new Set(JSON.parse(localStorage.getItem('favorites') || '[]'));
    function toggleFavorite(e, carId) {
      e.stopPropagation();
      const icon = e.currentTarget.querySelector('i');
      const btn = e.currentTarget;

      if (favorites.has(carId)) {
        favorites.delete(carId);
        icon.className = 'far fa-heart';
        btn.classList.remove('active');
      } else {
        favorites.add(carId);
        icon.className = 'fas fa-heart';
        btn.classList.add('active');
        showToast('Added to favorites!');
      }
      localStorage.setItem('favorites', JSON.stringify([...favorites]));
    }

    // Load favorites on render
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        document.querySelectorAll('.car-favorite').forEach(btn => {
          const carId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
          if (favorites.has(carId)) {
            btn.querySelector('i').className = 'fas fa-heart';
            btn.classList.add('active');
          }
        });
      }, 500);
    });

    // Quick View (placeholder)
    function quickView(carId) {
      const car = carData.find(c => c.id === carId);
      if (!car) return;
      showToast(`Quick View: ${car.name} - Full modal coming soon!`);
    }

    // Book Car
    function bookCar(carId) {
      // Check if user is logged in
      const user = localStorage.getItem('carshare_user');
      if (!user) {
        if (confirm('Please login to book a car. Would you like to login now?')) {
          window.location.href = '#'; initLoginPage();
        }
        return;
      }

      const car = carData.find(c => c.id === carId);
      if (!car) return;
      selectedCar = car;
      document.getElementById('booking-modal').classList.add('active');
      document.getElementById('modal-car-details').innerHTML = `
    <div style="display:flex;align-items:center;gap:20px;margin-bottom:20px;padding:15px;background:var(--sec);border-radius:10px">
      <img src="${car.img}" alt="${car.name}" style="width:100px;height:80px;object-fit:cover;border-radius:8px">
      <div>
        <h3 style="margin:0">${car.name}</h3>
        <p style="margin:5px 0;color:#007bff;font-weight:bold">Rs ${car.price.toLocaleString()}/day</p>
      </div>
    </div>
  `;
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      document.getElementById('pickup-date').min = now.toISOString().slice(0, 16);
      document.getElementById('dropoff-date').min = now.toISOString().slice(0, 16);
    }

    // Check login status and update navbar
    function updateMainNav() {
      const user = JSON.parse(localStorage.getItem('carshare_user'));
      if (user) {
        const userName = user.email.split('@')[0];
        document.getElementById('logged-user-name').textContent = userName.charAt(0).toUpperCase() + userName.slice(1);
        document.getElementById('user-profile').style.display = 'block';
        document.getElementById('auth-links').style.display = 'none';
        document.getElementById('signup-link').style.display = 'none';
      } else {
        document.getElementById('user-profile').style.display = 'none';
        document.getElementById('auth-links').style.display = 'block';
        document.getElementById('signup-link').style.display = 'block';
      }
    }
    window.addEventListener('load', updateMainNav);

    // Initialize
    renderCars();

    /* ============================================================
       SINGLE-PAGE ROUTER — navigates between inner pages
       ============================================================ */
    function showPage(pageId) {
      document.querySelectorAll('.inner-page').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(pageId);
      if (target) { target.classList.add('active'); target.scrollTop = 0; }
    }
    function hidePage(pageId) {
      const el = document.getElementById(pageId);
      if (el) el.classList.remove('active');
    }
    function goHome() {
      document.querySelectorAll('.inner-page').forEach(p => p.classList.remove('active'));
      updateMainNav();
      window.scrollTo(0, 0);
    }

    // ──── LOGIN PAGE LOGIC ────
    function initLoginPage() {
      showPage('page-login');
      document.getElementById('login-error').classList.remove('show');
      document.getElementById('login-email').value = '';
      document.getElementById('login-password').value = '';
    }
    document.addEventListener('DOMContentLoaded', () => {
      // Password toggle
      document.getElementById('login-pwd-toggle').addEventListener('click', function () {
        const pwd = document.getElementById('login-password');
        if (pwd.type === 'password') { pwd.type = 'text'; this.classList.replace('fa-eye', 'fa-eye-slash'); }
        else { pwd.type = 'password'; this.classList.replace('fa-eye-slash', 'fa-eye'); }
      });
      // Login submit
      document.getElementById('login-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = document.getElementById('login-btn');
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const remember = document.getElementById('login-remember').checked;
        btn.classList.add('loading'); btn.disabled = true;
        setTimeout(() => {
          if (email === 'demo@carshare.pk' && password === 'demo123') {
            localStorage.setItem('carshare_user', JSON.stringify({ email, loginTime: new Date().toISOString(), remember }));
            btn.classList.remove('loading'); btn.disabled = false;
            hidePage('page-login');
            initRenterDashboard();
            updateMainNav();
          } else {
            document.getElementById('login-error').classList.add('show');
            btn.classList.remove('loading'); btn.disabled = false;
            setTimeout(() => document.getElementById('login-error').classList.remove('show'), 3000);
          }
        }, 1500);
      });
      // Forgot password
      document.getElementById('login-forgot').addEventListener('click', function (e) {
        e.preventDefault();
        alert('Password reset link will be sent to your email.\n\nFor demo: Use email: demo@carshare.pk and password: demo123');
      });
      // Social login (demo)
      document.querySelectorAll('.login-social-btn').forEach(btn => {
        btn.addEventListener('click', () => alert('Social login integration coming soon!'));
      });
    });

    // ──── SIGNUP PAGE LOGIC ────
    let suCurrentStep = 1, suAccountType = '', suFormData = {};
    function initSignupPage() {
      showPage('page-signup');
      suCurrentStep = 1; suAccountType = ''; suFormData = {};
      document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.su-step').forEach(s => { s.classList.remove('active', 'completed'); });
      document.querySelector('.step-content[data-step="1"]').classList.add('active');
      document.querySelector('.su-step[data-step="1"]').classList.add('active');
      document.getElementById('progress-bar').style.setProperty('--progress', '0%');
      document.querySelectorAll('.account-card').forEach(c => c.classList.remove('selected'));
      document.getElementById('su-next-btn-1').disabled = true;
    }
    document.addEventListener('DOMContentLoaded', () => {
      // Account type selection
      document.querySelectorAll('.account-card').forEach(card => {
        card.addEventListener('click', function () {
          document.querySelectorAll('.account-card').forEach(c => c.classList.remove('selected'));
          this.classList.add('selected');
          suAccountType = this.dataset.type;
          document.getElementById('su-next-btn-1').disabled = false;
        });
      });
      document.getElementById('su-next-btn-1').addEventListener('click', () => suNextStep());
      // OTP auto-focus
      document.querySelectorAll('.otp-digit').forEach((input, index) => {
        input.addEventListener('input', function () { if (this.value && index < 5) document.querySelectorAll('.otp-digit')[index + 1].focus(); });
        input.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && !this.value && index > 0) document.querySelectorAll('.otp-digit')[index - 1].focus(); });
      });
    });
    function suNextStep() {
      if (!suValidateStep(suCurrentStep)) return;
      document.querySelector(`.step-content[data-step="${suCurrentStep}"]`).classList.remove('active');
      document.querySelector(`.su-step[data-step="${suCurrentStep}"]`).classList.add('completed');
      document.querySelector(`.su-step[data-step="${suCurrentStep}"]`).classList.remove('active');
      suCurrentStep++;
      document.querySelector(`.step-content[data-step="${suCurrentStep}"]`).classList.add('active');
      document.querySelector(`.su-step[data-step="${suCurrentStep}"]`).classList.add('active');
      document.getElementById('progress-bar').style.setProperty('--progress', `${((suCurrentStep - 1) / 4) * 100}%`);
      if (suCurrentStep === 5) document.getElementById('su-phone-display').textContent = document.getElementById('su-phone').value;
    }
    function suPrevStep() {
      document.querySelector(`.step-content[data-step="${suCurrentStep}"]`).classList.remove('active');
      document.querySelector(`.su-step[data-step="${suCurrentStep}"]`).classList.remove('active');
      suCurrentStep--;
      document.querySelector(`.step-content[data-step="${suCurrentStep}"]`).classList.add('active');
      document.querySelector(`.su-step[data-step="${suCurrentStep}"]`).classList.remove('completed');
      document.querySelector(`.su-step[data-step="${suCurrentStep}"]`).classList.add('active');
      document.getElementById('progress-bar').style.setProperty('--progress', `${((suCurrentStep - 1) / 4) * 100}%`);
    }
    function suValidateStep(step) {
      if (step === 1) return suAccountType !== '';
      if (step === 2) {
        const fields = ['su-fullname', 'su-email', 'su-phone', 'su-password', 'su-confirm-password', 'su-dob'];
        for (let f of fields) { if (!document.getElementById(f).value) { alert('Please fill all required fields'); return false; } }
        if (document.getElementById('su-password').value !== document.getElementById('su-confirm-password').value) { alert('Passwords do not match'); return false; }
        return true;
      }
      if (step === 3) {
        const fields = ['su-street', 'su-city', 'su-province'];
        for (let f of fields) { if (!document.getElementById(f).value) { alert('Please fill all required fields'); return false; } }
        return true;
      }
      if (step === 4) return true;
      return true;
    }
    function suHandleFile(input, previewId) {
      const file = input.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { alert('File size must be less than 5MB'); input.value = ''; return; }
      const reader = new FileReader();
      reader.onload = function (e) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview"><span class="su-file-name">${file.name}</span><i class="fas fa-times su-file-remove" onclick="suRemoveFile('${input.id}','${previewId}')"></i>`;
        preview.classList.add('active');
        input.parentElement.querySelector('.su-file-upload-zone').classList.add('has-file');
      };
      reader.readAsDataURL(file);
    }
    function suRemoveFile(inputId, previewId) {
      document.getElementById(inputId).value = '';
      document.getElementById(previewId).classList.remove('active');
      document.getElementById(previewId).innerHTML = '';
      document.getElementById(inputId).parentElement.querySelector('.su-file-upload-zone').classList.remove('has-file');
    }
    function suResendOTP() { alert('OTP resent to your phone number'); }
    function suSubmitForm() {
      if (!document.getElementById('su-terms').checked || !document.getElementById('su-privacy').checked) { alert('Please accept Terms & Conditions and Privacy Policy'); return; }
      const otpValue = Array.from(document.querySelectorAll('.otp-digit')).map(i => i.value).join('');
      if (otpValue.length !== 6) { alert('Please enter the complete OTP'); return; }
      localStorage.setItem('carshare_signup', JSON.stringify({ accountType: suAccountType, email: document.getElementById('su-email').value, createdAt: new Date().toISOString() }));
      alert('✅ Account created successfully!\n\nPlease login with your credentials.');
      setTimeout(() => { hidePage('page-signup'); initLoginPage(); }, 1000);
    }

    // ──── RENTER DASHBOARD LOGIC ────
    function initRenterDashboard() {
      showPage('page-dashboard-renter');
      const user = JSON.parse(localStorage.getItem('carshare_user'));
      if (!user) { hidePage('page-dashboard-renter'); initLoginPage(); return; }
      const name = user.email.split('@')[0];
      document.getElementById('renter-user-name').textContent = name.charAt(0).toUpperCase() + name.slice(1);
      document.getElementById('renter-avatar').textContent = name.charAt(0).toUpperCase();
    }
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('renter-burger').addEventListener('click', () => document.getElementById('renter-sidebar').classList.toggle('active'));
      document.getElementById('renter-avatar').addEventListener('click', () => document.getElementById('renter-dropdown').classList.toggle('active'));
      document.addEventListener('click', e => { if (!e.target.closest('#renter-avatar')) document.getElementById('renter-dropdown').classList.remove('active'); });
    });
    function renterLogout() { if (confirm('Are you sure you want to logout?')) { localStorage.removeItem('carshare_user'); hidePage('page-dashboard-renter'); goHome(); } }

    // ──── OWNER DASHBOARD LOGIC ────
    function initOwnerDashboard() {
      showPage('page-dashboard-owner');
      const user = JSON.parse(localStorage.getItem('carshare_user'));
      if (!user) { hidePage('page-dashboard-owner'); initLoginPage(); return; }
      const name = user.email.split('@')[0];
      document.getElementById('owner-user-name').textContent = name.charAt(0).toUpperCase() + name.slice(1);
      document.getElementById('owner-avatar').textContent = name.charAt(0).toUpperCase();
    }
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('owner-burger').addEventListener('click', () => document.getElementById('owner-sidebar').classList.toggle('active'));
      document.getElementById('owner-avatar').addEventListener('click', () => document.getElementById('owner-dropdown').classList.toggle('active'));
      document.addEventListener('click', e => { if (!e.target.closest('#owner-avatar')) document.getElementById('owner-dropdown').classList.remove('active'); });
    });
    function ownerLogout() { if (confirm('Are you sure you want to logout?')) { localStorage.removeItem('carshare_user'); hidePage('page-dashboard-owner'); goHome(); } }
    function ownerApprove(name) { alert(`✅ Request from ${name} has been approved!`); }
    function ownerDecline(name) { if (confirm(`Decline request from ${name}?`)) alert(`❌ Request from ${name} has been declined.`); }

    // ──── PROFILE PAGE LOGIC ────
    let currentProfileDashboard = 'renter';
    function initProfilePage(fromDashboard) {
      currentProfileDashboard = fromDashboard || 'renter';
      showPage('page-profile');
      const user = JSON.parse(localStorage.getItem('carshare_user'));
      if (!user) { hidePage('page-profile'); initLoginPage(); return; }
      const name = user.email.split('@')[0];
      document.getElementById('prof-name').textContent = name.charAt(0).toUpperCase() + name.slice(1);
      document.getElementById('prof-email').textContent = user.email;
      document.getElementById('prof-avatar-small').textContent = name.charAt(0).toUpperCase();
      document.getElementById('prof-avatar-large').textContent = name.charAt(0).toUpperCase();
    }
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.prof-tab-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          document.querySelectorAll('.prof-tab-btn').forEach(b => b.classList.remove('active'));
          document.querySelectorAll('.prof-tab-content').forEach(c => c.classList.remove('active'));
          this.classList.add('active');
          document.getElementById(this.dataset.tab + '-tab').classList.add('active');
        });
      });
    });
    function profGoBack() { hidePage('page-profile'); if (currentProfileDashboard === 'owner') initOwnerDashboard(); else initRenterDashboard(); }

    // ──── NAVBAR LINK WIRING ────
    // Main website navbar links → inner pages (instead of href navigation)
    document.addEventListener('DOMContentLoaded', () => {
      // Login link
      document.getElementById('auth-links').querySelector('a').addEventListener('click', function (e) { e.preventDefault(); initLoginPage(); });
      // Signup link
      document.getElementById('signup-link').querySelector('a').addEventListener('click', function (e) { e.preventDefault(); initSignupPage(); });
      // User profile link (logged in state) → renter dashboard
      document.getElementById('user-profile').querySelector('a').addEventListener('click', function (e) { e.preventDefault(); initRenterDashboard(); });
    });

    // Patch bookCar to use in-page login
    const origBookCar = bookCar;
    bookCar = function (carId) {
      const user = localStorage.getItem('carshare_user');
      if (!user) {
        if (confirm('Please login to book a car. Would you like to login now?')) initLoginPage();
        return;
      }
      origBookCar(carId);
    };