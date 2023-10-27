document.addEventListener('DOMContentLoaded', function () {
    const imgPreview = document.querySelectorAll('.img-preview');
    const imagePanel = document.getElementById('image-panel');
    const selectedImage = document.getElementById('selected-image');

    // Access data attributes
    const imageData = document.getElementById('data');
    const imageBaseUrl = imageData.getAttribute('data-image-url');
    const currentDirectory = imageData.getAttribute('data-current-directory');

    imgPreview.forEach(img => {
        img.addEventListener('click', function () {
            const filename = this.parentElement.parentElement.getAttribute('data-filename');
            const fullImagePath = currentDirectory + '/' + filename;
            selectedImage.src = `${imageBaseUrl}/${fullImagePath}`;
            imagePanel.classList.remove('d-none');
        });
    });
});
