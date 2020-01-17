
//utilized the example code from the demo to organize and work out processes 

'use strict'
//express library is my server
require('dotenv').config();

const express = require('express');
// const pg = require('pg');
const PORT = process.env.PORT || 3001;
const app = express();
// const client = new pg.Client(precess.env.DATABASE_URL);
// client.on('error', err => console.error(err));
const superagent = require('superagent');
const cors = require('cors');

app.use(cors());

//define routes
// app.get('/', homeHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/events', events);

function homeHandler(req, res) {
  res.status(200).send('Server is alive this is the home page');
}


//LOCATION

// function homeHandler(req, res) {
//   res.status(200).send('Server is alive this is the home page');
// }
let locations = {};
function locationHandler(req, res) {

  let city = req.query.city;
  let key = process.env.LOCATION_IQ_KEY;
  const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;


  if (locations[url]) {
    res.send(locations[url]);

  } else {
    superagent.get(url)
      .then(data => {
        const geoData = data.body[0];

        const location = new Location(city, geoData);
        locations[url] = location;
        res.send(location);
      })
      .catch(() => {
        errorHandler('You done messed up A A Ron', req, res);
      })
    }
  }
  
  //constructor
  function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;

}
// function errorHandler(err, req, res) {
  //   console.log('ERROR', err);  
  //   res.status(500).send(err);
  // }
  
  // function notFoundHandler(req, res) {
    //   res.status(404).send('this route does not exist')  
    // };
    
    
    
    
    function weatherHandler(req, res) {
      
      let latitude = req.query.latitude;
  let longitude = req.query.longitude;
  let key = process.env.WEATHER_API_KEY;

  const url = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`;
  
  superagent.get(url)
  .then(data => {
    const weatherSummaries = data.body.daily.data.map(day => {
      return new Weather(day);
    });  
    res.status(200).json(weatherSummaries);
  })  
  .catch(() => {
    errorHandler('so sad, too bad, try agian', req, res);
  });  
  
}    

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}  

//used from the lab video Eugene shared
function events(req, res){
  let key = process.env.EVENTFUL_DB;
  let {search_query} = req.query;
  const eventUrl = `http://api.eventful.com/json/events/search?keywords=music&location=${search_query}&app_key=${key}`;
    superagent.get(eventUrl)
      .then(eventData => {
        let eventMassData =JSON.parse(eventData.text);
        let localEvent = eventMassData.events.event.map(thisEventData => {
          return new Event(thisEventData);
        })
        res.status(200).send(localEvent)
      })
      .catch(err => console.error('wow, you actually did', err));
}

const Event = function (data) {
      this.link = data.url;
     this.name = data.title;
      this.event_date = data.start_time;
      this.summary = data.description;
    
  }


app.use('*', notFoundHandler);
app.use(errorHandler);

function notFoundHandler(req, res) {res.status(404).send('clever girl');
}

function errorHandler(error, req, res) {console.log('no soup for you',error);
res.status(500).send(error);
}


app.listen(PORT, () => console.log(`Your server is listening on ${PORT}`));

