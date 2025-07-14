export function showModal(title, content, footer = '') {
    const overlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalFooter.innerHTML = footer;

    overlay.classList.add('active');

    const modal = overlay.querySelector('.modal');
    modal.focus();
}

export function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
}