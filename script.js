import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';

// Scene setup
const container = document.getElementById('threejs-container');
const scene = new THREE.Scene();

// Set the background color
// scene.background = new THREE.Color('#f8f4ec');

// Camera
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
camera.position.set(0, 1, 7);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Loading overlay
const loadingOverlay = document.createElement('div');
loadingOverlay.classList.add('loading-overlay');
loadingOverlay.innerText = 'Laster...';
container.appendChild(loadingOverlay);

// Interaction overlay (hand icon)
const interactionOverlay = document.createElement('div');
interactionOverlay.classList.add('interaction-overlay');
container.appendChild(interactionOverlay);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemisphereLight.position.set(0, 50, 0);
scene.add(hemisphereLight);

const bottomLight = new THREE.PointLight(0xffffff, 0.6); // White light with medium intensity
bottomLight.position.set(0, -10, 0); // Positioned below the object
scene.add(bottomLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(10, 10, 10);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight2.position.set(-10, 10, -10);
scene.add(directionalLight2);

const bottomDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
bottomDirectionalLight.position.set(0, -10, 5); // Positioned below and angled
scene.add(bottomDirectionalLight);

// GLTF Model loader
const loader = new GLTFLoader();
loader.load(
    'models/scene.gltf',
    (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.03, 0.03, 0.03);
        scene.add(model);

        // Remove loading overlay once the model is loaded
        container.removeChild(loadingOverlay);

        // Show interaction overlay (hand icon)
        interactionOverlay.style.opacity = 0.5;

        // Add interaction listeners to remove the hand after interaction
        const interactionEvents = ['mousedown', 'touchstart', 'wheel'];
        interactionEvents.forEach((event) =>
        renderer.domElement.addEventListener(event, () => {
        interactionOverlay.style.opacity = 0; // Start fade-out by setting opacity to 0

        // After the transition ends, set display to none
        interactionOverlay.addEventListener(
            'transitionend',
            () => {
                interactionOverlay.style.display = 'none';
            },
            { once: true } // Ensure this is only called once
        );
    }, { once: true }) // Remove the listener after the first interaction
);
    },
    (xhr) => {
        // Optional: Log loading progress
    },
    (error) => {
        console.error('An error happened with loading the model', error);
        loadingOverlay.innerText = 'Failed to load model.';
    }
);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 10;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
});
