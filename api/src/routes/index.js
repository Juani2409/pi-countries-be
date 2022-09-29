const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { Sequelize } = require("sequelize");
const axios = require('axios');
const { Activities, Country } = require('../db');
const e = require('express');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


const getCountries = async () => {
    const countriesUrl = await axios.get('https://restcountries.com/v3/all')
    const apiInfo = await countriesUrl.data.map(e => {
        return {
            id: e.cca3,
            name: e.name,
            flags: e.flags,
            continents: e.continents,
            capital: e.capital,
            subregion: e.subregion,
            area: e.area,
            population: e.population

        }

    })

    return apiInfo
};




const getDbInfo = async () => {
    return await Country.findAll({
        include: {
            model: Activities,
            attributes: ['name', 'difficulty', 'duration', 'season', 'id'],
            through: {
                attributes: [],
            },
        }
    })

}


const getActivitiesDbInfo = async () => {
    return await Activities.findAll({

    })

}



const getAllCountries = async () => {

    const dbInfo = await getDbInfo()
    if (dbInfo.length > 0) {
        return dbInfo
    } else {
        const apiInfo = await getCountries()

        apiInfo.forEach(e => {
            Country.create({ id: e.id, name: e.name.official, flags: e.flags[0], continents: e.continents[0], capital: CheckInfo(e.capital), population: e.population, subregion: e.subregion, area: e.area })
        })
        return apiInfo

    }
}



function CheckInfo(array) {
    if (Array.isArray(array)) { return array[0] }
    else { return 'N/D' }
}



router.get('/countries', async (req, res) => {///?name=argentine

    const { name } = req.query
    let countriesTotal = await getAllCountries();

    if (name) {
        let countrieName = await countriesTotal.filter(e => e.name.toLowerCase().includes(name.toLowerCase()))
        countrieName.length ?
            res.status(200).send(countrieName) :
            res.status(404).send('No existe el pais')

    } else {
        res.status(200).send(countriesTotal)
    }
})


router.get('/countries/:id', async (req, res) => { //'/countries/arg


    const { id } = req.params
    const country = await getAllCountries()
    if (id) {
        let countryId = await country.filter(e => e.id.toLowerCase() === id.toLowerCase())
        countryId.length ?
            res.status(200).json(countryId) :
            res.status(404).send('No existe ese pais')
    }


})



router.get('/activities', async (req, res) => {

    //const { name } = req.body
    let activitiesTotal = await getActivitiesDbInfo();



    res.status(200).send(activitiesTotal)

})



// const getActivities = async () => {
//     const activities = await axios.get('http://localhost:3001/activities')
//     const act = await activities.data.map(e => {
//         return {


//             name: e.name,
//             difficulty: e.difficulty,
//             duration: e.duration,
//             season: e.season,
//             country 
//             activities: e.activities.map(a => a)
//         }



//     })

//     return apiInfo
// };













router.post('/activities', async (req, res) => {
    let { country, name, difficulty, duration, season } = req.body

    let activity = await Activities.findAll({
        where: { name: name }
    });
    if (activity.length === 0) {


        
        activity = await Activities.create({ name, difficulty, duration, season })

    } else {
        activity = activity[0]
    }


    country.forEach(async (c) => {

        let country = await Country.findAll({
            where: { id: c }
        })



        activity.addCountry(country)


    });






    res.status(200).send(activity)

})
module.exports = router;



























  // let country = await Country.findAll({
    //     where: {id : country},
    // })
    // let activity = await Activities.findAll({
    //     where: {name : name}
    //  })


    //   if (activity.length >0) {
    //    activity[0].addCountry(country)















// let activityexists= await Activities.findAll({
//     where: {name : name},
// })
//console.log(activityexists)

//if(activityexists.length===0){
//createActivity.addCountry(country)
//}
//console.log(country)