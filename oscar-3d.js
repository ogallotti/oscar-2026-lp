// Flag to prevent multiple initializations
let oscar3DInitialized = false;

// Main Initialization Function
async function initOscar3D() {
    if (oscar3DInitialized) return;
    oscar3DInitialized = true;

    console.log('Oscar 3D: Initializing...');

    try {
        // Dynamic Imports - Only loads if this function runs
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
        const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');

        class Oscar3D {
            constructor() {
                this.canvas = document.getElementById('oscar-3d-canvas');
                if (!this.canvas) return;

                this.container = document.getElementById('oscar-statue');
                if (!this.container) return;

                // Detect mobile status for runtime adjustments
                this.isMobile = window.innerWidth <= 768;

                // Scene setup
                this.scene = new THREE.Scene();

                // Camera
                this.camera = new THREE.PerspectiveCamera(
                    40,
                    this.container.offsetWidth / this.container.offsetHeight,
                    0.1,
                    1000
                );
                this.camera.position.z = 5;

                // Renderer
                this.renderer = new THREE.WebGLRenderer({
                    canvas: this.canvas,
                    antialias: !this.isMobile,
                    alpha: true
                });
                this.renderer.setClearColor(0x000000, 0);
                this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
                this.renderer.setPixelRatio(this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
                this.renderer.outputColorSpace = THREE.SRGBColorSpace;
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 2.0;

                this.setupLights();

                // Model management
                this.model = null;
                this.modelGroup = null;
                this.loadModel();

                // Animation state
                this.scrollProgress = 0;
                this.targetScrollProgress = 0;
                this.scrollRotation = 0;
                this.targetRotation = 0;

                // Device-specific positioning
                if (this.isMobile) {
                    this.initialX = 0.3; this.initialY = -1.0; this.initialZ = 2.5;
                    this.targetX = 0.1; this.targetY = -2.5; this.targetZ = 4.5;
                } else {
                    this.initialX = 0.8; this.initialY = -0.75; this.initialZ = 2.0;
                    this.targetX = 0; this.targetY = -3.5; this.targetZ = 4.0;
                }

                this.setupEventListeners();
                this.animate();
            }

            setupLights() {
                const ambientLight = new THREE.AmbientLight(0xfff8e0, 1.0);
                this.scene.add(ambientLight);
                const keyLight = new THREE.DirectionalLight(0xffd700, 3.5);
                keyLight.position.set(-2, 5, 5);
                this.scene.add(keyLight);
                const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
                rimLight.position.set(2, 3, -4);
                this.scene.add(rimLight);
                const fillLight = new THREE.DirectionalLight(0xffefd5, 1.5);
                fillLight.position.set(0, -2, 4);
                this.scene.add(fillLight);
            }

            loadModel() {
                const loader = new GLTFLoader();
                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
                loader.setDRACOLoader(dracoLoader);

                loader.load('/images/oscar_trophy.glb', (gltf) => {
                    this.model = gltf.scene;
                    this.model.traverse((child) => {
                        if (child.isMesh) {
                            child.material = new THREE.MeshStandardMaterial({
                                color: 0xdaa520,
                                metalness: 1.0,
                                roughness: 0.08,
                                envMapIntensity: 3.5
                            });
                        }
                    });

                    const box = new THREE.Box3().setFromObject(this.model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 3.5 / maxDim;

                    this.model.scale.setScalar(scale);
                    this.model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

                    this.modelGroup = new THREE.Group();
                    this.modelGroup.add(this.model);
                    this.modelGroup.position.set(this.initialX, this.initialY, this.initialZ);
                    this.scene.add(this.modelGroup);

                    this.addEnvironmentMap();

                    // Fade in effect
                    this.canvas.style.opacity = '0';
                    this.canvas.style.transition = 'opacity 1s ease-in';
                    requestAnimationFrame(() => this.canvas.style.opacity = '1');
                });
            }

            addEnvironmentMap() {
                const envSize = 256;
                const data = new Uint8Array(envSize * envSize * 4);
                for (let y = 0; y < envSize; y++) {
                    const t = y / envSize;
                    for (let x = 0; x < envSize; x++) {
                        const i = (y * envSize + x) * 4;
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
                if (document.hidden || !this.modelGroup || !this.model) return;

                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                const heroHeight = window.innerHeight;

                if (scrollY < heroHeight) {
                    this.targetScrollProgress = Math.min(scrollY / heroHeight, 1);
                    this.targetRotation = this.targetScrollProgress * Math.PI * 2;
                }

                const smoothFactor = 0.08;
                this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * smoothFactor;
                this.scrollRotation += (this.targetRotation - this.scrollRotation) * smoothFactor;

                this.modelGroup.position.x = this.initialX + (this.targetX - this.initialX) * this.scrollProgress;
                this.modelGroup.position.y = this.initialY + (this.targetY - this.initialY) * this.scrollProgress;
                this.modelGroup.position.z = this.initialZ + (this.targetZ - this.initialZ) * this.scrollProgress;
                this.model.rotation.y = this.scrollRotation;

                this.renderer.render(this.scene, this.camera);
            }
        }

        new Oscar3D();

    } catch (e) {
        console.error('Failed to load 3D module:', e);
        oscar3DInitialized = false;
    }
}

// Interaction Trigger
function interactionTrigger() {
    window.removeEventListener('scroll', interactionTrigger);
    window.removeEventListener('touchstart', interactionTrigger);
    window.removeEventListener('mousedown', interactionTrigger);

    initOscar3D();
}

// Global Activation Logic
window.addEventListener('load', () => {
    if (window.innerWidth <= 768) {
        // MOBILE: Wait for interaction to preserve performance score
        window.addEventListener('scroll', interactionTrigger, { passive: true });
        window.addEventListener('touchstart', interactionTrigger, { passive: true });
        window.addEventListener('mousedown', interactionTrigger, { passive: true });
    } else {
        // DESKTOP: Auto-load after delay
        setTimeout(() => {
            requestIdleCallback(() => {
                initOscar3D();
            });
        }, 2000);
    }
});
