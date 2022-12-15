const express = require('express');

const { Spot } = require('../../db/models');

const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
    console.log('AAAA', req.user)
    const spots = await Spot.findAll();

    return res.json(spots);
    }
);

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spots = await Spot.findByPk(req.params.spotId);
    if (!spots) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }
    return res.json(spots);
    }
);

router.post('/', async (req, res, err) => {
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = await Spot.create({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
        res.status(201);
        res.json(spot)
    } catch (err) {
        res.status(400);
        res.json({
            message: 'Validation Error',
            details: {
                "address": "Street address is required",
                "city": "City is required",
                "state": "State is required",
                "country": "Country is required",
                "lat": "Latitude is not valid",
                "lng": "Longitude is not valid",
                "name": "Name must be less than 50 characters",
                "description": "Description is required",
                "price": "Price per day is required"
              }
        })
    }
})

module.exports = router;
