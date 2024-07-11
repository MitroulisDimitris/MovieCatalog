var mongoose = require('mongoose');



var moviePageSchema = new mongoose.Schema({

    title: {
        type:String,
        required:true
    },
    year: Number,
    genres: Array,
    director: String,
    actors: Array,
    plot: String,
    poster: String,
    rating: {
            type:Number,
            required: true
        },
    trailer: String,
    comments: [{
        Name: {
            type:String,
            required: true
        },
        text:{
            type:String,
            required: true
        },
        rating:{
            type:Number,
            required: false
        },
        PersonId:{
            type:String,
            required: true
        }
        }
            ],
    nowPlaying:{
        type:Boolean,
        required:true
        }

});

const Movie = mongoose.model('MovieList', moviePageSchema);
const m = new Movie({
    title : 'title2',
    year : 20012310,
    genres : ["Drama" , "Comedy"],
    director : 'no',
    actors : [
            "Biggus dickus" ,
            "Morgan Freeman" ,
            "Bob Gunton"
            ],
    plot : 'some plot',
    poster : 'anotherimage.jpg',
    rating : 9.9,
    trailer : "link",
    comments : [
        {
        Name: "Deez nuts",
        text: "good",
        rating : 1,
        PersonId: "aaskjdabsdkjabsd"
        },
        {
        Name: "Person 2",
        text: "bad",
        rating : 1,
        PersonId: "asdasdasda"
        },
    ],
    nowPlaying:true
});


module.exports = mongoose.model("MovieList",moviePageSchema)