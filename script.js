document.addEventListener('DOMContentLoaded', () => {
    // --- Particle Animation (bez zmien) ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d'); let particles = [];
        const setupCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        class Particle {
            constructor(x, y) { this.x = x; this.y = y; this.size = Math.random() * 2 + 1; this.speedX = Math.random() * 1 - 0.5; this.speedY = Math.random() * 1 - 0.5; this.color = 'rgba(255, 193, 7, 0.7)'; }
            update() { this.x += this.speedX; this.y += this.speedY; if (this.size > 0.1) this.size -= 0.01; }
            draw() { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
        }
        const initParticles = () => { particles = []; const num = (canvas.width * canvas.height) / 9000; for (let i = 0; i < num; i++) { particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height)); } };
        const animateParticles = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); for (let i = 0; i < particles.length; i++) { particles[i].update(); particles[i].draw(); if (particles[i].size <= 0.1) { particles.splice(i, 1); i--; particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height)); } } requestAnimationFrame(animateParticles); };
        setupCanvas(); initParticles(); animateParticles(); window.addEventListener('resize', () => { setupCanvas(); initParticles(); });
    }
    
    // --- Services Section Top Stars (rovnaký štýl ako hero) ---
    const servicesCanvas = document.getElementById('services-particle-canvas');
    if (servicesCanvas) {
        const sctx = servicesCanvas.getContext('2d');
        let sparticles = [];
        const STAR_BAND_HEIGHT = 360; // zodpovedá CSS výške
        const setupServicesCanvas = () => {
            servicesCanvas.width = window.innerWidth;
            servicesCanvas.height = STAR_BAND_HEIGHT;
        };
        class SParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = 'rgba(255, 193, 7, 0.7)'; // rovnaká farba ako v hero
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.1) this.size -= 0.01;
                // wrap v rámci pásu
                if (this.x < -5) this.x = servicesCanvas.width + 5;
                if (this.x > servicesCanvas.width + 5) this.x = -5;
                if (this.y < -5) this.y = STAR_BAND_HEIGHT + 5;
                if (this.y > STAR_BAND_HEIGHT + 5) this.y = -5;
            }
            draw() {
                sctx.fillStyle = this.color;
                sctx.beginPath();
                sctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                sctx.fill();
            }
        }
        const initSParticles = () => {
            sparticles = [];
            const num = (servicesCanvas.width * servicesCanvas.height) / 9000;
            for (let i = 0; i < num; i++) {
                sparticles.push(
                    new SParticle(
                        Math.random() * servicesCanvas.width,
                        Math.random() * STAR_BAND_HEIGHT
                    )
                );
            }
        };
        const animateSParticles = () => {
            sctx.clearRect(0, 0, servicesCanvas.width, servicesCanvas.height);
            for (let i = 0; i < sparticles.length; i++) {
                sparticles[i].update();
                sparticles[i].draw();
                if (sparticles[i].size <= 0.1) {
                    sparticles.splice(i, 1); i--;
                    sparticles.push(
                        new SParticle(
                            Math.random() * servicesCanvas.width,
                            Math.random() * STAR_BAND_HEIGHT
                        )
                    );
                }
            }
            requestAnimationFrame(animateSParticles);
        };
        setupServicesCanvas();
        initSParticles();
        animateSParticles();
        window.addEventListener('resize', () => { setupServicesCanvas(); initSParticles(); });
    }
    
    // --- Header on Scroll (stabilizovaný bez preblikávania) ---
    const header = document.getElementById('main-header');
    let isScrolled = false;
    let ticking = false;
    const ENTER_THRESHOLD = 80; // kedy začať "scrolled"
    const EXIT_THRESHOLD = 40;  // kedy skončiť "scrolled"
  
    const setHeaderHeightVar = () => {
        const h = header ? header.offsetHeight : 0;
        document.documentElement.style.setProperty('--header-height', h + 'px');
    };
  
    setHeaderHeightVar();
    const heroArrow = document.querySelector('.hero-arrow');
    if (heroArrow) {
        heroArrow.classList.toggle('is-hidden', window.scrollY > 10);
    }
    window.addEventListener('resize', setHeaderHeightVar);
  
    const applyHeaderState = (nextState) => {
        if (nextState === isScrolled) return;
        isScrolled = nextState;
        header.classList.toggle('scrolled', isScrolled);
        setHeaderHeightVar(); // okamžite, bez oneskorenia
    };

    applyHeaderState(window.scrollY >= ENTER_THRESHOLD);
  
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        let next = isScrolled;
        if (!isScrolled && y >= ENTER_THRESHOLD) next = true;
        else if (isScrolled && y <= EXIT_THRESHOLD) next = false;
  
        if (heroArrow) {
            heroArrow.classList.toggle('is-hidden', y > 10);
        }
        if (next !== isScrolled && !ticking) {
            ticking = true;
            window.requestAnimationFrame(() => {
                applyHeaderState(next);
                ticking = false;
            });
        }
    }, { passive: true });

    // --- Generic Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));

    // --- Odstránenie fade-in-up triedy po skončení animácie pre hero button ---
    const heroButton = document.querySelector('#hero .cta-button-main.fade-in-up');
    if (heroButton) {
        heroButton.addEventListener('animationend', () => {
            heroButton.classList.remove('fade-in-up');
        });
    }

    // --- TÍM: Scrollytelling Logic ---
    const teamBios = document.querySelectorAll('.team-member-bio');
    const teamImages = document.querySelectorAll('.team-image');
    if (teamBios.length > 0 && teamImages.length > 0) {
        const teamObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Zvýraznenie aktívneho textu
                    teamBios.forEach(bio => bio.classList.remove('is-active-bio'));
                    entry.target.classList.add('is-active-bio');
                    
                    // Zmena aktívneho obrázku
                    const imageId = entry.target.dataset.imageId;
                    teamImages.forEach(img => img.classList.remove('is-active'));
                    const activeImage = document.getElementById(imageId);
                    if (activeImage) activeImage.classList.add('is-active');
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 }); 
        teamBios.forEach(bio => teamObserver.observe(bio));
    }
});


