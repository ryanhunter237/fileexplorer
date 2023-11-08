import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader';
import { TrackballControls } from 'three/addons/controls/TrackballControls';

document.addEventListener('DOMContentLoaded', function () {
    const thumbnails = document.querySelectorAll('.img-preview');
    const visPanel = document.getElementById('vis-panel');
    const imageData = document.getElementById('data');
    const imageBaseUrl = imageData.getAttribute('data-image-url');
    const currentDirectory = imageData.getAttribute('data-current-directory');

    function updateVisDisplay(newElement) {
        const visDisplay = document.getElementById('vis-display');
        visDisplay.replaceWith(newElement);
        visPanel.classList.remove('d-none');
    }

    function displayImage(fullImagePath) {
        var newImg = document.createElement('img');
        newImg.id = 'vis-display';
        newImg.src = `${imageBaseUrl}/${fullImagePath}`;
        newImg.className = 'img-fluid';
        updateVisDisplay(newImg);
    }

    function displayPDF(fullImagePath) {
        var newEmbed = document.createElement('embed');
        newEmbed.id = 'vis-display';
        newEmbed.src = `${imageBaseUrl}/${fullImagePath}#toolbar=0&navpanes=0&scrollbar=0`;
        newEmbed.type = 'application/pdf';
        newEmbed.width = '100%';
        newEmbed.height = '500';
        updateVisDisplay(newEmbed);
    }

    function displaySTL(fullImagePath) {
        // Setup scene, camera, and renderer.  Add renderer to the viewer-container
        var container = document.createElement('div');
        container.id = 'vis-display';
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Setup TrackballControls for the camera and renderer
        const controls = new TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = 4.0;

        const loader = new STLLoader();
        loader.load(
            fullImagePath,
            function (geometry) {
                const material = new THREE.MeshNormalMaterial();
                const mesh = new THREE.Mesh(geometry, material);
                mesh.scale.set(0.05, 0.05, 0.05);
                scene.add(mesh);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        );

        camera.position.set(0,-5,2)

        const animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        updateVisDisplay(container);
    }

    function getFullImagePath(element) {
        const filename = element.getAttribute('data-filename');
        const fullImagePath = currentDirectory + '/' + filename;
        return fullImagePath;
    }

    thumbnails.forEach(img => {
        img.addEventListener('click', function () {
            const filetype = this.parentElement.parentElement.getAttribute('data-filetype');
            const fullImagePath = getFullImagePath(this.parentElement.parentElement);

            if (filetype === 'image') {
                displayImage(fullImagePath);
            } else if (filetype === 'pdf') {
                displayPDF(fullImagePath);
            } else if (filetype === 'stl') {
                displaySTL(fullImagePath);
            }
        });
    });
});