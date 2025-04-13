// Get the event ID from URL parameters
function getEventId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('event');
}

// Load event details
async function loadEventDetails() {
    const eventId = getEventId();
    if (!eventId) {
        showError('No event specified');
        return;
    }

    try {
        const response = await fetch(`${API_ENDPOINTS.events.list}?id=${eventId}`, {
            ...DEFAULT_FETCH_OPTIONS,
            method: 'GET'
        });
        const result = await handleApiResponse(response);
        
        if (!result || result.length === 0) {
            showError('Event not found');
            return;
        }

        const event = result[0];
        displayEventDetails(event);
    } catch (error) {
        console.error('Error loading event:', error);
        showError('Error loading event details');
    }
}

// Display event details in the UI
function displayEventDetails(event) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    document.getElementById('eventTitle').textContent = event.title;
    document.getElementById('eventDescription').textContent = event.description;
    document.getElementById('eventDate').textContent = formattedDate;
    document.getElementById('eventLocation').textContent = event.location;
    document.getElementById('eventCategory').textContent = event.category;
    document.getElementById('eventType').textContent = event.type;
    document.getElementById('ticketPrice').textContent = event.price > 0 ? `$${event.price}` : 'Free';
    document.getElementById('availableTickets').textContent = event.available_tickets;

    // Update ticket form
    document.getElementById('ticketPrice').value = event.price;
    document.getElementById('maxTickets').value = Math.min(event.available_tickets, 10);
    
    // Show the event details section
    document.getElementById('eventDetails').classList.remove('d-none');
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
    document.getElementById('eventDetails').classList.add('d-none');
}

// Calculate total price
function calculateTotal() {
    const quantity = parseInt(document.getElementById('ticketQuantity').value) || 0;
    const price = parseFloat(document.getElementById('ticketPrice').value) || 0;
    const total = quantity * price;
    document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
}

// Handle form submission
async function purchaseTickets(event) {
    event.preventDefault();
    const form = event.target;
    const eventId = getEventId();
    const quantity = parseInt(document.getElementById('ticketQuantity').value);

    try {
        const response = await fetch(API_ENDPOINTS.tickets.purchase, {
            ...DEFAULT_FETCH_OPTIONS,
            method: 'POST',
            body: JSON.stringify({
                event_id: eventId,
                quantity: quantity
            })
        });

        const result = await handleApiResponse(response);
        if (result.status) {
            alert('Tickets purchased successfully!');
            window.location.reload();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error purchasing tickets:', error);
        alert('Error purchasing tickets. Please try again.');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadEventDetails();
    
    // Add event listeners
    const quantityInput = document.getElementById('ticketQuantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', calculateTotal);
    }

    const purchaseForm = document.getElementById('purchaseForm');
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', purchaseTickets);
    }
});
