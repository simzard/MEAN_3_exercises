var express = require('express');
var router = express.Router();
var jokes = require('../model/jokes');
var db = require('../db/db');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/joke');
});

router.get('/joke', function (req, res, next) {
    if (req.session.jokeCount) {
        req.session.jokeCount++;
    } else {
        req.session.jokeCount = 1;
    }
    res.render('index', {userName: req.session.userName});
});

router.get('/randomJoke', function (req, res, next) {

    jokes.randomJoke(function(err, randomJoke) {
        if (err) {
            throw err;
        } else {
            var theJoke = {
                joke: "No jokes in database"
            }
            if (!randomJoke) {
                randomJoke = theJoke;
            }
            res.render('random-joke', {joke: randomJoke});
        }
    })


});

router.get('/jokes', function (req, res, next) {

    if (req.session.jokesCount) {
        req.session.jokesCount++;
    } else {
        req.session.jokesCount = 1;
    }

    jokes.allJokes(function (err, results) {
        if (err) {
            throw err;
        } else {
            res.render('show-all-jokes', {jokes: results});
        }
    })
});

router.get('/addJoke', function (req, res, next) {
    res.render('create-joke', {
        jokeTypes: jokes.jokeTypes
    });
});

router.get('/showJoke/:id', function(req, res, next) {
    jokes.findJoke(req.params.id, function(err, theJoke) {
        if (err) {
            throw err;
        } else {
            res.render('show-joke', {
                joke: theJoke,
                jokeTypes: jokes.jokeTypes
            });
        }

    });
});

router.get('/deleteJoke/:id', function(req, res, next) {
    jokes.deleteJoke(req.params.id, function(err, result) {
        console.log("This should be deleted:" + req.param.id)
        if (err) {
            throw err;
        } else {
            console.log("Joke deleted: " + result)

        }
    });
    jokes.allJokes(function (err, results) {
        if (err) {
            throw err;
        } else {
            res.render('show-all-jokes', {jokes: results});
        }
    })

})

router.post('/editJoke/', function(req, res, next) {
    var jokeToEdit = {
        _id: req.body.jokeid,
        joke: req.body.joketext,
        type: req.body.checkboxes, //just get types from the checkboxes array (in the jade)
        reference: {
            author: req.body.author,
            link: req.body.link
        }
        //lastEdited: new Date()
    };

    jokes.editJoke(jokeToEdit, function(err, result) {
        if (err) {
            throw err;
        } else {
            res.render('show-joke', {
                joke: jokeToEdit,
                result: result,
                jokeTypes: jokes.jokeTypes
            });
        }
    });
})

router.post('/storeJoke', function (req, res, next) {
    if (req.session.storeJokeCount) {
        req.session.storeJokeCount++;
    } else {
        req.session.storeJokeCount = 1;
    }

    var jokeToAdd = {
        joke: req.body.joketext,
        type: req.body.checkboxes, //just get types from the checkboxes array (in the jade)
        reference: {
            author: req.body.author,
            link: req.body.link
        },
        lastEdited: new Date()
    };

    jokes.addJoke(jokeToAdd, function(err, result) {
        if (err) {
            throw err;
        } else {
            res.render('create-joke', {
                result: result,
                jokeTypes: jokes.jokeTypes
            });
        }
    });

});

router.get('/login', function (req, res, next) {
    res.render('login');
});

// ************************ API ***********************************
router.get('/api/joke/random', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    jokes.randomJoke(function(err, randomJoke) {
        if (err) {
            throw err;
        } else {
            var theJoke = {
                joke: "No jokes in database"
            };
            if (!randomJoke) {
                randomJoke = theJoke;
            }
            res.end(JSON.stringify({"joke": randomJoke}))
        }
    })

});

router.get('/api/jokes', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    jokes.allJokes(function (err, results) {
        if (err) {
            throw err;
        } else {
            res.end(JSON.stringify({"jokes": results}))
        }
    })

});

router.post('/api/joke', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var jokeToAdd = {
        joke: req.body.joke,
        type: req.body.type,
        reference: {
            author: req.body.author,
            link: req.body.link
        },
        lastEdited: new Date()
    };
    console.log("jokeToAdd: " + jokeToAdd);
    jokes.addJoke(jokeToAdd, function(err, result) {
        if (err) {
            throw err;
        } else {
            res.end(JSON.stringify({"message": "Joke added"}))
        }
    });
});

router.put('/api/joke', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var jokeToEdit = {
        _id: req.body.id,
        joke: req.body.joke,
        type: req.body.type, //just get types from the checkboxes array (in the jade)
        reference: {
            author: req.body.author,
            link: req.body.link
        }
        //lastEdited: new Date()
    };

    jokes.editJoke(jokeToEdit, function(err, result) {
        if (err) {
            throw err;
        } else {
            res.end(JSON.stringify({"message": "Joke edited"}));
        }
    });
});

router.delete('/api/joke/:id', function(req, res, err) {
    res.setHeader('Content-Type', 'application/json');
    jokes.deleteJoke(req.params.id, function(err, result) {
        if (err) {
            throw err;
        } else {
            res.end(JSON.stringify({"message": "Joke deleted"}));

        }
    });
});

module.exports = router;
