// Load featured events on the homepage
async function loadFeaturedEvents() {
    try {
        const response = await fetch(API_ENDPOINTS.events.list, {
            ...DEFAULT_FETCH_OPTIONS,
            method: 'GET'
        });
        const events = await handleApiResponse(response);
        
        const featuredEventsContainer = document.getElementById('featuredEvents');
        if (!featuredEventsContainer) return;

        // Add the feature cards first
        const featureCards = `
            <div class="col-md-4">
                <div class="card feature-card h-100">
                    <a href="createEvent.html" class="text-decoration-none text-dark">
                        <div class="card-body text-center">
                            <i class="fas fa-calendar-alt fa-3x mb-3 text-primary"></i>
                            <h5 class="card-title">Event Creation</h5>
                            <p class="card-text">Create and manage events with ease. Set up ticketing, schedules, and more.</p>
                        </div>
                    </a>
                </div>
            </div>
        `;

        // Then add all the events
        const eventCards = events.map(event => {
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="col-md-4 event-card" data-category="${event.category}">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="position-relative">
                            <img src="https://source.unsplash.com/600x400/?${event.category},${event.type}" class="card-img-top" alt="${event.title}">
                            <span class="event-category text-primary">${event.category}</span>
                        </div>
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <div class="event-price">${event.price > 0 ? `$${event.price}` : 'Free'}</div>
                                <div class="tickets-left"><i class="fas fa-ticket me-2"></i>${event.available_tickets} left</div>
                            </div>
                            <h5 class="card-title fw-bold mb-2">${event.title}</h5>
                            <p class="card-text text-secondary mb-3">${event.description}</p>
                            <div class="event-details mb-3">
                                <p class="mb-1"><i class="fas fa-calendar-alt me-2"></i>${formattedDate}</p>
                                <p class="mb-1"><i class="fas fa-map-marker-alt me-2"></i>${event.location}</p>
                                <p class="mb-1"><i class="fas fa-tag me-2"></i>${event.type}</p>
                            </div>
                            <a href="smart-ticketing.html?event=${event.id}" class="btn btn-primary w-100 rounded-pill">Get Tickets</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        featuredEventsContainer.innerHTML = featureCards + eventCards;

        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

    } catch (error) {
        console.error('Error loading events:', error);
        const featuredEventsContainer = document.getElementById('featuredEvents');
        if (featuredEventsContainer) {
            // Add the feature cards first even if events fail to load
            const featureCards = `
                <div class="col-md-4">
                    <div class="card feature-card h-100">
                        <a href="createEvent.html" class="text-decoration-none text-dark">
                            <div class="card-body text-center">
                                <i class="fas fa-calendar-alt fa-3x mb-3 text-primary"></i>
                                <h5 class="card-title">Event Creation</h5>
                                <p class="card-text">Create and manage events with ease. Set up ticketing, schedules, and more.</p>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card feature-card h-100">
                        <a href="smart-ticketing.html" class="text-decoration-none text-dark">
                            <div class="card-body text-center">
                                <i class="fas fa-ticket-alt fa-3x mb-3 text-primary"></i>
                                <h5 class="card-title">Smart Ticketing</h5>
                                <p class="card-text">Purchase and manage tickets for your favorite events.</p>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            
            featuredEventsContainer.innerHTML = featureCards + `
                <div class="col-md-4">
                    <div class="card feature-card h-100">
                        <a href="analytics.html" class="text-decoration-none text-dark">
                            <div class="card-body text-center">
                                <i class="fas fa-chart-line fa-3x mb-3 text-primary"></i>
                                <h5 class="card-title">Analytics Dashboard</h5>
                                <p class="card-text">Track event performance, attendance, and revenue in real-time.</p>
                            </div>
                        </a>
                    </div>
                </div>
            `;
        }
    }
}

// Filter events by category
function filterEvents(category) {
    const events = document.querySelectorAll('.event-card');
    events.forEach(event => {
        if (category === 'all' || event.dataset.category === category) {
            event.style.display = 'block';
        } else {
            event.style.display = 'none';
        }
    });
}

// Handle user authentication
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(API_ENDPOINTS.auth.login, {
            ...DEFAULT_FETCH_OPTIONS,
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const result = await response.json();
        
        if (result.status) {
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error logging in. Please try again.');
    }
}

// Handle user registration
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch(API_ENDPOINTS.auth.signup, {
            ...DEFAULT_FETCH_OPTIONS,
            method: 'POST',
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const result = await response.json();
        
        if (result.status) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error registering. Please try again.');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load featured events on homepage
    loadFeaturedEvents();
    
    // Add event listeners for category filters
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterEvents(button.dataset.filter);
            
            // Update active state of filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Add event listeners for login/signup forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});
