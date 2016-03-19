//var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/test');

var JokeSchema = new Schema({
    joke: {type: String, minlength: 5},
    type: [String],
    reference: {
        author: String,
        link: String
    },
    lastEdited: Date
});

// on every save, add the date
JokeSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.lastEdited = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.lastEdited)
        this.lastEdited = currentDate;

    next();
});

var Joke = mongoose.model('Joke', JokeSchema);

var allJokes = function (callback) {

    Joke.find(function (err, jokes) {
        if (err) {
            callback(err);
        } else {
            callback(null, jokes);
        }
    })


};

var randomJoke = function (callback) {
    allJokes(function (err, results) {
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

var findJokeById = function (id, callback) {
    Joke.findById(id, function (err, joke) {
        if (err) {
            callback(err);
        } else {
            callback(null, joke);
        }
    });
};

var deleteJoke = function (id, callback) {
   Joke.remove({
       _id: id
   }, function (err, results) {
        if (err) {
            callback(err);
        } else
            callback(null, 'Joke deleted: ' + results);
    });
};

var editJoke = function (jokeToEdit, callback) {
    if (!jokeToEdit.reference) {
        jokeToEdit.reference.author = "";
        jokeToEdit.reference.link = "";
    }
    findJokeById(jokeToEdit._id, function(err, joke){
        if (err) {
            callback(err);
        }

        joke.joke = jokeToEdit.joke;
        joke.type = jokeToEdit.type;
        joke.reference = jokeToEdit.reference;
        joke.reference.author = jokeToEdit.author;
        joke.reference.link = jokeToEdit.link;

        joke.save(function(err) {
            if (err)
                callback(err);

            callback(null, 'Joke updated');
        });

    });

};

var addJoke = function (jokeToAdd, callback) {
    var newJoke = Joke({
        joke: jokeToAdd.joke,
        type: jokeToAdd.type,
        reference: {
            author: jokeToAdd.reference.author,
            link: jokeToAdd.reference.link
        }
    });
    newJoke.save(function(err) {
        if (err) {
            callback(err);
        } else {
            console.log("Inserted a joke");
            callback(null, 'Joke successfully added');
        }
    });
};

// just added for comfort - later they could be put in my own collection in the database
// however it is nice, that I don't have to hard code them in the client apps now! :)
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
module.exports.allJokes = allJokes;
module.exports.randomJoke = randomJoke;
module.exports.findJokeById = findJokeById;
module.exports.deleteJoke = deleteJoke;
module.exports.editJoke = editJoke;

