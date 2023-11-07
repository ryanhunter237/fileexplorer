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
            }
        });
    });
});