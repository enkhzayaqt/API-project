const { urlencoded } = require('express');
const express = require('express');

const { Spot, User, SpotImage, Review } = require('../../db/models');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { validateNewSpot, validateNewReview } = require('../../utils/validation')

const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    return res.json(spots);
}
);

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const spot = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    })
    return res.json(spot);
})

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spots = await Spot.findByPk(req.params.spotId);
    if (!spots) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }
    return res.json(spots);
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', requireAuth, async (req, res) => {
    const review = await Review.findAll({
        where: {
            spotId: req.params.spotId
        }
    });
    return res.json({
        Reviews: review
    })
})

// Edit a Spot
router.put('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findAll({
        where: {
            id: req.params.spotId,
            ownerId: req.user.id
        }
    });

    const errors = validateNewSpot(req.body);
    if (errors.length === 0) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        spot.address = address;
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;
        res.status(201);
        res.json(spot)
    } else {
        res.status(400);
        const errResponse = {};
        errors.forEach(er => {
            errResponse[er[0]] = er[1];
        });
        res.json({
            message: 'Validation Error',
            errors: errResponse
        })
    }
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    const review = await Review.findOne({
        where: {
            spotid: req.params.spotId,
            userId: req.user.id
        }
    })

    if (review) {
        return res.json({
            message: "User already has a review for this spot",
            statusCode: 403
        })
    }

    const errors = validateNewReview(req.body);
    if (errors.length === 0) {

        const { review, stars } = req.body;
        const spotReview = await Review.create({
            spotId: req.params.spotId,
            userId: req.user.id,
            review,
            stars,
        })
        res.status(201);
        res.json(spotReview)
    } else {
        res.status(400);
        const errResponse = {};
        errors.forEach(er => {
            errResponse[er[0]] = er[1];
        });

        res.json({
            message: 'Validation Error',
            errors: errResponse
        })
    }

})

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot.ownerId === req.user.id) {
        const { url, preview } = req.body;
        const spotImage = await SpotImage.create({
            spotId: spot.id,
            url,
            preview,
        })
        return res.json(spotImage);
    } else {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }
})

// Create a Spot
router.post('/', requireAuth, async (req, res, err) => {

    const errors = validateNewSpot(req.body);
    if (errors.length === 0) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = await Spot.create({
            ownerId: req.user.id,
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
    } else {
        res.status(400);
        const errResponse = {};
        errors.forEach(er => {
            errResponse[er[0]] = er[1];
        });

        res.json({
            message: 'Validation Error',
            errors: errResponse
        })
    }

})



// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot && (spot.ownerId === req.user.id)) {
        await spot.destroy();
        res.status(200)
        res.json({
            message: `Successfully deleted`,
        });
    } else {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
        })
    }
})

module.exports = router;
