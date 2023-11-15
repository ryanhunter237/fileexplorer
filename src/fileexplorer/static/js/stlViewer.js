import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls';
import { STLLoader } from 'three/addons/loaders/STLLoader';

import { updateVisDisplay } from './visDisplay.js'

export function displaySTL(stlUrl) {
    const container = setupContainer();
    const { scene, camera, renderer } = initializeScene(container);
    const controls = setupControls(camera, renderer);
    loadAndAddSTL(stlUrl, scene);
    setupResizeEvent(container, renderer, camera, controls);
    const resetButton = createResetButton(scene, camera, renderer, controls);
    container.appendChild(resetButton);
    animate(renderer, scene, camera, controls);
}

function setupContainer() {
    var container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.position = 'relative';
    updateVisDisplay(container);
    return container;
}

function initializeScene(container) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'absolute';
    container.appendChild(renderer.domElement);
    setCameraPosition(camera);
    return { scene, camera, renderer };
}

function setCameraPosition(camera) {
    camera.position.set(5, -5, 3);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
}

function setupControls(camera, renderer) {
    const controls = new TrackballControls(camera, renderer.domElement);
    return controls;
}

function loadAndAddSTL(stlUrl, scene) {
    const loader = new STLLoader();
    loader.load(
        stlUrl,
        function (geometry) {
            const material = new THREE.MeshNormalMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            mesh.scale.set(0.05, 0.05, 0.05);
            scene.add(mesh);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.log(error);
        }
    );
}

function setupResizeEvent(container, renderer, camera, controls) {
    window.addEventListener('resize', function () {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        controls.handleResize();
    });
}

function createResetButton(scene, camera, renderer, controls) {
    var resetButton = document.createElement('button');
    resetButton.textContent = 'Reset View';
    resetButton.id = 'reset-button';
    resetButton.addEventListener('click', () => {
        controls.reset();
        setCameraPosition(camera);
        renderer.render(scene, camera);
    });
    return resetButton;
}

function animate(renderer, scene, camera, controls) {
    function animateLoop() {
        requestAnimationFrame(animateLoop);
        controls.update();
        renderer.render(scene, camera);
    }
    animateLoop();
}