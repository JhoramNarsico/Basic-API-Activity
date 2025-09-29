const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const countryDetails = document.getElementById('country-details');

searchBtn.addEventListener('click', () => {
    const countryName = countryInput.value;
    if (countryName.trim() === '') {
        alert('Please enter a country name.');
        return;
    }

    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            displayCountry(data[0]);
        })
        .catch(error => {
            countryDetails.innerHTML = `<p>${error.message}</p>`;
        });
});

function displayCountry(country) {
    const html = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="100">
        <p><b>Capital:</b> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><b>Region:</b> ${country.region}</p>
        <p><b>Population:</b> ${country.population.toLocaleString()}</p>
        <p><b>Languages:</b> ${Object.values(country.languages).join(', ')}</p>
    `;
    countryDetails.innerHTML = html;
}

