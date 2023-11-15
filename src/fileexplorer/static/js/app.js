import { updateVisDisplay } from './visDisplay.js'
import { displaySTL } from './stlViewer.js'

document.addEventListener('DOMContentLoaded', function () {
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

    function getFileUrl(element) {
        const currentDirData = document.getElementById('current-dir-data');
        const fileServingUrl = currentDirData.getAttribute('file-serving-url');
        const filename = element.getAttribute('data-filename');
        return fileServingUrl + '/' + filename
    }

    const thumbnails = document.querySelectorAll('.img-preview');
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