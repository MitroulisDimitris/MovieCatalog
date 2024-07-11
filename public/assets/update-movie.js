var id;
$(document).ready(function() {
    const form = document.getElementById('myForm');
    //const submitbutton = form.querySelector('input[type="submit"]');
    //const resetButton = form.querySelector('input[type="reset"]');
    var movieId = document.getElementById("movie_id");

    window.onload = function() {
       
        fetch('http://localhost:7000/getMovie/'+movieId.value).then(res => res.json()).then(data => {
            console.log(data);
            showMyMovies(data)
        })
    };
   

});

        
function getMyMovies(url){
    MovieSchema.findById(id, (err, movie) => {
        showMyMovies(movie)
      });
    
}


function showMyMovies(movie){
    //get main elemet and clear it
     const main = document.getElementById('MYmovies');
     main.innerHtml = '';
     main.textContent = '';

     //show every retrieved movie
    const {title, poster_path, rating,plot,director,year,trailer,nowPlaying,_id} = movie;
    if (nowPlaying){
        var select = `
        <option value="true" selected>Yes</option>
        <option value="false">No</option>`;
    }else{
        var select = `
        <option value="true">Yes</option>
        <option value="false" selected>No</option>`;
    }

    
    const movieEl = document.createElement('MYmovies');
    const html= `
    <input id="movie_id" type="hidden" name="movie_id" value=${_id}>
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" value="${title}">
    <br><br>
    <label for="year">Year:</label>
    <input type="number" id="year" name="year" value="${year}">
    <br><br>
    <label for="director">Director:</label>
    <input type="text" id="director" name="director" value="${director}">
    <br><br>
    <label for="plot">Plot:</label>
    <textarea id="plot" name="plot" rows="5" cols="30">${plot}</textarea>
    <br><br>
    <label for="rating">Rating:</label>
    <input type="number" id="rating" name="rating" min="0" max="10" step="0.1" value="${rating}">
    <br><br>
    <label for="trailer">Trailer:</label>
    <input type="url" id="trailer" name="trailer" value="${trailer}">
    <br><br>
    <label for="now_playing">Now Playing:</label>
    <select id="now_playing" name="now_playing">
    <option value="true">Yes</option>
    <option value="false" selected>No</option>
    `+select+`
    </select>
    <br><br>
    <input type="submit" value="Save">
    <input type="reset" value="Reset">`;

    movieEl.innerHTML += html;
    main.appendChild(movieEl);
     
 }