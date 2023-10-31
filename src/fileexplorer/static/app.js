document.addEventListener('DOMContentLoaded', function () {
    // Get list of thumbnails with CSS class img-preview
    const imgPreview = document.querySelectorAll('.img-preview');
    // Get the image-panel div. Can toggle d-none class to reveal
    const imagePanel = document.getElementById('image-panel');
    // Get selected-image img. Can change src to load different image
    const selectedImage = document.getElementById('selected-image');

    // Access data attributes
    const imageData = document.getElementById('data');
    const imageBaseUrl = imageData.getAttribute('data-image-url');
    const currentDirectory = imageData.getAttribute('data-current-directory');

    imgPreview.forEach(img => {
        img.addEventListener('click', function () {
            // two levels up from the thumbnail is its row which has the data-filename attribute
            const filename = this.parentElement.parentElement.getAttribute('data-filename');
            const fullImagePath = currentDirectory + '/' + filename;
            selectedImage.src = `${imageBaseUrl}/${fullImagePath}`;
            imagePanel.classList.remove('d-none');
        });
    });
});
