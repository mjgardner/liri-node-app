require("dotenv").config();
var axios = require("axios");
var keys = require("./keys");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");

switch (process.argv[2]) {
  case "concert-this":
    concert(process.argv.splice(3).join("+"));
    break;
  case "spotify-this-song":
    song(process.argv.splice(3).join(" "));
    break;
  case "movie-this":
    movie(process.argv.splice(3).join("+"));
    break;
  case "do-what-it-says":
    break;
}

function concert(artist) {
  var url =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";
  axios
    .get(url)
    .then(function(response) {
      for (show of response.data) {
        console.log("Venue: " + show.venue.name);
        console.log(
          "Location: " +
            show.venue.city +
            ", " +
            (show.venue.region ? show.venue.region + ", " : "") +
            show.venue.country
        );
        console.log("Date: " + moment(show.datetime).format("MM/DD/YYYY"));
        console.log();
      }
    })
    .catch(axiosError);
}

function song(tune) {
  if (tune) {
    spotify
      .search({ type: "track", query: tune })
      .then(function(response) {
        spotifyOut(response.tracks.items[0]);
      })
      .catch(spotifyCatch);
  } else {
    spotify
      .request("https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE") // "The Sign" by Ace of Base
      .then(function(response) {
        spotifyOut(response);
      })
      .catch(spotifyCatch);
  }
}

function movie(film) {
  var url = film
    ? "http://www.omdbapi.com/?t=" + film + "&plot=short&apikey=trilogy"
    : "http://www.omdbapi.com/?i=tt0485947&plot=short&apikey=trilogy"; // Mr. Nobody (2009)
  axios
    .get(url)
    .then(function(response) {
      console.log("Title: " + response.data.Title);
      console.log("Year: " + response.data.Year);
      for (var rating of response.data.Ratings) {
        switch (rating.Source) {
          case "Internet Movie Database":
          case "Rotten Tomatoes":
            console.log(rating.Source + " rating: " + rating.Value);
        }
      }
      console.log("Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
    })
    .catch(axiosError);
}

function axiosError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an object that comes back with details pertaining to the error that occurred.
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }
  console.log(error.config);
}

function spotifyOut(data) {
  if (data) {
    console.log(
      "Artist(s): " +
        data.artists
          .map(function(artist) {
            return artist.name;
          })
          .join(", ")
    );
    console.log("Track name: " + data.name);
    if (data.preview_url) {
      console.log("Preview URL: " + data.preview_url);
    }
    console.log("Album: " + data.album.name);
  }
}

function spotifyCatch(error) {
  console.log(error);
}
