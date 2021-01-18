const express = require('express');
const path = require('path');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

console.log(__dirname);
console.log(path.join(__dirname, '../public'));

const app = express();

//Define paths for Express config
const publicDir = path.join(__dirname, '../public');
const viewsDir = path.join(__dirname,'../templates/views');
const partialPath = path.join(__dirname,'../templates/partials');

app.set('view engine', 'hbs');//Setting up hbs
app.set('views', viewsDir); //Customizing path of views

hbs.registerPartials(partialPath);

app.use(express.static(publicDir)) //Serving static files

app.get('', (req,res)=>{
     res.render('index',{
         title: "Weather",
         name: "Sitaram Upadhya"
     });
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title: "About",
        name: "Sitaram Upadhya"

    })
})

app.get('/help', (req,res)=>{
    res.render('help',{
        title: "Help",
        name: "Sitaram Upadhya",
        message: "This is a help page for weather App"
    })
})



app.get('/weather', (req,res) =>{

    if(!req.query.address){
       return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location}={})=>{
        if(error){
           return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error , forecastData)=>{
            if(error){
                return res.send({
                    error
                })
            }

            res.send({
                location,
                forecastData,
                address: req.query.address

            })

        })



    })
    
})



app.get('/help/*', (req, res)=>{
    res.render('errPage',{
        title: "Oopps!!!",
        message: "Data not found",
        name: 'Sitaram Upadhya'
    })

})

app.get('*',(req, res)=>{
    res.render('errPage',{
        title: "Oopps!!",
        message: "Page not found",
        name: "Siataram Upadhya"
    })

})

app.listen(3000, () =>{
    console.log('Listening');
});