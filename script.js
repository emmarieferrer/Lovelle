'use strict';

// 1. FUNCTION DECLARATION
function injectCoreStyles() {
    if (document.getElementById('core-styles')) return;
    const style = document.createElement('style');
    style.id = 'core-styles';
    style.textContent = `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeUp { 
            from { opacity: 0; transform: translateY(30px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-up { animation: fadeUp 0.8s ease; }

        /* Custom transition para sa Remove animation */
        .media-card.removing {
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
    `;
    document.head.appendChild(style);
}

// 2. IIFE (Self-Invoking Function)
(function() {
    
    injectCoreStyles(); 

    const Navbar = {
        init() {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('navMenu');
            if (hamburger && navMenu) {
                hamburger.addEventListener('click', () => {
                    navMenu.classList.toggle('hidden');
                    navMenu.classList.toggle('flex');
                    navMenu.classList.toggle('flex-col');
                    navMenu.classList.toggle('absolute');
                    navMenu.classList.toggle('top-full'); 
                    navMenu.classList.toggle('left-0');
                    navMenu.classList.toggle('right-0');
                    navMenu.classList.toggle('bg-[#16161d]');
                    navMenu.classList.toggle('p-6');
                    navMenu.classList.toggle('shadow-xl');
                    navMenu.classList.toggle('border-b');
                    navMenu.classList.toggle('border-[#2a2a35]');
                    navMenu.classList.toggle('rounded-b-xl');

                    const icon = hamburger.querySelector('i');
                    if (navMenu.classList.contains('hidden')) {
                        icon.classList.replace('fa-xmark', 'fa-bars');
                    } else {
                        icon.classList.replace('fa-bars', 'fa-xmark');
                    }
                });
            }
        }
    };

    const HeroCarousel = {
        current: 0,
        timer: null,
        AUTO_DELAY: 6000,

        init() {
            this.slides = document.querySelectorAll('.hero-slide');
            this.dots = document.querySelectorAll('.carousel-dots .dot');
            if (this.slides.length === 0) return;

            this.prevBtn = document.querySelector('.carousel-arrow.prev');
            this.nextBtn = document.querySelector('.carousel-arrow.next');

            this.slides.forEach(slide => {
                const bg = slide.dataset.bg;
                if (bg) {
                    slide.style.backgroundImage = `url('${bg}')`;
                    slide.style.backgroundSize = 'cover';
                    slide.style.backgroundPosition = 'center';
                }
                slide.style.position = 'absolute';
                slide.style.inset = '0';
                slide.style.zIndex = '10';
                slide.style.pointerEvents = 'none';
            });

            this.showSlide(0);
            this.startAuto();

            if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.next(); this.startAuto(); });
            if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.prev(); this.startAuto(); });
            this.dots.forEach((dot, i) => {
                dot.addEventListener('click', () => { this.showSlide(i); this.startAuto(); });
            });
        },

        showSlide(index) {
            this.slides.forEach((s, i) => {
                if (i === index) {
                    s.style.visibility = 'visible';
                    s.style.zIndex = '20';
                    s.style.pointerEvents = 'auto';
                    
                    void s.offsetWidth;
                    
                    setTimeout(() => {
                        s.style.opacity = '1';
                    }, 20);
                } else {
                    s.style.opacity = '0';
                    s.style.zIndex = '10';
                    s.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        if (s.style.opacity === '0') {
                            s.style.visibility = 'hidden';
                        }
                    }, 800);
                }
            });

            this.dots.forEach((d, i) => {
                if (i === index) {
                    d.style.backgroundColor = '#e50914';
                    d.style.width = '2rem';
                    d.style.borderRadius = '9999px';
                    d.style.boxShadow = '0 0 12px rgba(229, 9, 20, 0.7)';
                } else {
                    d.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                    d.style.width = '0.625rem';
                    d.style.borderRadius = '9999px';
                    d.style.boxShadow = 'none';
                }
            });
            this.current = index;
        },

        next() { this.showSlide((this.current + 1) % this.slides.length); },
        prev() { this.showSlide((this.current - 1 + this.slides.length) % this.slides.length); },
        startAuto() {
            clearInterval(this.timer);
            this.timer = setInterval(() => this.next(), this.AUTO_DELAY);
        }
    };

    const RowCarousel = {
        init() {
            document.querySelectorAll('.carousel-row').forEach(row => {
                row.style.display = 'flex';
                row.style.gap = '1.5rem';
                row.style.overflowX = 'auto';
                row.style.scrollBehavior = 'smooth';
                row.style.paddingBottom = '0.5rem';
                row.style.scrollSnapType = 'x mandatory';
                row.classList.add('no-scrollbar');

                const updateCardWidths = () => {
                    const cards = row.querySelectorAll('.media-card');
                    let flexBasis = 'calc((100% - 1.5rem) / 2)';
                    if (window.innerWidth >= 1280) flexBasis = 'calc((100% - 7.5rem) / 5)';
                    else if (window.innerWidth >= 1024) flexBasis = 'calc((100% - 4.5rem) / 4)';
                    else if (window.innerWidth >= 768) flexBasis = 'calc((100% - 3rem) / 3)';
                    cards.forEach(card => {
                        card.style.flex = `0 0 ${flexBasis}`;
                        card.style.scrollSnapAlign = 'start';
                    });
                };
                updateCardWidths();
                window.addEventListener('resize', updateCardWidths);
            });

            document.querySelectorAll('.row-arrow').forEach(arrow => {
                arrow.addEventListener('click', () => {
                    const row = document.getElementById(arrow.dataset.target);
                    if (!row) return;
                    const card = row.querySelector('.media-card');
                    if (!card) return;
                    const gap = parseFloat(window.getComputedStyle(row).gap) || 24;
                    const step = card.offsetWidth + gap;
                    const direction = arrow.classList.contains('next') ? 1 : -1;
                    row.scrollBy({ left: step * direction, behavior: 'smooth' });
                });
            });
        }
    };

    const SearchFilter = {
        activeGenre: 'all',
        searchQuery: '',

        init() {
            const input = document.getElementById('searchInput');
            const genreBtns = document.querySelectorAll('.genre-btn');
            const cards = document.querySelectorAll('#mediaGrid .media-card');
            const emptyState = document.getElementById('emptyState');
            if (cards.length === 0) return;

            const updateActiveButton = (genre) => {
                genreBtns.forEach(b => {
                    const isActive = b.dataset.genre === genre;
                    b.style.backgroundColor = isActive ? '#e50914' : '';
                    b.style.color = isActive ? '#ffffff' : '';
                    b.style.borderColor = isActive ? '#e50914' : '';
                });
            };

            const applyFilter = () => {
                let visibleCount = 0;
                cards.forEach(card => {
                    const title = (card.dataset.title || '').toLowerCase();
                    const genres = (card.dataset.genre || '').toLowerCase();
                    const matchesSearch = !this.searchQuery || title.includes(this.searchQuery);
                    const matchesGenre = this.activeGenre === 'all' || genres.includes(this.activeGenre);
                    if (matchesSearch && matchesGenre) {
                        card.style.display = '';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });
                if (emptyState) emptyState.classList.toggle('hidden', visibleCount > 0);
            };

            updateActiveButton('all');

            if (input) {
                input.addEventListener('input', (e) => {
                    this.searchQuery = e.target.value.toLowerCase().trim();
                    applyFilter();
                });
            }

            genreBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    updateActiveButton(btn.dataset.genre);
                    this.activeGenre = btn.dataset.genre;
                    applyFilter();
                });
            });
        }
    };

    // --- MY LIST STORAGE MODULE ---
    const MyList = {
        STORAGE_KEY: 'lovelleMyList',

        get() {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        },

        save(list) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
        },

        add(cardData, buttonEl) {
            const list = this.get();
            const exists = list.find(item => item.title === cardData.title);

            if (exists) {
                if (buttonEl) {
                    buttonEl.innerHTML = `<i class="fa-solid fa-check"></i> Already in List`;
                    buttonEl.classList.add('bg-green-600/40');
                }
                return;
            }

            list.push(cardData);
            this.save(list);

            if (buttonEl) {
                buttonEl.innerHTML = `<i class="fa-solid fa-check"></i> Added to List`;
                buttonEl.classList.add('bg-green-600/40');
            }
        },

        remove(title) {
            let list = this.get();
            list = list.filter(item => item.title !== title);
            this.save(list);
        },

        bindHeroButtons() {
            document.querySelectorAll('.hero-slide .add-to-list-btn').forEach(btn => {
                if (btn.dataset.bound === 'true') return;
                btn.dataset.bound = 'true';

                const title = btn.dataset.title;
                if (title) {
                    const list = this.get();
                    const exists = list.find(item => item.title === title);
                    if (exists) {
                        btn.innerHTML = `<i class="fa-solid fa-check"></i> Already in List`;
                        btn.classList.add('bg-green-600/40');
                    }
                }

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const cardData = {
                        title: btn.dataset.title || '',
                        genre: btn.dataset.genre || '',
                        year: btn.dataset.year || '',
                        duration: btn.dataset.duration || '',
                        rating: btn.dataset.rating || '',
                        img: btn.dataset.img || '',
                        desc: btn.dataset.desc || '',
                        cast: btn.dataset.cast || ''
                    };
                    
                    if (cardData.title) {
                        this.add(cardData, btn);
                    }
                });
            });
        },

        render() {
            const grid = document.getElementById('myListGrid');
            const emptyState = document.getElementById('listEmpty');
            if (!grid) return;

            const list = this.get();

            if (list.length === 0) {
                grid.innerHTML = '';
                grid.classList.add('hidden');
                if (emptyState) emptyState.classList.remove('hidden');
                return;
            }

            grid.classList.remove('hidden');
            if (emptyState) emptyState.classList.add('hidden');

            grid.innerHTML = list.map(item => `
                <div class="media-card group relative cursor-pointer transition-transform hover:-translate-y-1.5" 
                     data-title="${item.title}" data-genre="${item.genre}" data-year="${item.year}" 
                     data-duration="${item.duration}" data-rating="${item.rating}" data-img="${item.img}" 
                     data-desc="${item.desc}" data-cast="${item.cast}">
                    <div class="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#16161d]">
                        <img src="${item.img}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <span class="absolute top-2.5 right-2.5 bg-black/75 text-[#ffb400] text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                            <i class="fa-solid fa-star"></i> ${item.rating}
                        </span>
                        <button class="remove-btn absolute top-2.5 left-2.5 z-10 w-9 h-9 rounded-full bg-black/75 text-white flex items-center justify-center backdrop-blur-sm hover:bg-[#e50914] transition" data-title="${item.title}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                    <div class="p-3">
                        <h3 class="text-base font-semibold truncate">${item.title}</h3>
                        <p class="text-[0.85rem] text-gray-500">${item.year} · Rom-Com</p>
                    </div>
                </div>
            `).join('');

            grid.querySelectorAll('.media-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-btn')) return;
                    const modalOverlay = document.getElementById('mediaModal');
                    if (modalOverlay) Modal.openForCard(card, modalOverlay);
                });
            });

            grid.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const card = btn.closest('.media-card');
                    const title = btn.dataset.title;
                    
                    card.classList.add('removing');
                    setTimeout(() => {
                        MyList.remove(title);
                        MyList.render();
                    }, 400);
                });
            });
        }
    };

    const Modal = {
        init() {
            const overlay = document.getElementById('mediaModal');
            if (!overlay) return;

            // Modal card click listeners
            document.querySelectorAll('.media-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-btn')) return;
                    this.openForCard(card, overlay);
                });
            });

            // Close events
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay || e.target.closest('.modal-close')) this.close(overlay);
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.close(overlay);
            });

            // I-bind ang modal's "+ My List" button ONCE. 
            // Ang click handler nito ay gumagamit ng `this.currentCardData` na naka-set sa openForCard().
            const modalBtn = overlay.querySelector('.add-to-list-btn');
            if (modalBtn) {
                modalBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.currentCardData) {
                        MyList.add(this.currentCardData, modalBtn);
                    }
                });
            }
        },

        openForCard(card, overlay) {
            const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            
            this.currentCardData = {
                title: card.dataset.title || '',
                genre: card.dataset.genre || '',
                year: card.dataset.year || '',
                duration: card.dataset.duration || '',
                rating: card.dataset.rating || '',
                img: card.dataset.img || '',
                desc: card.dataset.desc || '',
                cast: card.dataset.cast || ''
            };

            const imgEl = document.getElementById('modalImg');
            if(imgEl) imgEl.src = this.currentCardData.img;
            
            setVal('modalTitle', this.currentCardData.title);
            setVal('modalYear', this.currentCardData.year);
            setVal('modalDuration', this.currentCardData.duration);
            setVal('modalDesc', this.currentCardData.desc);
            
            const ratingEl = document.getElementById('modalRating');
            if(ratingEl) ratingEl.innerHTML = `<i class="fa-solid fa-star"></i> ${this.currentCardData.rating || 'N/A'}`;

            const castEl = document.getElementById('modalCast');
            if (castEl) {
                if (this.currentCardData.cast) {
                    castEl.innerHTML = `<strong>Cast:</strong> ${this.currentCardData.cast}`;
                    castEl.style.display = 'block';
                } else {
                    castEl.style.display = 'none';
                }
            }

            const genresEl = document.getElementById('modalGenres');
            if(genresEl) {
                genresEl.innerHTML = (this.currentCardData.genre || '').split(',').map(g => g.trim()).filter(g => g)
                    .map(g => `<span class="px-3 py-1 bg-[#16161d] rounded-xl text-xs text-white border border-[#2a2a35]">${g}</span>`).join('');
            }


            const modalBtn = overlay.querySelector('.add-to-list-btn');
            if (modalBtn) {
                const list = MyList.get();
                const exists = list.find(item => item.title === this.currentCardData.title);
                if (exists) {
                    modalBtn.innerHTML = `<i class="fa-solid fa-check"></i> Already in List`;
                    modalBtn.classList.add('bg-green-600/40');
                } else {
                    modalBtn.innerHTML = `<i class="fa-solid fa-plus"></i> My List`;
                    modalBtn.classList.remove('bg-green-600/40');
                }
            }

            overlay.classList.remove('invisible', 'opacity-0');
            overlay.classList.add('visible', 'opacity-100');
            
            const modalBox = overlay.querySelector('.modal-box');
            if (modalBox) {
                modalBox.classList.remove('scale-90');
                modalBox.classList.add('scale-100');
            }
            document.body.style.overflow = 'hidden';
        },

        close(overlay) {
            overlay.classList.add('invisible', 'opacity-0');
            overlay.classList.remove('visible', 'opacity-100');
            const modalBox = overlay.querySelector('.modal-box');
            if (modalBox) {
                modalBox.classList.add('scale-90');
                modalBox.classList.remove('scale-100');
            }
            document.body.style.overflow = '';
        }
    };

    const RemoveItem = {
        init() {
            const removeBtns = document.querySelectorAll('.remove-btn');
            if (removeBtns.length === 0) return;

            const grid = document.getElementById('myListGrid');
            const emptyState = document.getElementById('listEmpty');

            if (grid && grid.children.length === 0) {
                grid.classList.add('hidden');
                if (emptyState) emptyState.classList.remove('hidden');
            }

            removeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    const card = btn.closest('.media-card');
                    if (!card) return;

                    const title = card.dataset.title;
                    card.classList.add('removing');

                    setTimeout(() => {
                        card.remove();
                        if (title) MyList.remove(title);
                        
                        if (grid && grid.children.length === 0) {
                            grid.classList.add('hidden');
                            if (emptyState) emptyState.classList.remove('hidden');
                        }
                    }, 400);
                });
            });
        }
    };

    const Accordion = {
        init() {
            document.querySelectorAll('.accordion-header').forEach(header => {
                header.addEventListener('click', () => {
                    const item = header.closest('.accordion-item');
                    const body = item.querySelector('.accordion-body');
                    const isOpen = item.classList.contains('open');

                    document.querySelectorAll('.accordion-item').forEach(i => {
                        i.classList.remove('open');
                        i.querySelector('.accordion-body').style.maxHeight = null;
                        i.querySelector('.accordion-header i').style.transform = '';
                    });

                    if (!isOpen) {
                        item.classList.add('open');
                        body.style.maxHeight = body.scrollHeight + 'px';
                        header.querySelector('i').style.transform = 'rotate(180deg)';
                    }
                });
            });
        }
    };

    const ContactForm = {
        RULES: [
            { id: 'fullName', test: v => v.trim().length >= 2 },
            { id: 'email', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
            { id: 'subject', test: v => v.trim().length >= 3 },
            { id: 'message', test: v => v.trim().length >= 10 }
        ],

        init() {
            const form = document.getElementById('contactForm');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let valid = true;

                this.RULES.forEach(rule => {
                    const input = document.getElementById(rule.id);
                    if (!input) return;
                    const group = input.closest('.form-group');
                    const error = group ? group.querySelector('.error-msg') : null;
                    const isValid = rule.test(input.value);

                    if (group) group.classList.toggle('has-error', !isValid);
                    if (error) error.classList.toggle('hidden', isValid);
                    input.classList.toggle('border-red-500', !isValid);
                    input.classList.toggle('border-[#2a2a35]', isValid);

                    if (!isValid) valid = false;
                });

                if (valid) {
                    const success = document.getElementById('formSuccess');
                    if (success) {
                        success.classList.remove('hidden');
                        setTimeout(() => success.classList.add('hidden'), 5000);
                    }
                    form.reset();
                }
            });

            form.querySelectorAll('input, textarea').forEach(el => {
                el.addEventListener('input', () => {
                    el.classList.remove('border-red-500');
                    el.classList.add('border-[#2a2a35]');
                    const group = el.closest('.form-group');
                    if (group) {
                        group.classList.remove('has-error');
                        const error = group.querySelector('.error-msg');
                        if (error) error.classList.add('hidden');
                    }
                });
            });
        }
    };

    const App = {
        modules: [Navbar, HeroCarousel, RowCarousel, SearchFilter, MyList, Modal, RemoveItem, Accordion, ContactForm],
        init() {
            this.modules.forEach(m => {
                if (m && typeof m.init === 'function') m.init();
            });
            MyList.render();
            MyList.bindHeroButtons(); 
        }
    };

    App.init();

})();