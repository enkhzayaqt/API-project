const { urlencoded } = require('express');
const express = require('express');

const { Spot, User, SpotImage, Review, Booking } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const { validateNewSpot, validateNewReview, validateQueryParams } = require('../../utils/validation')
const { Op } = require("sequelize");

const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
    const errors = validateQueryParams(req.query);
    if (errors.length === 0) {

        if (!page) page = 1;
        if (!size) size = 20;
        page = parseInt(page);
        size = parseInt(size);
        minLat = parseFloat(minLat);
        maxLat = parseFloat(maxLat);
        minLng = parseFloat(minLng);
        maxLng = parseFloat(maxLng);
        minPrice = parseFloat(minPrice);
        maxPrice = parseFloat(maxPrice);

        const pagination = {}
        if (page >= 1 && size >= 1) {
            pagination.limit = size;
            pagination.offset = size * (page - 1)
        }
        const where = {};
        if (maxPrice && minPrice) {
            where.price = {
                [Op.between]: [minPrice, maxPrice]
            }
        } else if (minPrice) {
            where.price = {
                [Op.gte]: [minPrice]
            }
        } else if (maxPrice) {
            where.price = {
                [Op.lte]: [maxPrice]
            }
        }

        if (maxLat && minLat) {
            where.lat = {
                [Op.between]: [minLat, maxLat]
            }
        } else if (minLat) {
            where.lat = {
                [Op.gte]: [minLat]
            }
        } else if (maxLat) {
            where.lat = {
                [Op.lte]: [maxLat]
            }
        }

        if (maxLng && minLng) {
            where.lng = {
                [Op.between]: [minLng, maxLng]
            }
        } else if (minLng) {
            where.lng = {
                [Op.gte]: [minLng]
            }
        } else if (maxLng) {
            where.lng = {
                [Op.lte]: [maxLng]
            }
        }


        const spots = await Spot.findAll({
            where,
            ...pagination
        });
        return res.json({
            spots,
            page,
            size
        });
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

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        res.json(
            {
                message: "Spot couldn't be found",
                statusCode: 404
            }
        )}
    let attributes = [], include = [];
    if (spot.ownerId === req.user.id) {
        attributes = ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
            include = [{
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }]
    }
    else attributes = ['spotId', 'startDate', 'endDate']

    const bookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        attributes,
        include
    });

    return res.json({
        Bookings: bookings
    })
})

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
    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId,
            ownerId: req.user.id
        }
    });
    if (!spot) {
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
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

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    if (startDate > endDate) {
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    }
    const existingBookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId,
            [Op.or]: [{
                startDate: {
                    [Op.between]: [new Date(startDate), new Date(endDate)],
                }
            }, {
                endDate: {
                    [Op.between]: [new Date(startDate), new Date(endDate)],
                }
            }, {
                startDate: {
                    [Op.lte]: new Date(startDate),
                },
                endDate: {
                    [Op.gte]: new Date(endDate),
                }
            }]
        }
    })
    if (existingBookings.length > 0) {

        const errors = {}
        if (new Date(existingBookings[0].startDate) > new Date(startDate) &&
            new Date(existingBookings[0].startDate) < new Date(endDate)) {
            errors.endDate = "End date conflicts with an existing booking";
        } else if (new Date(existingBookings[0].endDate) > new Date(startDate) &&
            new Date(existingBookings[0].endDate) < new Date(endDate)) {
            errors.startDate = "Start date conflicts with an existing booking";
        } else {
            errors.endDate = "End date conflicts with an existing booking";
            errors.startDate = "Start date conflicts with an existing booking";
        }

        return res.json({
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: 403,
            errors: errors
        })
    }
    if (spot.ownerId !== req.user.id) {
        const newBooking = await Booking.create({
            spotId: req.params.spotId,
            userId: req.user.id,
            startDate,
            endDate
        });
        return res.json(newBooking)
    }
})

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
            spotId: req.params.spotId,
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
    const spot = await Spot.findOne({
        id: req.params.spotId,
        ownerId: req.user.id
    })
    if (spot) {
        const { url, preview } = req.body;
        const spotImage = await SpotImage.create({
            spotId: req.params.spotId,
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
