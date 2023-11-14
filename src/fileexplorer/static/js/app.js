import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls';
import { STLLoader } from 'three/addons/loaders/STLLoader';

document.addEventListener('DOMContentLoaded', function () {
    const thumbnails = document.querySelectorAll('.img-preview');
    const visPanel = document.getElementById('vis-panel');
    const imageData = document.getElementById('data');
    const fileServingUrl = imageData.getAttribute('file-serving-url');
    const currentDirectory = imageData.getAttribute('data-current-directory');

    function updateVisDisplay(newElement) {
        newElement.id = 'vis-display'
        const visDisplay = document.getElementById('vis-display');
        visDisplay.replaceWith(newElement);
        visPanel.classList.remove('d-none');
    }

    function displayImage(imageUrl) {
        var newImg = document.createElement('img');
        newImg.src = imageUrl;
        newImg.className = 'img-fluid';
        updateVisDisplay(newImg);
    }

    function displayPDF(pdfUrl) {
        var newEmbed = document.createElement('embed');
        newEmbed.src = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;
        newEmbed.type = 'application/pdf';
        newEmbed.style.width = '100%';
        newEmbed.style.height = '100%';
        updateVisDisplay(newEmbed);
    }

    function displaySTL(stlUrl) {
        var container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        // container needs relative position so its canvas child can be positioned absolutely
        container.style.position = 'relative';
        // need to replace old vis-display so clientWidth and clientHeight are set
        updateVisDisplay(container);

        const width = container.clientWidth;
        const height = container.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( width, height );
        // The canvas (renderer.domElement) needs to have absolute position
        // to not interfere with the flexbox resizing.
        renderer.domElement.style.position = 'absolute';
        container.appendChild( renderer.domElement );

        // Setup TrackballControls for the camera and renderer
        const controls = new TrackballControls(camera, renderer.domElement);
        // controls.rotateSpeed = 4.0;

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
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        );

        camera.position.set(5,-5,3)
        camera.up.set(0,0,1);
        camera.lookAt(0,0,0);

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

        var resetButton = document.createElement('button');
        resetButton.textContent = 'Reset View';
        resetButton.id = 'reset-button';
        resetButton.addEventListener('click', () => {
            controls.reset();
            camera.position.set(5,-5,3)
            camera.up.set(0,0,1);
            camera.lookAt(0,0,0);
            renderer.render(scene, camera);
        });
        container.appendChild( resetButton );
    }

    function getFileUrl(element) {
        const filename = element.getAttribute('data-filename');
        const fileUrl = `${fileServingUrl}/${currentDirectory}/${filename}`
        return fileUrl;
    }

    thumbnails.forEach(img => {
        img.addEventListener('click', function () {
            const rowElement = this.parentElement.parentElement;
            const filetype = rowElement.getAttribute('data-filetype');
            const fileUrl = getFileUrl(rowElement);

            if (filetype === 'image') {
                displayImage(fileUrl);
            } else if (filetype === 'pdf') {
                displayPDF(fileUrl);
            } else if (filetype === 'stl') {
                displaySTL(fileUrl);
            }
        });
    });
});