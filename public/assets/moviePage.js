var isFav;
var auth;
var header;
const APIKEY = 'api_key=132908b07cbc33575b9983cfc84f9178';
const BASE_URL = 'https://api.themoviedb.org/3/';

$(document).ready(function() {
    var movie_id = document.getElementById("movie_id");
   
    
    header = window.location.href;
    header = header.substring(0, header.lastIndexOf("/", header.lastIndexOf("/") - 1));

   
        

    window.onload = function() {
        var isFromTmdb = document.getElementById("isFromTmdb");
        if (isFromTmdb && isFromTmdb.value !== "true"){
            isFavourite(movie_id);
        }
        
        
    };
    

}); 

function getTmdbMoveData(movie_id){
    var getTmdbMovie = BASE_URL+'movie/'+movie_id+'?'+APIKEY;

    fetch(getTmdbMovie).then(res => res.json()).then(data => {
        console.log(data);
       

    });
}


var favButton = document.getElementById("favButton");
if(favButton){
    favButton.addEventListener('click', () => {
        changeFavStatus(favButton.innerHTML)
    });
}

function isFavourite(movie_id){
    fetch(header+'/isFavourite?mov_id='+movie_id.value).then(res => res.json()).then(data => {
        console.log(data);
        if(data.isFavourite){
            changeButtonText();
        }


    });
}


function changeFavStatus(favButtonValue){
    //var favButton = document.getElementById("favButton");
    if(favButtonValue ==="Add to Favorites"){
        var url = header+'/addToFavourites?mov_id='+movie_id.value;     
    } else{
        var url = header+'/removeFromFavourites?mov_id='+movie_id.value; 
    }

    fetch(url).then(res => res.json()).then(data => {
        if(data.updated===true){
            changeButtonText();
        }else if(data.authenticated == false){
            //console.log('You need to sign in to add to your favourites!');
            alert('You need to sign in to add to your favourites!');
        }
        
    });
    



}


function changeButtonText(){
    var favButton = document.getElementById("favButton");
    if(favButton.innerHTML === "Add to Favorites"){
        favButton.innerHTML = "Remove from Favourites";
    }else {
        favButton.innerHTML = "Add to Favorites";
    }
}


// 
//     let result = document.getElementById("result");

    
//     });
    
//     $('#commentButton').on('click', function() {
//         // Get the value of the name input field
//         const comment = $('#name').val();
//         //Send an AJAX request to insert the data to MongoDB

//         if (comment.length <= 0) {
//             result.innerHTML = `<h3 class="msg">Please Enter a comment</h3>`;
//           }else{
 
//             // get the last part of the path
//             const parts = window.location.href.split("/");
//             const movieId = parts.pop();

//             // $.ajax({
//             //     url: '/addComment',
//             //     method: 'POST',
//             //     data:{  movieId : movieId,
//             //             text: comment,
//             //             rating : 1,
//             //         },  
//             //     success: function(response) {
//             //         //this does get reached, prob after handling post request
//             //         console.log('before_reload');
//             //         location.reload();
//             //     },
//             //     error: function(error) {
//             //         result.innerHTML = `<h3 class="msg">There has been an error</h3>`;
//             //         console.log(error);
//             //         }
//             //     });
//             }
//     });
    
// 