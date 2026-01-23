// ==========================================
// OSCAR 3D - Three.js Module
// Full Hero Background with Scroll Animation
// ==========================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Oscar3D {
    constructor() {
        this.canvas = document.getElementById('oscar-3d-canvas');
        if (!this.canvas) return;

        this.container = document.getElementById('oscar-statue');
        if (!this.container) return;

        // Scene setup - transparent to show CSS background
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            40,
            this.container.offsetWidth / this.container.offsetHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        this.camera.position.y = 0;

        // Renderer with transparency
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 2.8;

        // Lighting
        this.setupLights();

        // Model
        this.model = null;
        this.modelGroup = null;
        this.loadModel();

        // Smooth animation parameters
        this.scrollProgress = 0;
        this.targetScrollProgress = 0;
        this.scrollRotation = 0;
        this.targetRotation = 0;

        // Detect mobile
        this.isMobile = window.innerWidth <= 768;

        // Position based on device
        if (this.isMobile) {
            // Mobile: slightly right, lower, closer
            this.initialX = 0.3;      // Slightly right (not centered)
            this.initialY = -1.0;     // Lower (~100px down)
            this.initialZ = 2.5;      // Closer (bigger)
            this.targetX = 0.1;       // Stay slightly right
            this.targetY = -2.5;      // Less descent on mobile
            this.targetZ = 4.5;       // Come closer
        } else {
            // Desktop
            this.initialX = 0.8;      // Right of center
            this.initialY = -0.75;    // Slightly lower
            this.initialZ = 2.0;      // Close to camera
            this.targetX = 0;         // Move to center
            this.targetY = -3.5;      // Descent
            this.targetZ = 4.0;       // Come closer
        }

        // Event listeners
        this.setupEventListeners();

        // Start animation
        this.animate();
    }

    setupLights() {
        // Ambient light - warm atmosphere
        const ambientLight = new THREE.AmbientLight(0xfff8e0, 1.0);
        this.scene.add(ambientLight);

        // Hemisphere light
        const hemiLight = new THREE.HemisphereLight(0xffefd5, 0x1a1210, 0.8);
        this.scene.add(hemiLight);

        // ========================
        // SOFT LIGHTS AT 45° ABOVE
        // ========================

        const softLight1 = new THREE.DirectionalLight(0xffd700, 2.5);
        softLight1.position.set(-3, 4, 4);
        this.scene.add(softLight1);

        const softLight2 = new THREE.DirectionalLight(0xffc800, 2.0);
        softLight2.position.set(3, 4, 4);
        this.scene.add(softLight2);

        const softLight3 = new THREE.DirectionalLight(0xffefd5, 2.5);
        softLight3.position.set(0, 4, 5);
        this.scene.add(softLight3);

        const softLight4 = new THREE.DirectionalLight(0xdaa520, 1.5);
        softLight4.position.set(-4, 4, -2);
        this.scene.add(softLight4);

        const softLight5 = new THREE.DirectionalLight(0xb8860b, 1.5);
        softLight5.position.set(4, 4, -2);
        this.scene.add(softLight5);

        // ========================
        // KEY LIGHTS
        // ========================

        const keyLight = new THREE.DirectionalLight(0xffd700, 4);
        keyLight.position.set(-2, 5, 6);
        this.scene.add(keyLight);

        const keyLight2 = new THREE.DirectionalLight(0xffc800, 3);
        keyLight2.position.set(4, 3, 5);
        this.scene.add(keyLight2);

        const topLight = new THREE.DirectionalLight(0xffffff, 2.5);
        topLight.position.set(0, 7, 3);
        this.scene.add(topLight);

        const frontLight = new THREE.DirectionalLight(0xffefd5, 2);
        frontLight.position.set(0, 1, 8);
        this.scene.add(frontLight);

        const rimLight = new THREE.DirectionalLight(0xffd700, 1.2);
        rimLight.position.set(0, 2, -6);
        this.scene.add(rimLight);

        const bottomLight = new THREE.DirectionalLight(0xdaa520, 1.0);
        bottomLight.position.set(0, -3, 4);
        this.scene.add(bottomLight);

        // ========================
        // POINT LIGHT ACCENTS
        // ========================

        const pointLight1 = new THREE.PointLight(0xffd700, 1.5, 12);
        pointLight1.position.set(-3, 3, 3);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffc800, 1.2, 12);
        pointLight2.position.set(3, 3, 3);
        this.scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0xffefd5, 1.0, 10);
        pointLight3.position.set(0, 5, 2);
        this.scene.add(pointLight3);
    }

    loadModel() {
        const loader = new GLTFLoader();

        loader.load(
            '/images/oscar_trophy.glb',
            (gltf) => {
                this.model = gltf.scene;

                // Apply bright golden metallic material
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0xdaa520,
                            metalness: 1.0,
                            roughness: 0.08,
                            envMapIntensity: 3.5
                        });
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // Center and scale - BIGGER initial size
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3.5 / maxDim; // Slightly bigger base scale
                this.model.scale.setScalar(scale);

                this.model.position.x = -center.x * scale;
                this.model.position.y = -center.y * scale;
                this.model.position.z = -center.z * scale;

                // Create group for position/rotation control
                this.modelGroup = new THREE.Group();
                this.modelGroup.add(this.model);

                // Set initial position (close, low, right)
                this.modelGroup.position.x = this.initialX;
                this.modelGroup.position.y = this.initialY;
                this.modelGroup.position.z = this.initialZ;

                this.scene.add(this.modelGroup);

                // Add environment map
                this.addEnvironmentMap();
            },
            (progress) => {
                console.log('Loading Oscar 3D:', (progress.loaded / progress.total * 100).toFixed(1) + '%');
            },
            (error) => {
                console.error('Error loading Oscar 3D:', error);
            }
        );
    }

    addEnvironmentMap() {
        const envSize = 256;
        const data = new Uint8Array(envSize * envSize * 4);

        for (let y = 0; y < envSize; y++) {
            for (let x = 0; x < envSize; x++) {
                const i = (y * envSize + x) * 4;
                const t = y / envSize;

                data[i] = Math.floor(255 * (0.45 + t * 0.5));
                data[i + 1] = Math.floor(255 * (0.35 + t * 0.4));
                data[i + 2] = Math.floor(255 * (0.18 + t * 0.2));
                data[i + 3] = 255;
            }
        }

        const envTexture = new THREE.DataTexture(data, envSize, envSize, THREE.RGBAFormat);
        envTexture.needsUpdate = true;

        this.scene.environment = envTexture;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('scroll', () => this.onScroll());
    }

    onResize() {
        if (!this.container) return;

        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.modelGroup && this.model && this.container) {
            // Use getBoundingClientRect for TRUE visual position (fixes mobile URL bar resize issues)
            // rect.top is 0 when at top, and becomes negative as we scroll down.
            // visualScrollY = -rect.top
            const rect = this.container.getBoundingClientRect();
            const visualScrollY = -rect.top;
            const heroHeight = window.innerHeight;

            // Calculate progress based on visual position relative to viewport
            if (visualScrollY > -100) { // Allow slight overscroll handling
                this.targetScrollProgress = Math.min(Math.max(visualScrollY / heroHeight, 0), 1);
                this.targetRotation = this.targetScrollProgress * Math.PI * 2;
            }

            // Smooth interpolation (lerp) for buttery movement
            // Increased factor for better responsiveness
            const smoothFactor = this.isMobile ? 0.15 : 0.08;

            this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * smoothFactor;
            this.scrollRotation += (this.targetRotation - this.scrollRotation) * smoothFactor;

            // Interpolate position from initial to target
            const currentX = this.initialX + (this.targetX - this.initialX) * this.scrollProgress;
            const currentY = this.initialY + (this.targetY - this.initialY) * this.scrollProgress;
            const currentZ = this.initialZ + (this.targetZ - this.initialZ) * this.scrollProgress;

            this.modelGroup.position.x = currentX;
            this.modelGroup.position.y = currentY;
            this.modelGroup.position.z = currentZ;

            // Rotate one full turn
            this.model.rotation.y = this.scrollRotation;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Oscar3D();

    // ==========================================
    // DEBUG - Temporary Scroll Monitor
    // ==========================================
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.top = '100px'; // Move to top (below header/address bar)
    debugDiv.style.right = '10px'; // Move to right
    debugDiv.style.background = 'rgba(0,0,0,0.8)';
    debugDiv.style.color = 'lime';
    debugDiv.style.padding = '5px';
    debugDiv.style.zIndex = '9999';
    debugDiv.style.fontSize = '12px';
    debugDiv.style.pointerEvents = 'none';
    debugDiv.innerHTML = 'Scroll: 0';
    document.body.appendChild(debugDiv);

    const heroEl = document.querySelector('.hero');

    function updateDebug() {
        const winY = window.pageYOffset;
        const htmlY = document.documentElement.scrollTop;
        const bodyY = document.body.scrollTop;
        const heroTop = heroEl ? Math.round(heroEl.getBoundingClientRect().top) : 0;

        debugDiv.innerHTML = `W:${Math.round(winY)} H:${Math.round(htmlY)} B:${Math.round(bodyY)} HeroTop:${heroTop}`;
        requestAnimationFrame(updateDebug);
    }
    updateDebug();
});
