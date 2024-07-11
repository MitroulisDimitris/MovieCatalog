var mongoose = require('mongoose');



var moviePageSchema = new mongoose.Schema({

    title: String,
    year: Number,
    genres: Array,
    director: String,
    actors: Array,
    plot: String,
    poster: String,
    ratings: Array,
    trailer: String,
    comments: Array

});

const Movie = mongoose.model('MovieList', moviePageSchema);
const m = new Movie;
m.title = 'title2';
m.year = 20012310;
m.genres = ["Drama" , "Comedy"];
m.director = 'no';
m.actors = [
    "Biggus dickus",
    "Morgan Freeman",
    "Bob Gunton"
];
m.plot = 'some plot';
m.poster = 'anotherimage.jpg';
m.ratings = [
                {
                    "source": "mad it up",
                    "value": "1/10"
                },
                {
                    "source": "Rotten Tomatoes",
                    "value": "123%"
                }
            ];
m.trailer = "link";
m.comments = [
    {
    "Name": "Deez nuts",
    "text": "good",
    "rating" : 1,
    "PersonId": "aaskjdabsdkjabsd"
    },
    {
    "Name": "Person 2",
    "text": "bad",
    "rating" : 1,
    "PersonId": "asdasdasda"
    },
]


module.exports = mongoose.model("MovieList",moviePageSchema)