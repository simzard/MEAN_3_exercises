var ObjectId = require('mongodb').ObjectID;
var jokes = require('./jokes');

var connection_string = "mongodb://localhost:27017/test";
db.connect(connection_string, function (err) {
    if (err) {
        console.log("Could not connect to Database");
        return;
    } else
        console.log("Connected to test database");

    console.log('Testing delete:')
    jokes.deleteJoke('56e04062c32fbce36b552406', function (err, result) {
        if (err) {
            throw err;
        } else {
            console.log("result: " + result);
            console.log('\nTesting allJokesToArray()');
            jokes.allJokesToArray(function (err, results) {
                if (err) {
                    throw err;
                } else {
                    for (var i = 0; i < results.length; i++) {
                        console.log(results[i]._id)
                        console.log(results[i].joke)



                    }
                    console.log('\nTesting allJokesCursor()');
                    jokes.allJokesCursor(function (err, cursor) {
                        if (err) {
                            throw err;
                        } else {
                            cursor.each(function (err, result) {
                                if (result) {
                                    console.log(result._id)
                                    console.log(result.joke)

                                } else if (err) {
                                    throw err;

                                } else {
                                    console.log('Testing single FIND:')
                                    jokes.findJoke('56e04062c32fbce36b552404', function (err, joke) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            console.log("joke: " + joke.joke)
                                        }
                                    })

                                }
                            });
                        }
                    })
                }
            })
        }
    })



});


