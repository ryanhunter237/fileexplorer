import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls';

document.addEventListener('DOMContentLoaded', function () {
    const thumbnails = document.querySelectorAll('.img-preview');
    const visPanel = document.getElementById('vis-panel');
    const imageData = document.getElementById('data');
    const imageBaseUrl = imageData.getAttribute('data-image-url');
    const currentDirectory = imageData.getAttribute('data-current-directory');

    function updateVisDisplay(newElement) {
        newElement.id = 'vis-display'
        const visDisplay = document.getElementById('vis-display');
        visDisplay.replaceWith(newElement);
        visPanel.classList.remove('d-none');
    }

    function displayImage(fullImagePath) {
        var newImg = document.createElement('img');
        newImg.src = `${imageBaseUrl}/${fullImagePath}`;
        newImg.className = 'img-fluid';
        updateVisDisplay(newImg);
    }

    function displayPDF(fullImagePath) {
        var newEmbed = document.createElement('embed');
        newEmbed.src = `${imageBaseUrl}/${fullImagePath}#toolbar=0&navpanes=0&scrollbar=0`;
        newEmbed.type = 'application/pdf';
        newEmbed.style.width = '100%';
        newEmbed.style.height = '100%';
        updateVisDisplay(newEmbed);
    }

    function displaySTL(fullImagePath) {
        var container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        // need to replace old vis-display with container so clientWidth and clientHeight are not null
        updateVisDisplay(container);

        const width = container.clientWidth;
        const height = container.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );
        renderer.domElement.style.position = 'absolute';
        container.appendChild( renderer.domElement );

        // Setup TrackballControls for the camera and renderer
        const controls = new TrackballControls(camera, renderer.domElement);
        // controls.rotateSpeed = 4.0;

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5;

        function animate() {
            requestAnimationFrame( animate );
            controls.update();
            renderer.render( scene, camera );
        }

        animate();

        window.addEventListener('resize', function() {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            controls.handleResize();
        });
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