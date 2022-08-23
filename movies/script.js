function addMoviesList(movies, allMovies) {
    const moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = "";
    movies.forEach(movie => {
        moviesList.innerHTML += `
                <li>
                    <div class="li-section">
                        <img class="movie-image"
                            src="${movie.image}"
                            width="50px" height="50px">
                        <div class="movie-name">
                            ${movie.title}
                        </div>
                    </div>
                    <div class="li-section">
                        <div>
                        ${getRating(movie.id)}
                        </div>&nbsp;&nbsp;&nbsp;
                        <div>
                        ${getCommentsCount(movie.id)}
                        </div>&nbsp;&nbsp;&nbsp;
                        
                        <button class="see-movie-button" id="${movie.id}">See movie</button>
                    </div>
                    <div id="${movie.id}-movie" class="modal">
                        <div class="modal-content">
                            <div class="modal-movie-name">${movie.title}
                            </div>
                            <img src="${movie.image}"
                                width="200px" height="200px" class="modal-movie-image">
                            <div class="modal-movie-description">${movie.overview}</div>
                            <table class="modal-category-table">
                                <tr>
                                    <th>Genres</th>
                                </tr>
                                ${movie.genres.map(genre => `<tr>
                                    <td>${genre.name}</td>
                                </tr>`)}
                            </table>
                            <table class="modal-country-table">
                                <tr>
                                    <th>Production countries</th>
                                </tr>
                                ${movie.production_countries.map(country => `<tr>
                                    <td>${country.name}</td>
                                </tr>`)}
                            </table>
                            <div class="comment-section">
                            <textarea id="${movie.id}-comment-input" rows="5" class="comment-input" maxlength="200" placeholder="Comment..."></textarea>
                            <button class="comment-button" id="${movie.id}-comment">Comment</button>
                            <div>
                            <input type="radio" id="1" name="${movie.id}-rating" value="1">
                            <label for="1">1</label>
                            <input type="radio" id="2" name="${movie.id}-rating" value="2">
                            <label for="2">2</label>
                            <input type="radio" id="3" name="${movie.id}-rating" value="3">
                            <label for="3">3</label> 
                            <input type="radio" id="4" name="${movie.id}-rating" value="4">
                            <label for="4">4</label>
                            <input type="radio" id="5" name="${movie.id}-rating" value="5">
                            <label for="5">5</label> 
                            <button class="rate-button" id="${movie.id}-rate">Rate</button>
                            </div>
                            <div class="all-comments" id="${movie.id}-comments" > 
                                ${getComments(movie.id).map(comment => `<div class="comment-container">
                                    <div class="comment-author">
                                        ${comment.author}
                                    </div>
                                    <div class="comment-text">
                                        ${comment.comment}
                                    </div>
                                    <div class="comment-date">
                                        ${comment.timestamp}
                                    </div>
                                </div>`).join('<br>')}
                            </div>  
                            </div>
                            <div class="close-button-section">
                                <button class="close-button" id="${movie.id}-close">Close</button>
                            </div>
                        </div>
                    </div>
                </li>
        `
    })


    const buttons = document.getElementsByClassName("see-movie-button");

    Array.prototype.forEach.call(buttons, function (button) {
        const modal = document.getElementById(`${button.id}-movie`);
        const close = document.getElementById(`${button.id}-close`);

        button.onclick = function () {
            modal.style.display = "block";
        }

        close.onclick = function () {
            modal.style.display = "none";
        }
    });

    const commentButtons = document.getElementsByClassName("comment-button");
    Array.prototype.forEach.call(commentButtons, (button) => {
        button.onclick = () => {
            const movieId = button.id.substr(0, button.id.indexOf('-'));
            const comment = document.getElementById(`${movieId}-comment-input`).value;
            addComment(comment, movieId);
        }
    });

    const rateButtons = document.getElementsByClassName("rate-button");
    Array.prototype.forEach.call(rateButtons, (button) => {
        button.onclick = () => {
            const movieId = button.id.substr(0, button.id.indexOf('-'));
            const value = document.querySelector(`input[name="${movieId}-rating"]:checked`).value;
            rate(value, movieId);
        }
    });

    const top10RateButton = document.getElementById("top-10-rated");
    top10RateButton.onclick = () => getTop10Rated(allMovies);

    const top10PopularButton = document.getElementById("top-10-popular");
    top10PopularButton.onclick = () => getTop10Popular(allMovies);
}

function getTop10Rated(movies) {
    const ratingsItem = localStorage.getItem("ratings");
    if(!ratingsItem) {
        return [];
    } else {
        const ratings = JSON.parse(ratingsItem);
        const topMovies = movies.filter(movie => {
            const rating = ratings.find(r => r.movieId === movie.id);
            return !!rating;
        }).sort((movie1, movie2) => {
            const rating1 = ratings.find(r => r.movieId === movie1.id);
            const rating2 = ratings.find(r => r.movieId === movie2.id);
            return rating1.rating < rating2.rating ? 1 : -1;
        })
        topMovies.slice(0, 10);
        addMoviesList(topMovies, movies);
    }
}

