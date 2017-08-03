// Global Variables
var args = process.argv;
var fs = require("fs");
var request = require("request");
var config = require("./config");
// Functions
function getTweets() {
	// Local Variables and initialize node package
	var twit = require("twit");
	var T = new twit(config.twitterKeys);
	var params = { 
		count: 20 
	}
	// API Call
	function getTwitter(err, data, response) {
		// forEach() instead of for()
	 	data.forEach(function(itm, idx, arr) {
	 		var tweet = data[idx].text;
	 		// I don't know what +0000 means so I reformat the timestamp
	 		var temp = data[idx].created_at;
	 		var created = temp.split(" ");
	 		var log = `${tweet}, ${created[0]} ${created[1]} ${created[2]} ${created[5]} ${created[3]}, \n`;
	 		// This logs the results to log.txt
	 		fs.appendFile("log.txt", log, function(err) {
	 			if(err) {
	 				return console.log("Error!");
	 			}
	 		});
	 		// Display results to the console
	 		console.log(log);
 		});	
	}
	// Run API Call
	T.get('statuses/user_timeline', params, getTwitter); 
}
function getOMDB() {
	// Allowing for different argument inputs
	if(!args[3]) {
		var fullTitle = "Mr.+Nobody";
	} else {
		var fullTitle = args[3];
		// In case movie title includes more than one word
		if(args.length > 4) {
			for(var i = 4; i < args.length; i ++) {
				fullTitle += "+" + args[i];
			}
		}
	}
	// API Call
	request("http://www.omdbapi.com/?t=" + fullTitle + "&y=&plot=short&apikey=40e9cece", function(err, response, data){
		if (!err && response.statusCode === 200) {
			var newData = JSON.parse(data);
			// Array to store all items to display
			var movie = [];
			movie.push(newData.Title);
			movie.push(newData.Year);
			movie.push(newData.imdbRating);
			if(newData.Ratings.length >= 2) {
				movie.push(newData.Ratings[1].Value);
			}
			movie.push(newData.Country);
			movie.push(newData.Language);
			movie.push(newData.Plot);
			movie.push(newData.Actors);
			// Creating a log variable from movie array
			var log = "";
			for(var i = 0; i < movie.length; i ++) {
				if(movie[i] != "Undefined" && movie[i] != "N/A") {
					// Displays to console while updating log variable
					console.log(movie[i]);
				}
				if(i != movie.length - 1) {
					log += movie[i] + " \n";
				} else {
					log += movie[i] + ", \n";
				}
				
			}
			// This will log the file to log.txt
 			fs.appendFile("log.txt", log, function(err) {
 				if(err) {
 					return console.log("Error!");
 				}
 			});
		}
	});
}
function getSpotify() {
	// Local variables initializing node package
	var spot = require('node-spotify-api');
	var spotify = new spot(config.spotifyKeys);
	if(!args[3]) {
		var fullTitle = "The+Sign";
	} else {
		var fullTitle = args[3];
		// In case the song name has more than 1 word
		if(args.length > 4) {
			for(var i = 4; i < args.length; i ++) {
				fullTitle += " " + args[i];
			}
		}
	}
	var params = { 
		type: 'track', 
		query: fullTitle 
	}

	spotify.search(params, function(err, data) {
		if (err) {
	    	return console.log('Error occurred: ' + err);
		}
		// Creating an array to store display items
		var song = [];
		song.push(data.tracks.items[0].artists[0].name);
		song.push(data.tracks.items[0].name);
		song.push(data.tracks.items[0].album.external_urls.spotify);
		song.push(data.tracks.items[0].album.name);
		// Creating a log variable to store all items
		var log = "";
		for(var i = 0; i < song.length; i ++) {
			if(song[i] != "Undefined" && song[i] != "N/A") {
				// Displaying items to console
				console.log(song[i]);
			}
			if(i != song.length - 1) {
				log += song[i] + " \n";
			} else {
				log += song[i] + ", \n";
			}
		}
		// This will log the file
		fs.appendFile("log.txt", log, function(err) {
			if(err) {
				return console.log("Error!");
			}
		});
	});
}
function getRandom() {
	// Reading from random.txt for data
	fs.readFile("random.txt", "utf8", function(err, data) {
		if(err) {
			console.log("Error: Transatcion Declined");
			return;
		}
		if(data) {
			// Converting data to an array
			var newData = data.split(", ");
			// Selecting a random item from the random.txt
			var random = Math.floor(Math.random() * 3);
			switch(newData[random]) {
				case "twitter":
					getTweets();
					break;
				case "omdb":
					var args = [];
					getOMDB();
					break;
				case "spotify":
					var args = [];
					getSpotify();
					break;
			}
		}
	});
}
// Run Code
switch(args[2]) {
    case "my-tweets":
		getTweets();
        break;
    case "movie-this":
    	getOMDB();
    	break;
    case "spotify-this-song":
    	getSpotify();
    	break;
    case "do-what-it-says":
    	getRandom();
    	break;
}