// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor with Liquid Trail
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// Particle Trail System
class CursorParticle {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = 1;
        this.decay = 0.02;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95; // Friction
        this.vy *= 0.95;
        this.life -= this.decay;
    }

    draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(0, 102, 255, ${this.life})`);
        gradient.addColorStop(0.5, `rgba(77, 148, 255, ${this.life * 0.5})`);
        gradient.addColorStop(1, `rgba(0, 191, 255, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
let lastMouseX = 0;
let lastMouseY = 0;

// Create canvas for particle trail
const trailCanvas = document.createElement('canvas');
trailCanvas.style.position = 'fixed';
trailCanvas.style.top = '0';
trailCanvas.style.left = '0';
trailCanvas.style.width = '100%';
trailCanvas.style.height = '100%';
trailCanvas.style.pointerEvents = 'none';
trailCanvas.style.zIndex = '9998';
document.body.appendChild(trailCanvas);

const ctx = trailCanvas.getContext('2d');
trailCanvas.width = window.innerWidth;
trailCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
});

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });

        // Create particles based on velocity
        const vx = (posX - lastMouseX) * 0.1;
        const vy = (posY - lastMouseY) * 0.1;
        const speed = Math.sqrt(vx * vx + vy * vy);

        if (speed > 0.5) {
            for (let i = 0; i < 2; i++) {
                particles.push(new CursorParticle(
                    posX + (Math.random() - 0.5) * 10,
                    posY + (Math.random() - 0.5) * 10,
                    -vx + (Math.random() - 0.5) * 2,
                    -vy + (Math.random() - 0.5) * 2
                ));
            }
        }

        lastMouseX = posX;
        lastMouseY = posY;
    });

    // Navigation Hover Effect
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        link.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
}

// Animate particles
function animateParticles() {
    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateParticles);
}

animateParticles();


// Hero Text Animation
const heroLines = document.querySelectorAll('.hero-title .line');
if (heroLines.length > 0) {
    gsap.from(heroLines, {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.5
    });
}

gsap.from('.hero-desc', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    delay: 1.2
});

// Advanced Scroll Animations with Directional Reveals
// Service Cards - Animations disabled per user request
// gsap.from('.service-card', {
//     scrollTrigger: {
//         trigger: '.services-grid',
//         start: "top 80%",
//         toggleActions: "play none none reverse"
//     },
//     y: 100,
//     opacity: 0,
//     duration: 0.8,
//     stagger: 0.2,
//     ease: "power3.out"
// });


// Team Cards - Slide in from alternating sides
const teamCards = document.querySelectorAll('.member-card');
teamCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });
});

// Process Steps - Slide in from left
gsap.from('.timeline-step', {
    scrollTrigger: {
        trigger: '.process-timeline',
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    x: -100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.3,
    ease: "power3.out"
});

// Section Headers - Fade in
gsap.from('.section-header', {
    scrollTrigger: {
        trigger: '.section-header',
        start: "top 85%",
        toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

// Parallax Effect for Process Image
gsap.to('.process-image', {
    scrollTrigger: {
        trigger: '.process-image',
        start: "top bottom",
        end: "bottom top",
        scrub: 1
    },
    y: -50,
    ease: "none"
});

// Button Micro-interactions
// Ripple Effect on Click
document.querySelectorAll('.btn-cta, .obsidian-btn').forEach(button => {
    button.addEventListener('click', function (e) {
        this.classList.remove('ripple');
        void this.offsetWidth; // Trigger reflow
        this.classList.add('ripple');

        setTimeout(() => {
            this.classList.remove('ripple');
        }, 600);
    });
});

// Magnetic Attraction to Buttons
const buttons = document.querySelectorAll('.btn-cta, .nav-link');
buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0) scale(1)';
    });
});

// Enhanced Navigation Scroll Behavior
const nav = document.querySelector('.glass-nav');
let lastScrollY = window.scrollY;
let ticking = false;

function updateNav() {
    const scrollY = window.scrollY;

    // Add scrolled class when scrolled past 100px
    if (scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (scrollY > lastScrollY && scrollY > 200) {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
    }
});

// Active Link Tracking
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link:not(.btn-cta)');

function setActiveLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);
setActiveLink(); // Set initial active link


