const apiKey = 'fe3958aa1f68441c99303421241209';

let map;

function initMap() {
    map = L.map('map').setView([0, 0], 2); // Default center and zoom level

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

function getWeather() {
    const locationInput = document.getElementById('locationInput').value;
    const weatherInfoDiv = document.getElementById('weatherInfo');

    weatherInfoDiv.innerHTML = '';

    fetchWeather(locationInput)
        .then(data => {
            if (data) {
                const temperature = data.current.temp_c;
                const windSpeed = data.current.wind_kph;
                const localTime = new Date(data.location.localtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Convert localtime to a readable format
                const weatherInfo = `
                    <p><strong>Location:</strong> ${data.location.name}</p>
                    <p><strong>Weather Condition:</strong> ${data.current.condition.text}</p>
                    <p><strong>Temperature:</strong> ${temperature} °C (${(temperature * 9/5 + 32).toFixed(1)} °F)</p>
                    <p><strong>Local Time:</strong> ${localTime}</p> <!-- Added local time -->
                `;
                weatherInfoDiv.innerHTML = weatherInfo;

                // Update map
                const location = data.location.name;
                fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.length > 0) {
                            const lat = parseFloat(data[0].lat);
                            const lon = parseFloat(data[0].lon);

                            map.setView([lat, lon], 12); // Adjust zoom level as needed

                            L.marker([lat, lon]).addTo(map)
                                .bindPopup(location)
                                .openPopup();
                        } else {
                            alert("Location not found.");
                        }
                    })
                    .catch(error => alert("Error: " + error));
            } else {
                weatherInfoDiv.innerHTML = '<p>City not found. Please try again.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherInfoDiv.innerHTML = '<p>Could not retrieve weather data. Please try again.</p>';
        });
}

function fetchWeather(city) {
    const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;

    return fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.location) {
                return data;
            } else {
                return null;
            }
        });
}

/*
function showSuggestions() {
    const locationInput = document.getElementById('locationInput').value;
    const suggestionBox = document.getElementById('autocomplete-list');

    if (!locationInput) {
        suggestionBox.innerHTML = '';
        return;
    }

    // Fetch city suggestions from Nominatim
    const geocodeApiUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(locationInput)}&format=json&limit=5`;

    fetch(geocodeApiUrl)
        .then(response => response.json())
        .then(data => {
            suggestionBox.innerHTML = '';
            if (data.length > 0) {
                data.forEach(item => {
                    const suggestionDiv = document.createElement('div');
                    suggestionDiv.className = 'autocomplete-item';
                    suggestionDiv.innerHTML = `${item.display_name}`;
                    suggestionDiv.addEventListener('click', function () {
                        document.getElementById('locationInput').value = item.display_name;
                        suggestionBox.innerHTML = '';
                    });
                    suggestionBox.appendChild(suggestionDiv);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching suggestions:', error);
        });
}
*/
window.onload = initMap;
