function addMovie(movies, allMovies) {
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
                </div>
                &nbsp;&nbsp;&nbsp;
                <div>
                    ${getCommentsCount(movie.id)}
                </div>
                &nbsp;&nbsp;&nbsp;
                <button class="see-movie-button" id="${movie.id}">See movie</button>
            </div>
            <div id="${movie.id}-movie" class="modal">
                <div class="modal-content">
                    <div class="modal-movie-name">${movie.title}
                        <div class="movie-categories">
                        ${movie.genres[0].name}, ${movie.production_countries[0].name}
                        </div>
                    </div>
                    <img src="${movie.image}"
                        width="200px" height="200px" class="modal-movie-image">
                    <div class="modal-movie-description">${movie.overview}</div>
                    <div class="comment-section">

                    <textarea id="${movie.id}-comment-input" rows="5" class="comment-input" maxlength="200" 
                    placeholder="Comment..."></textarea>
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
                    <div class="all-comments" id=${movie.id}-comments">
                        ${getComments(movie.id).map(currComment => `<div class="comment-container">
                            <div class="comment-author">
                                ${currComment.author}
                            </div>
                            <div class="comment-text">
                                ${currComment.comment}
                            </div>
                            <div class="comment-date">
                                ${currComment.timestamp}
                            </div>
                        </div>`).join('<br>')}
                    </div>
                </div>
                <div class="close-button-section">
                    <button class="close-button" id=${movie.id}-close">Close</button>
                </div>
            </div>
        </div>
    </li>
    `})

    const buttons = document.getElementsByClassName("see-movie-button");

    Array.prototype.forEach.call(buttons, function(button) {
        const modal = document.getElementById(`${button.id}-movie`);
        const close = document.getElementById(`${button.id}-close`);

        button.onlick = function() {
            modal.style.display = "block";
        }

        //close.onclick = function () {
        //    modal.style.display = "none";
        // }
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
        button.onClick = () => {
            const movieId = button.id.substr(0, button.id.indexOf('-'));
            const value = document.querySelector(`input[name="${movieId}-rating"]:checked`).value;
            rate(value, movieId);
        }
    });

    const topTenRateButton = document.getElementById("top-10-rated");
    topTenRateButton.onClick = () => getTopTenRated(allMovies);

    const topTenPopularButton = document.getElementById("top-10-popular");
    topTenPopularButton.onClick = () => getTopTenPopular(allMovies);
}

function getTopTenRated(allMovies) {
    const ratingsItem = localStorage.getItem("ratings");

    if (!ratingsItem) {
        return [];
    } else {
        const ratings = JSON.parse(ratingsItem);
        const topMovies = allMovies.filter(currMovie => {
            const rating = ratings.find(curr => curr.movieId === currMovie.id);
            return !!rating;
        }).sort((firstMovie, secondMovie) => {
            const firstRating = ratings.find(r => r.movieId === firstMovie.id);
            const secondRating = ratings.find(r => r.movieId === secondMovie.id);
            return firstRating.rating < secondRating.rating ? 1 : -1;
        })

        topMovies.slice(0, 10);
        addMovie(topMovies, allMovies);
    }
}

function getTopTenPopular(allMovies) {
    const popularItem = localStorage.getItem("comments");

    if (!popularItem) {
        return [];
    } else {
        const comments = JSON.parse(popularItem);
        const topMovies = allMovies.filter(currMovie => {
            const comment = ratings.find(curr => curr.movieId === currMovie.id);
            return !!rating;
        }).sort((firstMovie, secondMovie) => {
            const firstComments = comments.filter(r => r.movieId === firstMovie.id).length;
            const secondComments = comments.filter(r => r.movieId === secondMovie.id).length;
            return firstComments < secondComments ? 1 : -1;
        })

        topMovies.slice(0, 10);
        addMovie(topMovies, allMovies);
    }
}

function getRating(movieId) {
    const ratingsItem = localStorage.getItem("ratings");

    if (!ratingsItem) {
        return "No reviews";
    }
    const ratings = JSON.parse(ratingsItem);
    const rating = ratings.filter(rating => rating.movieId === movieId);

    return rating.length === 0  ? 'No reviews' : `${rating[0].rating.toFixed(2)}&nbsp;/&nbsp;6.00`;
}

function getCommentsCount(movieId) {
    const commentsItem = localStorage.getItem("comments");

    if (!commentsItem) {
        return "No comments";
    }
    const comments = JSON.parse(commentsItem);
    const count = comments.filter(comment => comment.movieId === movieId).length;
    return count === 0  ? 'No comments' : `${count} comments`;
}

function getComments(movieId) {
    const commentsItem = localStorage.getItem("comments");
    if (!commentsItem) {
        return [];
    }
    const comments = JSON.parse(commentsItem);
    return comments.filter(comment => comment.movieId === movieId);
}

function addComment(comment, movieId) {
    const author = JSON.parse(localStorage.getItem("currentUser")).email;
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
    } else {
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

function filterByName(movies, name) {
    return movies.filter(movie => movie.title.toLowerCase().startsWith(name.toLowerCase()));
}

fetch('https://api.npoint.io/f037e09ef04e5df7150c') 
    .then(response => response.json())
    .then(data => {
        const movies = data.movies.slice(10, 20);

        addMovie(movies, data.movies);

        const search = document.getElementById("search");
        search.addEventListener('change', (e) => {
            const name = search.value;
            let filteredMovies = filterByName(data.movies, name);
            addMovie(filteredMovies.slice(0, 10), data.movies);
        })
    })
