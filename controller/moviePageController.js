var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MovieSchema = require('../models/movieSchema');
var profileSchema = require('../models/profileSchema');
const url = require('url');
const movieRoutes = require('../routes/search-movies');
const { response } = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const cr = require('crypto');
const router = require('../routes/search-movies');
var express = require('express');
const route = express.Router();

const initializePassport = require('./passport-config');

const bcrypt = require('bcrypt');
//console.log(cr.randomBytes(64).toString('hex'));
//console.log(cr.randomBytes(64).toString('hex'));
const fetch = require("node-fetch");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') 
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) 
    }
  });
  
  // Create multer middleware instance
  const upload = multer({ storage: storage });


const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const movieSchema = require('../models/movieSchema');

module.exports = function(app){

    initializePassport(
        passport,
        async id => {
            await profileSchema.findById( id, (err, user) => {
                if(err){
                    console.log(err);
                }
            });
        }
    );


    app.use(flash())
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(methodOverride('_method'))




    var urlencodedParser = bodyParser.urlencoded({extended:false});
    app.use("/api",movieRoutes)

    const uri = 'mongodb+srv://user1:user1@moviecatalog.vyyguoc.mongodb.net/TodoList?retryWrites=true&w=majority';
    mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen( process.env.PORT || 7000),
                    console.log('connected to db'))
    .catch((err) => console.error(err));



    app.get('/movie/:id', function(req,res){ 
        //console.log(req.query.isFromTmdb === "true");
        const APIKEY = 'api_key=132908b07cbc33575b9983cfc84f9178';
        const BASE_URL = 'https://api.themoviedb.org/3/';

        if(req.query.isFromTmdb === "true"){
            var getTmdbMovie = BASE_URL+'movie/'+req.params.id+'?'+APIKEY;
            fetch(getTmdbMovie).then(res => res.json()).then(movie => {
                if(!movie){
                    res.render('error-page',{st: "Movie not found"});    
                }
                res.render('moviePage',{movieId:req.params.id, data:movie,  isFromTmdb : req.query.isFromTmdb});
            });
        }else{
            MovieSchema.findById(req.params.id).then((movie) => {
                if(!movie){
                  
                }
                res.render('moviePage',{movieId:req.params.id, data:movie, isFromTmdb : req.query.isFromTmdb});
                
            }).catch((error) => {
                console.log(error);      
                
            })
        }

    });
    

    app.get('/ejs/:name',function(req,res){
        var data = {name : 'json', age : 23, hobbie: ['1','2','3']};
        res.render('profile', {person : req.params.name, data:data});
    });

    app.get('/test/:id',function(req,res){
        MovieSchema.findById("64007be418f30d1eb80d6548").then((movie) => {
            if(!movie){
                console.log('some rror');
                return res.status(404).send();
            }
            res.render('test-search',{movieId:req.params.id, data:movie });
            
            }).catch((error) => {
                console.log(error);      
            })
    });

    app.get('/add-movie/',function(req,res){
        const m = new MovieSchema({
            title : 'Movie3',
            year : 1998,
            genres : ["Drama" , "Comedy"],
            director : 'no',
            actors : [
                    "Morgan Freeman" ,
                    "Bob Gunton"
                    ],
            plot : 'plottt',
            poster : 'anotherimage.jpg',
            rating : 1,
            trailer : "link2",
            comments : [
                {
                Name: "Name1",
                text: "bad",
                rating : 1,
                PersonId: "aaskjdabsdkjabsd"
                }
            ],
            nowPlaying:true
});


        var schema = MovieSchema(m).save(function(err,data){
            st = true;
            if (err) {
                st = false;
                res.render('add-movie',{st:st});
                throw err;
            }
            res.render('add-movie',{st:st});
        });
    });

    app.get('/add-person/',function(req,res){
        const member = new profileSchema({
            username: 'mychem',  
            email: 'mychem@example.com',
            password: '123',
            favourites: [      
                  "asdasd"
                        ],
            UserType: 'User'
        });
        

        var schema = profileSchema(member).save(function(err,data){
            st = true;
            if (err) {
                st = false;
                throw err;
            }
            res.render('add-person',{st:st});
        });
    });

    app.get('/test-comment/:id',function(req,res){
        
    //ads on comment to object with id 
    MovieSchema.updateOne({ _id: req.params.id },{$push:{comments:{
        "Name": "Name2",
        "text": "comm2",
        "rating" : 1,
        "PersonId": "asdasdasda"
        }}}
        , { new: true }
        , function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                res.render('add-comment',{st:docs});
            }
    });

    });


    app.get('/error-page',function(req,res){
        res.render('error-page',{st:""});

    });

    app.get("/search", async (req, res) => {
        try {
            const page = parseInt(req.query.page) - 1 || 0;
            const limit = parseInt(req.query.limit) || 5;
            const search = req.query.search || "";
            let sort = req.query.sort || "rating";
            let genres = req.query.genres || "All";
            const genresOptions = [
                "Action",
                "Romance",
                "Fantasy",
                "Drama",
                "Crime",
                "Adventure",
                "Thriller",
                "Sci-fi",
                "Music",
                "Family",
            ];

            genres === "All"
                    ? (genres = [...genresOptions])
                    : (genres = req.query.genres.split(","));
                req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

                let sortBy = {};
                if (sort[1]) {
                    sortBy[sort[0]] = sort[1];
                } else {
                    sortBy[sort[0]] = "asc";
                }

            const movies = await MovieSchema.find({ title: { $regex: search, $options: "i" } })
                    .where("genres")
                    .in([...genres])
                    .sort(sortBy)
                    .skip(0)
                    .limit(limit);

                const total = await MovieSchema.countDocuments({
                    genres: { $in: [...genres] },
                    name: { $regex: search, $options: "i" },
                });


                const response = {
                    error: false,
                    total : total,
                    page: page + 1,
                    limit,
                    genress: genresOptions,
                    movies: movies
                };

                //res.status(200).json(response);
                res.render('searchPage',{res:response});
            
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: true, message: "Internal Server Error" });
        }
    });

    app.post('/search', async function(req,res){
        try {

            let payload = req.body.payload.trim();
            let search = await MovieSchema.find({ title: { $regex: new RegExp('^'+payload+'.*','i')}}).exec();
            search = search.slice(0,10);
            const response = {
                search : search
                //apiSearch : dataResults
            }
            res.send({payload: search});
               
            
        } catch (err) {
            res.status(500).json({ error: true, message: "Internal Server Error" });
        }
    });

    
    app.get("/signup", checkNotAuthenticated, (req, res) => {
        res.render('signup');
    });

    app.post("/signup", checkNotAuthenticated, async (req, res) => {
        try{
            //const hashedPass = await bcrypt.hash(req.body.password, 10);
            const member = new profileSchema({
                username: req.body.username,  
                email: req.body.email,
                password: req.body.password,
                UserType: 'User'
            });
    
            profileSchema(member).save(function(err,data){
                if (err) {
                    res.render('error-page',{st: err});
                    throw err;
                }
                res.redirect('/login');

            });
        } catch(e){

        }
    });


    app.get("/login", checkNotAuthenticated, (req, res) => {
        res.render('login');
    });
    
    // app.post("/login",checkNotAuthenticated,passport.authenticate('local', {
    //     successRedirect: '/profile',
    //     failureRedirect: '/wrong-cred',
    //     failureFlash: true
    //   }))
   
    app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/wrong-cred',
        failureFlash: true
    }))


    app.get('/wrong-cred',function(req,res){
        res.render('login',{error:"Wrong Email or password"});

    });

    app.get("/profile", checkAuthenticated, (req, res) => {
        //console.log('profile: '+ req.user.id);
       
        res.render('profile', {user: req.user});
    });

    function checkAuthenticated(req, res, next) {
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect('/login');
    }

    function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/profile')
    }
    next()
    }
    
    app.delete('/logout', (req, res) => {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/login');
          });
      })


    app.get('/getUserData',checkAuthenticated,(req, res) => {
        
        profileSchema.findById(req.user.id, (err, user) => {
            if(err){
                res.status(404).json(err);
            }
            res.status(200).json(user);
          });
        

    });

    app.get('/update-movie/',checkAuthenticated,(req, res) => {
        res.render('update-movie',{movie :req.query.movie_id});

    });

    app.get('/getMovie/:id',(req, res) => {
        MovieSchema.findById(req.params.id, (err, movie) => {
            if(err){
                res.status(404).json(err);
            }
            res.status(200).json(movie);
          });
          
        //res.render('update-movie',{movie :req.query.movie_id});

    });


    app.post('/update-movie',checkAuthenticated,(req, res) => {
        var id = req.body.movie_id;
        console.log(id);
        var update = req.body;
        delete update['_id']; 
       

        MovieSchema.findByIdAndUpdate(id, req.body, { new: true })
        .then((updatedEntry) => {
            res.redirect('/profile');
        })
        .catch((err) => {
            alert(err);
            res.redirect('/profile');
        });

    });

    app.post('/delete-movie',checkAuthenticated,(req, res) => {
        var id = req.body.movie_id;
        MovieSchema.findByIdAndDelete(id, (err, doc) => {
            if (err) {
                alert(err);
                res.redirect('/profile');
            } else {
                res.redirect('/profile');
            }
        });


    });


    app.get('/create-movie',checkAuthenticated,(req, res) => {
        res.render('create-movie');
    });

    app.post('/create-movie',upload.single('image'),(req, res) => {
        //var id = req.body.movie_id;
        var nowPlaying = (req.body.nowPlaying)? true:false;
        //console.log(req.body.genre);
        console.log(req.body);
        //req.body.actors.split(','),

        const m = new movieSchema({
            title : req.body.title,
            year : req.body.year,
            genres : req.body.genre,
            director : req.body.director,
            actors : "asd",
            plot : req.body.plot,
            poster : '1RRWazcUGOxLhGYu9pMC82viWm6nxZ5xO',
            rating : req.body.rating,
            trailer : req.body.trailer,
            nowPlaying: nowPlaying
        });


        // try{
        //     movieSchema(m).save(function(err,data){
        //         if (err) {
        //             res.render('error-page',{st:err});
                    
        //         }
        //         res.redirect('/profile');
        //     });

     
        // }catch(e){
        //     res.render('error-page',{st:e});
        // }
    
    
    
    });

    app.post('/addComment',checkAuthenticated,function(req,res){
        
        MovieSchema.updateOne({ _id:req.body.movie_id },{$push:{comments:{
            "Name": req.user.name,
            "text": req.body.text,
            "rating" : req.body.rating1,
            "PersonId": req.user.id
            }}}
            , { new: true }
            , function (err, docs) {
                if (err){
                    console.log(err)
                }
                res.redirect('/movie/'+req.body.movie_id);
        });

        
        
        
    });

    app.get('/removeFromFavourites',function(req,res){
        if(req.isAuthenticated()){

        profileSchema.updateOne({_id: req.user.id },{$unset:{favourites:req.query.mov_id}}, (err, entry) => {
            if (err) {
              console.error(err);
              return;
            }
            res.status(200).json({authenticated: false,updated:true});
          });
                    
        }else{
            res.status(200).json({authenticated: false});
            
        }
    });

    app.get('/addToFavourites',function(req,res){
        if(req.isAuthenticated()){

            profileSchema.updateOne({_id: req.user.id },{$push:{favourites:req.query.mov_id}}, (err, entry) => {
                if (err) {
                  console.error(err);
                  return;
                }
                res.status(200).json({authenticated: false,updated:true});
              });

            
        }else{
            res.status(200).json({authenticated: false});
            
        }
    });


    app.get('/isFavourite',function(req,res){
        if(req.isAuthenticated()){
            //console.log(req.user.id);
            //console.log(req.query.mov_id);
            // {_id: req.user.id ,favorites: { $in: [req.query.mov_id] }}
            // find({$or: [{rating: {$gt: 8}},{author: X}]})

            profileSchema.findOne({$and: [{_id: req.user.id}]}, (err, entry) => {
                if (err) {
                console.error(err);
                return;
                }
                //console.log(entry.favourites);
                const isFavorite = entry.favourites.includes(req.query.mov_id);
                res.status(200).json({authenticated : true,isFavourite: isFavorite});

            });

        }else{
            res.status(200).json({authenticated: false,isFavourite: false});
            
        }
    
        
    });

}



//returns if movie is in person's favourite List
function isFavourite() {   
    return true;
}


function lastPart(req) {
    const parsedUrl = url.parse(req.get('referer'));
    // get the last part of the path
    const parts = parsedUrl.pathname.split('/');
    return parts[parts.length - 1];

}


function showMovies(data){
    main.innerHtml = '';
    data.forEach(movie => {
        const {title, poster_path, vote_average,overview} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHtml = `
            <hr class="solid">
            <div class="movie-block">
                <div class="movie-info">
                <img src="${IMG_URL+poster_path}" alt="${title}">
                <h3 class="movie-title">${title}</h3>
                <p class="movie-description">${overview}</p>
                <p style = color:${getColor(vote_average)}; class="movie-rating">Rating: ${vote_average}/10</p>
                <p class="movie-rating">ID: <%= res.movies[i]._id %>/10</p>
                </div>
            </div>`;
        main.appendChild(movieEl)
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