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
        // Handle success (e.g., display results)
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle error
    });
});