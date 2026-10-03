document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('document-search');
    const documentItems = document.querySelectorAll('.document-item');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        documentItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const tags = item.dataset.tags.toLowerCase();

            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                tags.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Optional: Add subtle click animation to document items
    documentItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.add('clicked');
            setTimeout(() => {
                item.classList.remove('clicked');
            }, 200);
        });
    });
});