// Service Cards - Magnetic Hover & 3D Tilt Effect
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    let bounds;

    card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
        if (!bounds) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;
        const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
        };
        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

        // 3D Tilt Effect
        const rotateX = (center.y / bounds.height) * -15; // Max 15deg tilt
        const rotateY = (center.x / bounds.width) * 15;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-10px)
            scale(1.02)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `
            perspective(1000px)
            rotateX(0deg)
            rotateY(0deg)
            translateY(0)
            scale(1)
        `;
        bounds = null;
    });
});


// Smooth Scroll (Lenis)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Three.js Hyper-Complex Ferrofluid Storm
const container = document.getElementById('hero-canvas-container');

if (container) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); // Antialias off for post-processing
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- PARTICLES ---
    const particleCount = 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const randomness = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Initial random positions in a sphere
        const r = 40 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        scales[i] = Math.random();
        randomness[i3] = (Math.random() - 0.5);
        randomness[i3 + 1] = (Math.random() - 0.5);
        randomness[i3 + 2] = (Math.random() - 0.5);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

    // Custom Shader Material for GPU-based movement
    const material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms: {
            uTime: { value: 0 },
            uSize: { value: 8.0 * renderer.getPixelRatio() },
            uMouse: { value: new THREE.Vector3(0, 0, 0) }
        },
        vertexShader: `
            uniform float uTime;
            uniform float uSize;
            uniform vec3 uMouse;
            attribute float aScale;
            attribute vec3 aRandomness;
            varying vec3 vColor;

            // Simplex Noise Function
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute( permute( permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857;
                vec3  ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                
                // Noise Movement
                float noise = snoise(vec3(modelPosition.x * 0.05, modelPosition.y * 0.05, uTime * 0.2));
                vec3 noiseOffset = aRandomness * noise * 5.0;
                modelPosition.xyz += noiseOffset;

                // Mouse Repulsion
                float dist = distance(modelPosition.xyz, uMouse);
                float force = smoothstep(20.0, 0.0, dist);
                vec3 dir = normalize(modelPosition.xyz - uMouse);
                modelPosition.xyz += dir * force * 15.0;

                // Rotation
                float angle = uTime * 0.1;
                mat2 rotate = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                modelPosition.xz = rotate * modelPosition.xz;

                vec4 viewPosition = viewMatrix * modelPosition;
                gl_Position = projectionMatrix * viewPosition;

                gl_PointSize = uSize * aScale;
                gl_PointSize *= (1.0 / -viewPosition.z);

                // Color based on distance/noise
                vec3 color1 = vec3(0.0, 0.4, 1.0); // Blue
                vec3 color2 = vec3(1.0, 1.0, 1.0); // White
                vColor = mix(color1, color2, noise * 0.5 + 0.5);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;

            void main() {
                // Circular particle
                float strength = distance(gl_PointCoord, vec2(0.5));
                strength = 1.0 - strength;
                strength = pow(strength, 5.0);

                vec3 finalColor = mix(vec3(0.0), vColor, strength);
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- POST PROCESSING ---
    const composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Bloom Pass (Glow)
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // Strength
        0.4, // Radius
        0.85 // Threshold
    );
    composer.addPass(bloomPass);

    // Mouse Interaction
    const mouse = new THREE.Vector3(0, 0, 0);
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        // Map mouse to 3D space approx
        mouse.x = (event.clientX - windowHalfX) * 0.05;
        mouse.y = -(event.clientY - windowHalfY) * 0.05;
        mouse.z = 0;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        material.uniforms.uTime.value = elapsedTime;
        material.uniforms.uMouse.value.lerp(mouse, 0.1); // Smooth mouse

        composer.render();
    }

    animate();

    // Parallax Effect for Hero Particles
    let scrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Update particle position based on scroll in animation loop
    const originalAnimate = animate;
    function animateWithParallax() {
        requestAnimationFrame(animateWithParallax);
        const elapsedTime = clock.getElapsedTime();

        material.uniforms.uTime.value = elapsedTime;
        material.uniforms.uMouse.value.lerp(mouse, 0.1); // Smooth mouse

        // Parallax effect - move particles slower than scroll
        particles.position.y = scrollY * 0.0005;
        particles.rotation.y = scrollY * 0.0001;

        composer.render();
    }

    // Replace original animate with parallax version
    animateWithParallax();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        composer.setSize(container.clientWidth, container.clientHeight);
    });
}
