// const router = require('express').Router();
// //const { Router } = require('express');
// const { Sequelize } = require("sequelize");
// const { Country, Activities } = require('../db');
// const axios = require('axios');

// //const router = Router();


// router.post('/activities', async (req, res) => {
//     let { country, name, difficulty, duration, season } = req.body

//     let activity = await Activities.findAll({
//         where: { name: name }
//     });
//     if (activity.length === 0) {


//         console.log('dale que saleeeeee juani booboooooo')
//         activity = await Activities.create({ name, difficulty, duration, season })

//     } else {
//         activity = activity[0]
//     }


//     country.forEach(async (c) => {

//         let country = await Country.findAll({
//             where: { id: c }
//         })



//         activity.addCountry(country)


//     });






//     res.status(200).send(activity)

// })

// module.exports = router;