function getTop10Popular(movies) {
    const commentsItem = localStorage.getItem("comments");
    if(!commentsItem) {
        return [];
    } else {
        const comments = JSON.parse(commentsItem);
        const topMovies = movies.filter(movie => {
            const rating = comments.find(r => r.movieId === movie.id);
            return !!rating;
        }).sort((movie1, movie2) => {
            const comments1 = comments.filter(r => r.movieId === movie1.id).length;
            const comments2 = comments.filter(r => r.movieId === movie2.id).length;
            return comments1 < comments2 ? 1 : -1;

        })
        topMovies.slice(0, 10);
        addMoviesList(topMovies, movies);
    }
}

function addComment(comment, movieId) {
    const author = JSON.parse(localStorage.getItem("currUser")).email;
    const commentsItem = localStorage.getItem("comments");
    const commentsDiv = document.getElementById(`${movieId}-comments`);
    if (!commentsItem) {
        localStorage.setItem("comments", JSON.stringify([{
            author,
            comment,
            movieId,
            timestamp: (new Date()).toString(),
        }]));
        const dv = document.createElement("div");
        dv.setAttribute("class", "comment-container");
        dv.innerHTML = `<br>
                        <div class="comment-author">
                            ${author}
                        </div>
                        <div class="comment-text">
                            ${comment}
                        </div>
                        <div class="comment-date">
                            ${(new Date()).toString()}
                        </div>
                        <br>`;
        commentsDiv.appendChild(dv);
        const close = document.getElementById(`${movieId}-close`);
        close.onclick = () => {
            window.location.reload();
        }
    } else {
        const comments = JSON.parse(commentsItem);
        comments.push({
            author,
            comment,
            movieId,
            timestamp: (new Date()).toString(),
        });
        localStorage.setItem("comments", JSON.stringify(comments)); 
        const dv = document.createElement("div");
        dv.setAttribute("class", "comment-container");
        dv.innerHTML = `<br>
                        <div class="comment-author">
                            ${author}
                        </div>
                        <div class="comment-text">
                            ${comment}
                        </div>
                        <div class="comment-date">
                            ${(new Date()).toString()}
                        </div>
                        <br>`;
        commentsDiv.appendChild(dv);
        const close = document.getElementById(`${movieId}-close`);
        close.onclick = () => {
            window.location.reload();
        }
    }
}

function rate(rating, movieId) {
    const ratingsItem = localStorage.getItem("ratings");
    if (!ratingsItem) {
        localStorage.setItem("ratings", JSON.stringify([{
            movieId,
            rating: new Number(rating),
            votes: 1,
        }]))
        window.location.reload();
    }
    else {
        const ratings = JSON.parse(ratingsItem);
        if (ratings.filter(r => r.movieId === movieId).length === 0) {
            ratings.push({
                movieId,
                rating: new Number(rating),
                votes: 1,
            })
            localStorage.setItem("ratings", JSON.stringify(ratings));
            window.location.reload();
        } else {
            const newRatings = ratings.map(r => {
                if (r.movieId === movieId) {
                    const currentRating = new Number(r.rating);
                    const newRating = new Number(rating);
                    let votes = new Number(r.votes);
                    votes++;
                    r.votes = votes;
                    r.rating = currentRating + (newRating - currentRating) / votes;
                }
                return r;
            });
            localStorage.setItem("ratings", JSON.stringify(newRatings));
            window.location.reload();
        }

    }
}

function getRating(movieId) {
    const ratingsItem = localStorage.getItem("ratings");
    if (!ratingsItem) {
        return "No reviews";
    }
    const ratings = JSON.parse(ratingsItem);
    const rating = ratings.filter(rating => rating.movieId == movieId);
    return rating.length === 0  ? 'No reviews' : `${rating[0].rating.toFixed(2)}&nbsp;/&nbsp;6.00`;
}

function getCommentsCount(movieId) {
    const commentsItem = localStorage.getItem("comments");
    if (!commentsItem) {
        return "No comments";
    }
    const comments = JSON.parse(commentsItem);
    const count = comments.filter(comment => comment.movieId == movieId).length;
    return count === 0  ? 'No comments' : `${count} comments`;
}

function getComments(movieId) {
    const commentsItem = localStorage.getItem("comments");
    if (!commentsItem) {
        return [];
    }
    const comments = JSON.parse(commentsItem);
    console.log(comments.filter(comment => comment.movieId == movieId));
    //console.log(comment.movieId)
    return comments.filter(comment => comment.movieId == movieId);
}

function filterByName(movies, name) {
    return movies.filter(movie => movie.name.toLowerCase().startsWith(name.toLowerCase()))
}

fetch('https://api.npoint.io/f037e09ef04e5df7150c')
    .then(response => response.json())
    .then(data => {
        const movies = data.movies.slice(10, 20);
        addMoviesList(movies, data.movies);

        const search = document.getElementById("search");
        search.addEventListener('change', (e) => {
            const name = search.value;
            let filteredMovies = filterByName(data.movies, name);
            addMoviesList(filteredMovies.slice(0, 10), data.movies);
        })
    });