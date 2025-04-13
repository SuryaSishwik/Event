// Initialize analytics data
let analyticsData = {
    totalEvents: 0,
    totalTickets: 0,
    totalAttendees: 0,
    totalRevenue: 0,
    eventsByCategory: {},
    monthlySales: Array(12).fill(0)
};

// Function to update analytics display
function updateAnalyticsDisplay() {
    // Update counters
    document.querySelector('.total-events').textContent = analyticsData.totalEvents;
    document.querySelector('.total-tickets').textContent = analyticsData.totalTickets;
    document.querySelector('.total-attendees').textContent = analyticsData.totalAttendees;
    document.querySelector('.revenue').textContent = `$${analyticsData.totalRevenue.toLocaleString()}`;

    // Update category chart
    updateCategoryChart();
    
    // Update sales chart
    updateSalesChart();
}

// Initialize category chart
let categoryChart;
function initCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#4F46E5', // Primary color
                    '#10B981', // Success color
                    '#3B82F6', // Info color
                    '#F59E0B', // Warning color
                    '#6366F1'  // Secondary color
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Initialize sales chart
let salesChart;
function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Ticket Sales',
                data: analyticsData.monthlySales,
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Update category chart
function updateCategoryChart() {
    if (!categoryChart) return;
    
    const categories = Object.keys(analyticsData.eventsByCategory);
    const counts = categories.map(cat => analyticsData.eventsByCategory[cat]);
    
    categoryChart.data.labels = categories;
    categoryChart.data.datasets[0].data = counts;
    categoryChart.update();
}

// Update sales chart
function updateSalesChart() {
    if (!salesChart) return;
    
    salesChart.data.datasets[0].data = analyticsData.monthlySales;
    salesChart.update();
}

// Fetch analytics data from the server
async function fetchAnalyticsData() {
    try {
        const response = await fetch(API_ENDPOINTS.stats);
        if (!response.ok) {
            console.error('Failed to fetch analytics data');
            return;
        }
        
        const data = await response.json();
        if (data.status) {
            analyticsData = {
                ...analyticsData,
                ...data.data
            };
            updateAnalyticsDisplay();
        }
    } catch (error) {
        console.error('Error fetching analytics:', error);
    }
}

// Initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCategoryChart();
    initSalesChart();
    updateAnalyticsDisplay();
    fetchAnalyticsData();
});
