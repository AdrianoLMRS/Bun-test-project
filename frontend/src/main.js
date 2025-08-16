const form = document.getElementById('scrape-amazon-form');

// Prompt dialog elements
const promptDialog = document.getElementById('prompt-dialog')
const dialogSpan = document.getElementById('dialog-error')
const dialogYesBtn = document.getElementById('prompt-btn-yes')

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    const keyword = form.querySelector('input[name="keyword"]').value;
    const actionUrl = form.getAttribute('action');

    // Send the request using fetch
    fetch(`${actionUrl}?keyword=${encodeURIComponent(keyword)}`)
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        renderResults(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        // If error, show this dialog
        promptDialog.showModal();
        dialogSpan.textContent = error.message || 'Failed to fetch data';
        
        dialogYesBtn.onclick = () => fetchSampleData();
    });
});

// Function to fetch sample data and render it
function fetchSampleData() {
    fetch('/sample-data.json')
        .then(response => response.json())
        .then(sampleData => renderResults(sampleData) )
        .catch(error => console.error('Error fetching sample data:', error));
};

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

        // Rating </input> element
        const rating = document.createElement('input');
        rating.className = 'star';
        // SEO
        rating.setAttribute('itemprop', 'aggregateRating');
        rating.setAttribute('itemscope', '');
        rating.setAttribute('itemtype', 'http://schema.org/AggregateRating');

        // Set attributes for the rating input
        rating.type = 'range';
        rating.step = 0.1;
        rating.min = 1;
        rating.max = 5;
        rating.value = Math.min(Math.max(item.rating, 1), 5); // Ensure rating is between 1 and 5
        // Make rating immutable
        rating.setAttribute('readonly', '');
        rating.disabled = true;

        // Review </span> element
        const reviewCount = document.createElement('span');
        reviewCount.className = 'review-count';
        reviewCount.textContent = `(${item.numReviews})`;
        reviewCount.setAttribute('itemprop', 'reviewCount');

        // Append elements to the user reviews section
        section.appendChild(rating);
        section.appendChild(reviewCount);
        article.appendChild(section); // Append section to article

        li.appendChild(article);
        ol.appendChild(li);
    });
}