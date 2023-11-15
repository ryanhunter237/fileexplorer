export function updateVisDisplay(newElement) {
    newElement.id = 'vis-display'
    const visDisplay = document.getElementById('vis-display');
    visDisplay.replaceWith(newElement);
    const visPanel = document.getElementById('vis-panel');
    visPanel.classList.remove('d-none');
}