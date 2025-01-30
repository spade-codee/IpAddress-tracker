
let map = L.map('map').setView([0, 0], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker;

const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

function updateUI(data) {
    document.getElementById('ip').textContent = data.query;
    document.getElementById('location').textContent = `${data.city}, ${data.regionName} ${data.zip}`;
    document.getElementById('timezone').textContent = `UTC ${data.timezone}`;
    document.getElementById('isp').textContent = data.isp;

    // mao update 
    const lat = data.lat;
    const lng = data.lon;
    
    if (marker) {
        map.removeLayer(marker);
    }
    
    marker = L.marker([lat, lng]).addTo(map);
    map.setView([lat, lng], 13);
}

async function getIPData(searchTerm = '') {
    try {
        const url = searchTerm 
            ? `http://ip-api.com/json/${searchTerm}`
            : 'http://ip-api.com/json/';
            
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'success') {
            updateUI(data);
        } else {
            throw new Error(data.message || 'Something went wrong');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch IP data. Please try again.');
    }
}

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        getIPData(searchTerm);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            getIPData(searchTerm);
        }
    }
});

//get user's IP
getIPData();