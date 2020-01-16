'use strict'
//express library is my server
const express = require('express');
const app = express();
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();
app.use(cors());
const PORT = process.env.PORT || 3001;

//define routes
app.get('/', homeHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.use('*', nonFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

//LOCATION


function homeHandler(req, res) {
  res.status(200).send('Server is alive this is the home page');
}


function locationHandler(req, res) {

  let city = req.query.city;
  let key = process.env.LOCATION_IQ_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;

  if (location[url]) {
    response.send(locations[url]);
  } else {
    superagent.get(url)
      .then(data => {
        const geoData = data.body[0];
        const locationData = new Location(city, geoData);
        locations[url] = locationData;
        response.send(locationData);
      })
      .catch((error) => {
        errorHandler('You done messed up A A Ron', req, res);
      })
  }
}



function errorHandler(error, request, response) { console.log('ERROR',error);
  response.status(500).send(error);
}

function nonFoundHandler(request, response) {response.status(404).send('eh eh eh, thats not the pathwords')
};

//constructor
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
  console.log(this)

}

// function weatherHandler(request,response){
//   // get data from darksky.json
//   try {
//     let weatherresponseArray = [];
//     console.log('the weather data is working');
//     const weatherData = require('./data/darksky.json');
//     let weatherArray = weatherData.daily.data;

//     weatherresponseArray = weatherArray.map(obj => new WeatherObject(obj));

//     console.log('this is my wweather response array', weatherresponseArray);

//     response.send(weatherresponseArray);
//     response.status(200).json(weatherresponseArray);
//   }
//   catch (error) {
//     errorHandler ('not today', request, response);
//   }
// }

//WEATHER
function weatherHandler(req, res) {
  // res.status(200).send('Server is alive this is the weather page');
  try {
    const weatherData = require('./data/darksky.json');
    let weatherDataArray = [];
    let weatherArray = weatherData.daily.data;
    // console.log('weather data',weatherArray);
    // console.log('we are in handler',weatherArray);
    //  weatherArray.forEach((obj) => {
    //   let day = new Weather(obj);
    //   weatherDataArray.push(day);
    // console.log('this is the day log',day);
    //code from class demo
    superagent.get(url)
      .then(data => {
        const weatherSummaries = data.body.daily.data.map(day => {
          return new Weather(day);
        });
        response.status(200).json(weatherSummaries);
      });

    console.log('this is the new array', weatherDataArray);
    res.send(weatherDataArray);
    // res.status(200).json(weatherDataArray);
  }
  catch (err) {
    console.log(err);
  }


//cached Geocoding locations 
const cachedLocations = [];


//----------Functions and const area ----------
                              //-------------- Liked your next use here---------------
const findCity = (req, res, next) => {
  //does the searched city exist? if not redirect to /error
  const city = req.query.city;
  try {
    const rawData = require('./data/geo.json');
    const valid = rawData.find(cit => {
      const foundCity = cit.display_name.split(',');
      return (foundCity[0].toLowerCase() === city) ? city : null;
    })
    if (valid) {
      next();
    }
    else {
      res.status(500).json({
        status: 500,
        responseText: `Sorry, something went wrong. Check your search. Error Code: ${req.query.error}`
      })
    }
  } catch (error) {
    console.log(error);
  }

}

//constructor functions
const Location = function (city) {
  this.search_query = city.display_name.split(',')[0];
  this.formatted_query = city.display_name;
  this.latitude = city.lat;
  this.longitude = city.lon;
  console.log(this);
}

const Weather = function (data) {
  this.weather = data.daily.data.map(time => {
    return {
      forecast: time.summary,
      time: new Date(time.time * 1000).toDateString()
    }
  })
}



//CONSTRUCTOR
function Weather(daily) {
  this.forecast = daily.summary;
  this.time = new Date(daily.time * 1000).toString().slice(0, 15);

}

//constructor function

// const Weather = function(city){
//   try{
//     const weatherdata = require('./data/darksky.json/daily/data')[0];

//     console.log(weatherdata);
//     //build the object
//     this.search_query = city;
//     this.formatted_query = weatherdata.summary;


//   } 
//   catch (err) {
//     console.log(error);
//   }
// }

// /* {
//   search_query: 'Lynwood'
//   formatted_query: etc etc...'
// }}
// */



// //routes

// app.get('/location', (req,res) => {
//   console.log('hi!');
//   const reqCity = req.query.city;
//   const responseObj = new Location(reqCity);
//   console.log("in route: ",responseObj);
//   res.status(200).send(responseObj);
// })




// app.get('/weather', (req,res) => {
//   console.log('weather working');





// app.get('*',(req,res) => {
//   res.status(404).send('that route cannot be found');
// })
// //configure port
app.listen(PORT, () => { console.log(`Your server is listening on ${PORT}`) });


