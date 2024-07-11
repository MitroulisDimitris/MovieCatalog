const APIKEY = 'api_key=132908b07cbc33575b9983cfc84f9178';
const BASE_URL = 'https://api.themoviedb.org/3/';
const DISCOVER_URL = BASE_URL + 'discover/movie?sort_by=popularity.desc&'+ APIKEY;
var SEARCH_URL =  BASE_URL + 'search/movie?'+ APIKEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500'
const NOW_PLAYING_URL = BASE_URL+'movie/now_playing?'+ APIKEY;
var header;
//var header = 'http://localhost:7000';


var TMDB_URL;

$(document).ready(function() {
    header = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
    //console.log('windowurl '+url);


    const movieName = document.getElementById('movie-name');
    const searchResults = document.getElementById('searchResults');

    var genre = document.querySelector("#genre").value;
    var orderBy = document.querySelector("#order-by").value;
    var AscDesc = document.querySelector("#ascdesc").value;
    var playingStatus = document.querySelector("#playingStatus").value;
            

    
    var MyUrl = header+'/api/search?search='+movieName.value;
    MyUrl += '&genres='+genre;
    MyUrl += '&sort='+orderBy;
    MyUrl += '&ascdesc='+AscDesc;
    MyUrl += '&playingNow='+playingStatus;

///api/search?search=&genres=&sort=title&ascdesc=1&playingNow=all
   
    
    window.onload = function() {
        getMyMovies(MyUrl);
        getMovies(DISCOVER_URL);
      };
      
    

    //on enter press, send get request to the same page with search term
    document.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            genre = document.querySelector("#genre").value;
            orderBy = document.querySelector("#order-by").value;
            AscDesc = document.querySelector("#ascdesc").value;
            playingStatus = document.querySelector("#playingStatus").value;
            

            MyUrl = header+'/api/search?search='+movieName.value;
            MyUrl += '&genres='+genre;
            MyUrl += '&sort='+orderBy;
            MyUrl += '&ascdesc='+AscDesc;
            MyUrl += '&playingNow='+playingStatus;


            SEARCH_URL += '&query='+movieName.value;

            
            (playingStatus == "true")
                ? TMDB_URL = NOW_PLAYING_URL
                : TMDB_URL = SEARCH_URL;

            
           
            if(movieName.value === ""){
                getMyMovies(MyUrl);  
                getMovies(DISCOVER_URL);
         
            }else{

                getMyMovies(MyUrl);  
                getMovies(TMDB_URL);
                

                }
            }
      });
    

    function getMyMovies(url){
        fetch(url).then(res => res.json()).then(data => {
            showMyMovies(data.movies)
        })
    }

    function getMovies(url){
        fetch(url).then(res => res.json()).then(data => {
            showMovies(data.results)
        })
    }

    function showMovies(data){
       //get main elemet and clear it
        const main = document.getElementById('APImovies');
        main.innerHtml = '';
        main.textContent = '';

        //filter movies based from search term
        var res = data.filter(movie => movie.title.toLowerCase().includes(movieName.value.toLowerCase()));

        //show every retrieved movie
        res.forEach(movie => {
            const {title, poster_path, vote_average,overview,id} = movie;
            const movieEl = document.createElement('APImovies');
            const html= `<hr class='solid'>
                <div class='movie-block'>
                    <div class='movie-info'>
                    <img class='image-poster' src='${IMG_URL+poster_path}' alt='${title}'>
                    <h3 id="${id}" class='movie-title'>${title}</h3>
                    <p class='movie-description'>${overview}</p>
                    <p style=color:${getColor(vote_average)} class='movie-rating'>Rating: ${vote_average}/10</p>
                    </div>
                </div>`;

            movieEl.innerHTML += html;
            main.appendChild(movieEl);
            var myHeading = document.getElementById(id);
            myHeading.onclick = function(e) {
                e.preventDefault();
                window.location.href = '/movie/'+id+'?isFromTmdb=true';
              };
        })
    }
    
    function showMyMovies(data){
        //get main elemet and clear it
         const main = document.getElementById('MYmovies');
         main.innerHtml = '';
         main.textContent = '';
 
         //show every retrieved movie
         data.forEach(movie => {
            const {title, poster, rating,plot,_id,} = movie;
             const myMovieEl = document.createElement('MYmovies');
             const html= `<hr class='solid'>
                 <div class='movie-block'>
                    <div class='movie-info'>
                    <img class='image-poster' src='https://drive.google.com/uc?export=view&id=${poster}' alt="Your image description">
                    <h3 id="${_id}" class='movie-title'>${title}</h3>
                    <p class='movie-description'>${plot}</p>
                    <p style=color:${getColor(rating)} class='movie-rating'>Rating: ${rating}/10</p>
                    </div>
                 </div>`;
 
                 myMovieEl.innerHTML += html;
                 main.appendChild(myMovieEl);
                 var Heading = document.getElementById(_id);
                 Heading.onclick = function(e) {
                    e.preventDefault();
                    window.location.href = '/movie/'+_id+'?isFromTmdb=false';
                   };
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
});

//on button press update dropdown list
function sendData(e) {
    //showAutocomplete(e);
}


function showAutocomplete(e){
    fetch('/search',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({payload:e.value})
        }).then(res => res.json()).then(data => {
          //fetch results from database
          let payload = data.payload;
          searchResults.innerHTML = '';
          if(payload.length < 1 ){
              searchResults.innerHTML = '<p>Nothing Found</p>';
              return;
          }else{
              payload.forEach((item,index)=>{
                  if(index>0) searchResults.innerHTML += '<hr>';
                  searchResults.innerHTML += `<p>${item.title}</p>`;
              });
              return;
          }
    })
}
    
