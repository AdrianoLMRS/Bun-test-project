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
        const li = document.createElement('li');
        
        const article = document.createElement('article');
        // Seo & accessibility attributes
        article.setAttribute('itemscope', '');
        article.setAttribute('itemtype', 'http://schema.org/Product');
        article.setAttribute('aria-label', `Result Item ${index + 1}: ${item.title}`);

        // Create header with item title
        const header = document.createElement('header');
        const h3 = document.createElement('h3');

        h3.setAttribute('itemprop', 'name');
        h3.textContent = item.title;

        header.appendChild(h3);
        article.appendChild(header);

        // Image
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.title;
        img.loading = 'lazy';

        img.setAttribute('itemprop', 'image');

        article.appendChild(img);

        // User reviews section
        const section = document.createElement('section');
        const reviewsId = `user-reviews-header-${index}`; // Unique ID
        section.setAttribute('aria-labelledby', reviewsId);

        const h4 = document.createElement('h4');
        h4.id = reviewsId;
        h4.textContent = 'User Reviews';
        section.appendChild(h4);

        // Rating </span> element
        const rating = document.createElement('span');
        rating.className = 'rating';
        // SEO
        rating.setAttribute('itemprop', 'aggregateRating');
        rating.setAttribute('itemscope', '');
        rating.setAttribute('itemtype', 'http://schema.org/AggregateRating');

        rating.textContent = `${item.rating} stars`;

        // Review </span> element
        const reviewCount = document.createElement('span');
        reviewCount.className = 'review-count';
        reviewCount.textContent = `${item.numReviews} reviews`;
        reviewCount.setAttribute('itemprop', 'reviewCount');

        // Append elements to the user reviews section
        section.appendChild(rating);
        section.appendChild(reviewCount);
        article.appendChild(section); // Append section to article

        li.appendChild(article);
        ol.appendChild(li);
    });
}