const router = require("express").Router();
const Movie = require("../models/movieSchema");

router.get("/search", async (req, res) => {
	try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 10;
		const search = req.query.search || "";
		let genres = req.query.genres || "All";
		
		let sort = { [req.query.sort || "rating"] :  req.query.ascdesc || "1" };
		let playingNow = req.query.playingNow || false

		const genreOptions = [
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
		// 	? (genres = [...genreOptions])
		// 	: (genres = req.query.genres.split(","));
		// req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);


		
		
		// if (sort[1]) {
		// 	sortBy[sort[0]] = sort[1];
		// } else {
		// 	sortBy[sort[0]] = "asc";
		// }
		var searchJson = { 
			title: { $regex: new RegExp('^'+search+'.*','i')} 
		}

		if(playingNow !== "all"){
			searchJson.nowPlaying = playingNow
			//nowPlaying: 
		}
			
		
	
		const movies = await Movie.find(searchJson)
			//.where("genres")
			//.in([...genres])
			.sort(sort)
			.skip(page * limit)
			.limit(limit);
		

		const total = await Movie.countDocuments({
			genres: { $in: [...genres] },
			name: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			genres: genreOptions,
			movies,
		};

		res.status(200).json(response);
		
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

module.exports = router;