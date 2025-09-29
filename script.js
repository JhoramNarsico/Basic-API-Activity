// --- SCRIPT CONFIGURATION ---
const PEXELS_API_KEY = 'EAgyxAl0cePjeDbCNQinchWVuiB6V3dCNaDu1DaP3W3yBtg12KGuHPs6'; // <-- PASTE YOUR INSTANT KEY HERE
// ----------------------------

const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const countryDetails = document.getElementById('country-details');
const backgroundImage = document.getElementById('background-image');
const loader = document.getElementById('loader');

searchBtn.addEventListener('click', findCountry);
countryInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') findCountry();
});

function findCountry() {
    const countryName = countryInput.value.trim();
    if (countryName === '') return;

    // --- UI Updates on Search Start ---
    resetUI();
    countryDetails.classList.add('hidden');
    loader.classList.remove('hidden'); // Show loader
    
    // Step 1: Fetch data from REST Countries API
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) throw new Error('Country not found. Please try again.');
            return response.json();
        })
        .then(data => {
            loader.classList.add('hidden'); // Hide loader on success
            const country = data[0];
            displayCountry(country);
            // Step 2: Use the country name to fetch a background image from Pexels
            updateBackgroundImage(country.name.common);
        })
        .catch(handleError);
}

function displayCountry(country) {
    const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
    const capital = country.capital ? country.capital[0] : 'N/A';
    const currency = country.currencies ? Object.values(country.currencies)[0].name : 'N/A';
    const html = `
        <div class="country-card">
            <div class="country-header">
                <img id="flag-image" src="${country.flags.svg}" alt="Flag of ${country.name.common}" crossorigin="anonymous">
                <h2>${country.name.common}</h2>
            </div>
            <div class="country-info">
                <p><b>Capital:</b> <span>${capital}</span></p>
                <p><b>Continent:</b> <span>${country.region}</span></p>
                <p><b>Population:</b> <span>${country.population.toLocaleString()}</span></p>
                <p><b>Currency:</b> <span>${currency}</span></p>
                <p><b>Languages:</b> <span>${languages}</span></p>
            </div>
        </div>`;
    countryDetails.innerHTML = html;
    countryDetails.classList.remove('hidden');
    setTimeout(() => countryDetails.classList.add('visible'), 10);
}

function updateBackgroundImage(countryName) {
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${countryName} landmark&orientation=landscape&per_page=1`;

    fetch(pexelsUrl, {
        headers: {
            Authorization: PEXELS_API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.photos && data.photos.length > 0) {
            const imageUrl = data.photos[0].src.large2x;
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                backgroundImage.src = imageUrl;
                backgroundImage.classList.add('visible');
            };
        }
    })
    .catch(err => console.error("Error fetching from Pexels:", err));
}

function resetUI() {
    countryDetails.classList.remove('visible');
    backgroundImage.classList.remove('visible');
}

function handleError(error) {
    loader.classList.add('hidden'); // Also hide loader on error
    countryDetails.innerHTML = `<div class="error-message">${error.message}</div>`;
    countryDetails.classList.remove('hidden');
    setTimeout(() => countryDetails.classList.add('visible'), 10);
    resetUI();
}