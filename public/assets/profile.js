const IMG_URL = 'https://image.tmdb.org/t/p/w500'
var header; 
var MyUrl;

$(document).ready(function() {

     
    window.onload = function() {
        header = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
        MyUrl = header+'/api/search?search=';
        MyUrl += '&sort=';
        MyUrl += '&ascdesc=1';
        MyUrl += '&playingNow=all';
        
        
        checkUserType(MyUrl);
        
      };

});


//api/search?search=&genres=&sort=title&ascdesc=1&playingNow=all

function createButton(){
    const createButtonMain = document.getElementById('createMovieMain');
    const createButton = document.createElement('createButton');
    const button= `
    <form action="/create-movie" method="GET">
        <button class="create-btn" type="submit">Create Movie</button>
    </form>
    `;
    createButtonMain.innerHTML += button;
    createButtonMain.appendChild(createButton);
}


function checkUserType(url){
    fetch(header+'/getUserData').then(res => res.json()).then(data => {
        console.log(data);   
        if(data.UserType == 'Admin'){
            createButton();
            getMyMovies(url);
        }
    })
}
function getMyMovies(url){
    fetch(url).then(res => res.json()).then(data => {
        console.log(data);
        showMyMovies(data.movies)
    })
}


function showMyMovies(movies){
    //get main elemet and clear it
     const main = document.getElementById('MYmovies');
     main.innerHtml = '';
     main.textContent = '';

     //show every retrieved movie
     movies.forEach(movie => {
        const {title, poster_path, rating,plot,_id} = movie;
         const movieEl = document.createElement('MYmovies');
         const html= `<hr class='solid'>
             <div class='movie-block'>
                <div class='movie-info'>
                    <img src='${IMG_URL+poster_path}' alt='${title}'>
                    <h3 class='movie-title'>${title}</h3>
                    <p class='movie-description'>${plot}</p>
                    <p style=color:${getColor(rating)} class='movie-rating'>Rating: ${rating}/10</p>
                    <div>
                        <form class="update-form" id="login-form" action="/update-movie" method='GET'>
                            <input type="hidden" name="movie_id" value="${_id}">
                            <input type="submit" class="update-button" value="Update">
                        </form>
                        <form class="delete-form" id="delete-form" action="/delete-movie" method='POST'>
                            <input type="hidden" name="movie_id" value="${_id}">
                            <input type="submit" class="delete-button" value="Delete">
                        </form>
                    </div>
                 </div>
             </div>`;

         movieEl.innerHTML += html;
         main.appendChild(movieEl);
     })
 }
 function getColor(vote){
    if(vote>=8){
        return 'green';
    
    }else if(vote>=5){
        return 'orange';

    }else{
        return 'red';
    }
}
