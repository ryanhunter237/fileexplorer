import { updateVisDisplay } from './visDisplay.js'
import { displaySTL } from './stlViewer.js'

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

function getFileUrl(filename) {
    const currentDirData = document.getElementById('current-dir-data');
    const fileServingUrl = currentDirData.getAttribute('file-serving-url');
    return fileServingUrl + '/' + filename
}

document.addEventListener('DOMContentLoaded', function () {
    const thumbnails = document.querySelectorAll('.img-preview');
    thumbnails.forEach(img => {
        img.addEventListener('click', function () {
            const rowElement = this.parentElement.parentElement;
            const filetype = rowElement.getAttribute('data-filetype');
            const filename = rowElement.getAttribute('data-filename');
            const fileUrl = getFileUrl(filename);

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