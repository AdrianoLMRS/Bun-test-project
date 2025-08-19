# Amazon Search Scraper

This project is a full-stack web application that scrapes Amazon search results based on a user-provided keyword. It consists of a **frontend** for user interaction and a **backend** for handling scraping logic. The backend uses **Bun** as the runtime and **Express.js** for the API, while the frontend is built with **Vite**.

---

## Features

- **Frontend**:
  - User-friendly interface to input search keywords.
  - Displays search results in a card-based layout.
  - Fallback to sample data in case of backend errors.
  - Responsive design with accessibility features.

- **Backend**:
  - Scrapes Amazon search results using `axios` and `jsdom`.
  - Implements retry logic for failed requests.
  - Provides a REST API endpoint to fetch scraped data.

- **Docker Support**:
  - Dockerized frontend and backend for easy deployment.
  - `docker-compose` configuration for running the entire stack.

---

## Project Structure

```
Bun-test-project/
├── backend/                    # Backend service
│   ├── src/                    # Source code for backend
│   │   ├── scraper.ts          # Scraping logic
│   │   ├── types.ts            # Type definitions
│   │   └── utils.ts            # Utility functions
│   ├── Dockerfile              # Dockerfile for backend
│   ├── index.ts                # Entry point for backend
│   ├── package.json            # Backend dependencies
│   └── tsconfig.json           # TypeScript configuration
|   ...
├── frontend/                   # Frontend service
│   ├── src/                    # Source code for frontend
│   │   ├── main.js             # Frontend logic
│   │   ├── style.css           # Main stylesheet
│   │   └── styles/             # Additional stylesheets
│   ├── public/                 # Public assets
│   │   └── sample-data.json    # Sample data for fallback
│   ├── Dockerfile              # Dockerfile for frontend
│   ├── index.html              # Main HTML file
│   ├── package.json            # Frontend dependencies
│   └── .env.example            # Example environment variables
├── docker-compose.yml          # Docker Compose configuration
├── LICENSE                     # License file (MIT)
└── README.md                   # Project documentation
...
```

---

## How It Works

1. **Frontend**:
   - Users enter a keyword in the search bar.
   - The frontend sends a GET request to the backend API (`/api/scrape`) with the keyword.
   - If the backend returns results, an AJAX fetch is made.
   - If the backend fails, the user is prompted to use sample data.

2. **Backend**:
   - The backend scrapes Amazon search results using the provided keyword.
   - It parses the HTML response to extract product details (title, rating, reviews, image).
   - Results are returned as a JSON response to the frontend.

---

## Prerequisites

- **Node.js** (for frontend development)
- **Bun** (for backend development)
- **Docker** and **Docker Compose** (for containerized deployment)

---

## Running the Project

<details open><summary><h3>&emsp;1. Using Docker Compose</h3></summary>

1. Ensure Docker and Docker Compose are installed on your system.
2. Navigate to the project root directory.
3. Run the following command:

   ```bash
   docker-compose up --build
   ```

4. Access the frontend at [http://localhost:8080](http://localhost:8080).
5. The backend API will be available at [http://localhost:3000/api/scrape](http://localhost:3000/api/scrape).

</details>

---

<details><summary><h3>&emsp;2. Running Manually</h3></summary>

#### Backend

1. Install **Bun** from [bun.sh](https://bun.sh).
2. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

4. Start the backend server:

   ```bash
   bun run index.ts
   ```

5. The backend will run on [http://localhost:3000](http://localhost:3000).

#### Frontend

1. Install **Node.js** and **npm**.
2. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the frontend at the URL provided in the terminal (e.g: [http://localhost:5173](http://localhost:5173)).

---

## Environment Variables

### Backend

- `PORT`: Port for the backend server (default: `3000`).

### Frontend

- `VITE_PORT`: Port for the HTML `<form>` (Should be same as backend).

</details>

---

## API Endpoints

### `GET /api/scrape`

- **Description**: Scrapes Amazon search results for a given keyword.
- **Query Parameters**:
  - `keyword` (required): The search keyword.
- **Response**:
  - `200 OK`: Returns an array of objects with products.
  - `400 Bad Request`: Missing or invalid keyword.
  - `500 Internal Server Error`: Scraping failed.

---

## Sample Data

If the backend fails to fetch data, the frontend can use sample data located in `frontend/public/sample-data.json`.

---

## Technologies Used

- **Frontend**:
  - Vite
  - HTML, CSS, JavaScript
  - Responsive design with accessibility features

- **Backend**:
  - Bun
  - Express.js
  - TypeScript
  - `axios` and `jsdom` for web scraping

- **Deployment**:
  - Docker
  - Docker Compose

---

## Known Issues

- [503 error](https://github.com/AdrianoLMRS/Bun-test-project/issues/2), need better User-Agents to avoid detection (will be fixed).
- The scraper may fail if Amazon changes its HTML structure.
- The backend does not currently handle advanced error cases like CAPTCHA challenges.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## Author

Developed by Adriano Rossi