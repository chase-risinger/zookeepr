const { animals } = require('./data/animals');

const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop thru each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array
            // remember it is initially a copy of the animals array
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            // .............................
            // Basically what this is actually saying for a normal human being to understand is this...
            // PersonalityTraitsArray is an array with one or more elements, thanks to the previous 3 lines of code
            // for each one of those traits (or for just the one trait, if only one) 
            // we have created a function that will give us filteredResults (yes again, stupid naming convention from this shit 
            // of a school) filteredResults is going to be itself filtered (I know), with each animal (element) only being allowed in the new
            // filteredResults if it's personalityTraits contains the trait(s) from personalityTraitsArray 
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}


// i guess get expects res and req (response and request), res has methods like json and send , req has query
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results)
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});



app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

