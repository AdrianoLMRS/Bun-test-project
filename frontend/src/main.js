const form = document.getElementById('scrape-amazon-form');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    const keyword = form.querySelector('input[name="keyword"]').value;
    const actionUrl = form.getAttribute('action');

    // Send the request using fetch
    fetch(`${actionUrl}?keyword=${keyword}`)
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        renderResults(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle error
    });
});

function renderResults(results) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!results || results.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'No results found.';
        container.appendChild(p);
        return;
    }

    const ol = document.createElement('ol');
    resultsContainer.appendChild(ol);

    results.forEach((item, index) => {
        const article = document.createElement('article');
        article.setAttribute('aria-label', `Result-Item-${index}`);
        article.innerHTML = `
            <header>
                <h3>${item.title}</h3>
            </header>
            <img src="${item.imageUrl}" alt="${item.title}" loading="lazy" />
            <section aria-label="user-reviews-header">
                <h4>User Reviews</h4>
                <span class="rating">${item.rating} stars</span>
                <span class="review-count">${item.numReviews} reviews</span>
            </section>
        `;
        ol.appendChild(article);
    });
}