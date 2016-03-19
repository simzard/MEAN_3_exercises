var db = require('../db/db');
var ObjectId = require('mongodb').ObjectID;

var allJokesToArray = function (callback) {
    var collection = db.get().collection('jokes');
    collection.find().toArray(function (err, results) {
        if (err) {
            callback(err);
        } else if (results.length) {
            // there was a result
            callback(null, results);
        } else {
            console.log("No documents found");
            callback(err);
        }
    });
};

// more difficult way of getting the collection: caller must in the callback iterate the cursor object
// with cursor.each(calback) ...
var allJokesCursor = function (callback) {
    var collection = db.get().collection('jokes');
    cursor = collection.find();
    callback(null, cursor);
};

var randomJoke = function (callback) {
    var collection = db.get().collection('jokes');
    collection.find().toArray(function (err, results) {
        if (err) {
            callback(err);
        } else if (results.length) {
            // there was a least one result

            // find a random joke and pass it to the callback
            var result = results[Math.floor(Math.random() * results.length)]

            callback(null, result);
        } else {
            console.log("No documents found");
            callback(err);
        }
    });
};

var findJoke = function (id, callback) {
    var collection = db.get().collection('jokes');
    collection.findOne({_id: new ObjectId(id)}, function (err, doc) {
        if (err) {
            callback(err);
        } else {
            callback(null, doc)
        }

    });
};

var deleteJoke = function (id, callback) {
    var collection = db.get().collection('jokes');
    collection.deleteOne({_id: new ObjectId(id)}, function (err, results) {
        if (err) {
            callback(err);
        } else
            callback(null, 'Joke deleted: ' + results);
    });
};

var editJoke = function (jokeToEdit, callback) {
    var collection = db.get().collection('jokes');
    if (!jokeToEdit.reference) {
        jokeToEdit.reference.author = "";
        jokeToEdit.reference.link = "";
    }
    collection.updateOne(
        {
            _id: new ObjectId(jokeToEdit._id)
        },
        {
            $set: { // basically just overwrite the original values with the new ones
                joke: jokeToEdit.joke,
                type: jokeToEdit.type,
                reference: {
                    author: jokeToEdit.reference.author,
                    link: jokeToEdit.reference.link
                }
            },
            $currentDate: {lastEdited: true} // update timestamp for this property

        }, function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, 'Joke updated: ' + results);
            }
        })

}

var addJoke = function (jokeToAdd, callback) {
    var collection = db.get().collection('jokes');
    collection.insertOne(jokeToAdd, function (err, result) {
        if (err) {
            callback(err);
        } else {
            console.log("Inserted a joke");
            callback(null, 'Joke successfully added: ' + result);
        }
    });
};

var jokeTypes = [
    'short',
    'riddle',
    'alcohol',
    'blind',
    'quote',
    'joke',
    'foot'
];

module.exports.jokeTypes = jokeTypes;
module.exports.addJoke = addJoke;
module.exports.allJokes = allJokesToArray;
//module.exports.allJokesCursor = allJokesCursor;
module.exports.randomJoke = randomJoke;
module.exports.findJoke = findJoke;
module.exports.deleteJoke = deleteJoke;
module.exports.editJoke = editJoke;
