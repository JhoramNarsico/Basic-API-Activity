const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const countryDetails = document.getElementById('country-details');

searchBtn.addEventListener('click', () => {
    const countryName = countryInput.value.trim();
    if (countryName === '') {
        alert('Please enter a country name.');
        return;
    }

    const url = `https://restcountries.com/v3.1/name/${countryName}`;

    countryDetails.classList.remove('visible');
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found. Please check the spelling.');
            }
            return response.json();
        })
        .then(data => {
            displayCountry(data[0]);
        })
        .catch(error => {
            countryDetails.innerHTML = `<p style="text-align: center; color: #ff4d4d;">${error.message}</p>`;
            countryDetails.classList.remove('hidden');
            setTimeout(() => countryDetails.classList.add('visible'), 10);
        });
});

function displayCountry(country) {
    const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
    const capital = country.capital ? country.capital[0] : 'N/A';
    const currency = country.currencies ? Object.values(country.currencies)[0].name : 'N/A';

    const html = `
        <div class="country-card">
            <div class="country-header">
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
                <h2>${country.name.common}</h2>
            </div>
            <div class="country-info">
                <p><b>Capital:</b> <span>${capital}</span></p>
                <p><b>Continent:</b> <span>${country.region}</span></p>
                <p><b>Population:</b> <span>${country.population.toLocaleString()}</span></p>
                <p><b>Currency:</b> <span>${currency}</span></p>
                <p><b>Languages:</b> <span>${languages}</span></p>
            </div>
        </div>
    `;

    countryDetails.innerHTML = html;
    countryDetails.classList.remove('hidden');

    // Use a small timeout to allow the element to be rendered before adding the transition class
    setTimeout(() => {
        countryDetails.classList.add('visible');
    }, 10);

}
