// --- 1. SMOOTH SCROLL (LENIS) ---
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

// --- 2. CUSTOM CURSOR ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with delay
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Hover effects
document.querySelectorAll('a, button, .bento-item, .team-member').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// --- 3. THREE.JS IRIDESCENT OIL BACKGROUND ---
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Geometry
const geometry = new THREE.PlaneGeometry(20, 20, 256, 256);

// Custom Shader Material
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;
        uniform vec2 uMouse;

        void main() {
            vUv = uv;
            vec3 pos = position;
            
            float dist = distance(uv, uMouse);
            
            // Complex wave pattern
            float elevation = sin(pos.x * 3.0 + uTime * 0.5) * 0.3 
                            + sin(pos.y * 2.0 + uTime * 0.3) * 0.3
                            + sin((pos.x + pos.y) * 4.0 + uTime * 0.8) * 0.1;
            
            // Mouse interaction
            float interaction = sin(dist * 10.0 - uTime * 2.0) * 0.1 * exp(-dist * 2.0);
            
            pos.z += elevation + interaction;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float uTime;

        void main() {
            // Brand Color Palette (Deep Blue & Black)
            vec3 color1 = vec3(0.02, 0.02, 0.05); // Almost Black Blue
            vec3 color2 = vec3(0.0, 0.1, 0.4);   // Deep Brand Blue
            vec3 color3 = vec3(0.0, 0.3, 0.8);   // Vibrant Blue Highlight
            
            float mixStrength = vElevation * 2.0 + 0.5;
            
            // Base gradient
            vec3 finalColor = mix(color1, color2, vUv.y + sin(uTime * 0.1) * 0.2);
            
            // Add dynamic blue highlights based on elevation
            float shine = smoothstep(0.3, 0.8, vElevation);
            finalColor = mix(finalColor, color3, shine * 0.6);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `,
    transparent: true
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 4;

// Mouse Interaction
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / window.innerWidth;
    mouse.y = 1.0 - (event.clientY / window.innerHeight);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;
    material.uniforms.uMouse.value.lerp(mouse, 0.05);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

// --- 4. GSAP ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

// Hero Reveal
const tl = gsap.timeline();
tl.to('.hero-title .line', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.1,
    ease: "power4.out"
})
    .to('.hero-desc', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, "-=0.5")
    .to('.hero-actions', {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, "-=0.6");

// Simple Fade In for Sections
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
    });
});

// Contact Reveal
gsap.from('.contact-wrapper', {
    scrollTrigger: {
        trigger: '#contact',
        start: "top 70%"
    },
    y: 50,
    opacity: 0,
    duration: 1
});
