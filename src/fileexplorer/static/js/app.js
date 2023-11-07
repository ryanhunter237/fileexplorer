document.addEventListener('DOMContentLoaded', function () {
    // Get list of thumbnails with CSS class img-preview
    const thumbnails = document.querySelectorAll('.img-preview');
    // Get the visualization panel. Can toggle d-none class to reveal
    const visPanel = document.getElementById('vis-panel');

    // Access data attributes
    const imageData = document.getElementById('data');
    const imageBaseUrl = imageData.getAttribute('data-image-url');
    const currentDirectory = imageData.getAttribute('data-current-directory');

    thumbnails.forEach(img => {
        img.addEventListener('click', function () {
            // Get visualization display to replace with a new one.
            const visDisplay = document.getElementById('vis-display');
            // two levels up from the thumbnail is its row which has the data-filename attribute
            const filename = this.parentElement.parentElement.getAttribute('data-filename');
            const filetype = this.parentElement.parentElement.getAttribute('data-filetype');
            const fullImagePath = currentDirectory + '/' + filename;
            if (filetype === 'image') {
                var newImg = document.createElement('img');
                newImg.id = 'vis-display';
                newImg.src = `${imageBaseUrl}/${fullImagePath}`;
                newImg.className = 'img-fluid';
                visDisplay.replaceWith(newImg);
            } else if (filetype === 'pdf') {
                var newEmbed = document.createElement('embed');
                newEmbed.id = 'vis-display';
                newEmbed.src = `${imageBaseUrl}/${fullImagePath}#toolbar=0&navpanes=0&scrollbar=0`;
                newEmbed.type = 'application/pdf';
                newEmbed.width = '100%';
                newEmbed.height = '500';
                visDisplay.replaceWith(newEmbed);
            }
            visPanel.classList.remove('d-none');
        });
    });
});
