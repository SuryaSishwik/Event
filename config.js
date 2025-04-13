const API_BASE_URL = 'http://localhost/EventPro/Backend';  // Updated to match exact case of folder structure

const API_ENDPOINTS = {
    events: {
        list: `${API_BASE_URL}/list.php`,
        create: `${API_BASE_URL}/create.php`,
        purchase: `${API_BASE_URL}/purchase.php`,
    },
    auth: {
        login: `${API_BASE_URL}/login.php`,
        signup: `${API_BASE_URL}/signup.php`,
    },
    stats: `${API_BASE_URL}/stats.php`
};

// Default fetch options for API calls
const DEFAULT_FETCH_OPTIONS = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    credentials: 'same-origin', // Use same-origin for local development
    mode: 'cors' // Enable CORS
};

// Helper function to handle API responses
async function handleApiResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({
            message: 'An unexpected error occurred'
        }));
        throw new Error(error.message || 'API request failed');
    }
    return response.json();
}
