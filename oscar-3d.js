// ==========================================
// OSCAR 3D - Three.js Module (Dynamic Import Version)
// Full Hero Background with Scroll Animation
// ==========================================

// No top-level imports to prevent Mobile blocking
// import * as THREE from 'three'; 

// Main Initialization Function
async function initOscar3D() {
    if (window.innerWidth <= 768) return; // Double check

    console.log('Oscar 3D: Starting Dynamic Import...');

    try {
        // Dynamic Imports - Only loads if this function runs
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
        const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');

        console.log('Oscar 3D: Libraries Loaded');

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
                    antialias: true, // Desktop only, so enable antialias
                    alpha: true
                });
                this.renderer.setClearColor(0x000000, 0);
                this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                this.renderer.outputColorSpace = THREE.SRGBColorSpace;
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 2.0;

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

                // Desktop settings (since this only runs on desktop)
                this.initialX = 0.8;      // Right of center
                this.initialY = -0.75;    // Slightly lower
                this.initialZ = 2.0;      // Close to camera
                this.targetX = 0;         // Move to center
                this.targetY = -3.5;      // Descent
                this.targetZ = 4.0;       // Come closer

                // Event listeners
                this.setupEventListeners();

                // Start animation
                this.animate();
            }

            setupLights() {
                // 1. Ambient Light (Base fill)
                const ambientLight = new THREE.AmbientLight(0xfff8e0, 1.0);
                this.scene.add(ambientLight);

                // 2. Key Light (Main Gold definition)
                const keyLight = new THREE.DirectionalLight(0xffd700, 3.5);
                keyLight.position.set(-2, 5, 5);
                this.scene.add(keyLight);

                // 3. Rim Light (Edge definition)
                const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
                rimLight.position.set(2, 3, -4);
                this.scene.add(rimLight);

                // 4. Fill Light (Softener)
                const fillLight = new THREE.DirectionalLight(0xffefd5, 1.5);
                fillLight.position.set(0, -2, 4);
                this.scene.add(fillLight);
            }

            loadModel() {
                const loader = new GLTFLoader();

                // Draco Compression Support
                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
                loader.setDRACOLoader(dracoLoader);

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

                        // Center and scale
                        const box = new THREE.Box3().setFromObject(this.model);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());

                        const maxDim = Math.max(size.x, size.y, size.z);
                        const scale = 3.5 / maxDim;
                        this.model.scale.setScalar(scale);

                        this.model.position.x = -center.x * scale;
                        this.model.position.y = -center.y * scale;
                        this.model.position.z = -center.z * scale;

                        // Create group for position/rotation control
                        this.modelGroup = new THREE.Group();
                        this.modelGroup.add(this.model);

                        // Set initial position
                        this.modelGroup.position.x = this.initialX;
                        this.modelGroup.position.y = this.initialY;
                        this.modelGroup.position.z = this.initialZ;

                        this.scene.add(this.modelGroup);

                        // Add environment map
                        this.addEnvironmentMap();
                    },
                    (progress) => {
                        // console.log('Loading Oscar 3D:', (progress.loaded / progress.total * 100).toFixed(1) + '%');
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

                this.lastWidth = width;

                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(width, height);
            }

            animate() {
                requestAnimationFrame(() => this.animate());

                // Optimization: Pause when hidden
                if (document.hidden) return;

                if (this.modelGroup && this.model) {
                    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                    const heroHeight = window.innerHeight;

                    if (scrollY < heroHeight) {
                        this.targetScrollProgress = Math.min(scrollY / heroHeight, 1);
                        this.targetRotation = this.targetScrollProgress * Math.PI * 2;
                    }

                    // Smooth interpolation (lerp) for buttery movement
                    const smoothFactor = 0.08;

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

        // Initialize Class
        new Oscar3D();

    } catch (e) {
        console.error('Failed to load 3D module:', e);
    }
}

// Global Trigger
window.addEventListener('load', () => {
    // DISABLE ON MOBILE to guarantee performance score
    if (window.innerWidth <= 768) {
        return;
    }

    // Delay start until critical things are settled
    setTimeout(() => {
        requestIdleCallback(() => {
            initOscar3D();
        });
    }, 2000);
});
