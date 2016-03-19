var request = require("request");

var options = {
	url: "http://localhost:3000/api/joke",
	method: "POST",
	json : true,
	body : {joke : "I'm a joker" }
}

request(options, function(error, res, body) {
	console.log(body.message);
})

var options = {
	url: "http://localhost:3000/api/jokes",
	method: "GET",
	json : true
}

request(options, function(error, res, body) {
	console.log("All jokes...")
	console.log("-------------------------")
	for (var i = 0; i < body.jokes.length; i++) {
		console.log(body.jokes[i]);
	}
})
