//titles= https://www.omdbapi.com/?s=thor&page=2&apikey=744e8782
//all details=https://www.omdbapi.com/?i=tt3896198&apikey=744e8782

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// check the contain in input

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMoviesFromAPI(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

// load movies from API


async function loadMoviesFromAPI(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=744e8782`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True")  displayMovieListTOSearch(data.Search);
}

//search list

function displayMovieListTOSearch(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

  // Making the output html by string interpolition
  
        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=744e8782`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){

    // Making the output html by string interpolition

    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        <button id="add-to-fav">ADD TO FAVOURITE</button>
    </div>
    `;

    const addToFavButton = document.getElementById('add-to-fav');
    addToFavButton.addEventListener('click', function () {
        addToFavButton.style.background="red";
        addToFavorites(details);
    });
}



function addToFavorites(movieDetails) {
    // Retrieve existing favorites from localStorage or initialize an empty array
    const existingFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Add the new favorite movie details to the array
    existingFavorites.push(movieDetails);

    // Save the updated favorites array back to localStorage
    localStorage.setItem('favorites', JSON.stringify(existingFavorites));

    // Update the displayed favorites
    loadFavorites();
}

function removeFromFavorites(movieTitle) {
    // Retrieve existing favorites from localStorage
    const existingFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Filter out the removed movie from the favorites array
    const updatedFavorites = existingFavorites.filter(movie => movie.Title !== movieTitle);

    // Save the updated favorites array back to localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    // Update the displayed favorites
    loadFavorites();
}

// Load favorites from localStorage when the page loads
function loadFavorites() {
    const favContainer = document.getElementById('fav-container');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Clear the existing content in the container
    favContainer.innerHTML = '';

    // Loop through favorites and display them
    favorites.forEach(movieDetails => {
        addToFavoritesContainer(favContainer, movieDetails);
    });
}

// Function to add favorite to container (used during initial load and updates)
function addToFavoritesContainer(container, movieDetails) {
    const favItem = document.createElement('div');
    favItem.classList.add('fav-item');
// Making the output html by string interpolition
    favItem.innerHTML = `
        <div class="fav-movie-poster">
            <img src="${movieDetails.Poster}" alt="movie poster">
        </div>
        <div class="fav-movie-info">
            <h3 class="fav-movie-title">${movieDetails.Title}</h3>
            <p class="fav-movie-year">${movieDetails.Year}</p>
            <p class="fav-movie-genre">${movieDetails.Genre}</p>
            <button class="remove-from-fav" onclick="removeFromFavorites('${movieDetails.Title}')">Remove from Favorites</button>
        </div>
    `;

    container.appendChild(favItem);
}

// Call loadFavorites when the page loads to populate favorites from localStorage
window.addEventListener('load', loadFavorites);