const { urlencoded } = require('express');
const express = require('express');

const { Spot, User, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

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
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage
                },
            ],
            ...pagination
        });
        let spotList = []
        spots.forEach(spot => {
            spotList.push(spot.toJSON())
        })
        spotList.forEach(spot => {
            let totalSpotStars = 0;
            spot.Reviews.forEach(review => {
                totalSpotStars += review.stars;
            });
            spot.avgRating = totalSpotStars / spot.Reviews.length;

            if (!spot.avgRating) {
                spot.avgRating = 'no reviews yet'
            }
            delete spot.Reviews
        })

        spotList.forEach(spot => {
            spot.SpotImages.forEach(image => {
                if (image.preview === true) {
                    spot.previewImage = image.url
                }
            })
            if (!spot.previewImage) {
                spot.previewImage = 'no image yet'
            }
            delete spot.SpotImages
        })

        return res.json({
            Spots: spotList,
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
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            },
        ],
    })

    let spotList = []
    spots.forEach(spot => {
        spotList.push(spot.toJSON())
    })
    spotList.forEach(spot => {
        let totalSpotStars = 0;
        spot.Reviews.forEach(review => {
            totalSpotStars += review.stars;
        });
        spot.avgRating = totalSpotStars / spot.Reviews.length;

        if (!spot.avgRating) {
            spot.avgRating = 'no reviews yet'
        }
        delete spot.Reviews
    })

    spotList.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                spot.previewImage = image.url
            }
        })
        if (!spot.previewImage) {
            spot.previewImage = 'no image yet'
        }
        delete spot.SpotImages
    })

    return res.json({
        Spots: spotList
    });
})

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User
            }
        ]
    });

    if (!spot) {
        res.status(404)
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    const editSpot = spot.toJSON();
    // review
    let totalSpotStars = 0;
    let reviewsArr = []
    editSpot.Reviews.forEach(review => {
        totalSpotStars += review.stars;
        reviewsArr.push(review)
    });
    editSpot.numReviews = reviewsArr.length
    editSpot.avgStarRating = totalSpotStars / editSpot.Reviews.length;

    if (!editSpot.avgStarRating) {
        editSpot.avgStarRating = 'no reviews yet'
    }

    delete editSpot.Reviews
    //owner
    editSpot.Owner = {
        id: spot.User.id,
        firstName: spot.User.firstName,
        lastName: spot.User.lastName
    }
    //image
    if (editSpot.SpotImages.length < 1) {
        editSpot.SpotImages = 'no images yet'
    }
    delete editSpot.User
    return res.json(editSpot);
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        res.status(404)
        res.json(
            {
                message: "Spot couldn't be found",
                statusCode: 404
            }
        )
    }
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
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        res.status(404)
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    const review = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });
    return res.json({
        Reviews: review
    })
})

// Edit a Spot
router.put('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if (spot) {
        //Authorization
        if (req.user.id !== spot.ownerId) {
            res.status(403)
            res.json({
                message: "Forbidden",
                statusCode: 403
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
            spot.save();
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
    }

    res.status(404)
    res.json({
        message: "Spot couldn't be found",
        statusCode: 404
    })
});

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.status(404)
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    if (startDate > endDate) {
        res.status(400)
        res.json({
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

        res.status(403)
        res.json({
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
        newBooking.save();
        return res.json(newBooking)
    }

    res.status(400)
    res.json({
        message: "Owner cannot book!",
        statusCode: 400
    })
})

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        res.status(404)
        res.json({
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
        res.status(403)
        res.json({
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
        spotReview.save();
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
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if (spot) {
        //Authorization
        if (req.user.id !== spot.ownerId) {
            res.status(403)
            res.json({
                message: "Forbidden",
                statusCode: 403
            })
        }
        const { url, preview } = req.body;
        const spotImage = await SpotImage.create({
            spotId: req.params.spotId,
            url,
            preview,
        })
        spotImage.save();
        return res.json({
            "id": spotImage.id,
            "url": spotImage.url,
            "preview": spotImage.preview
        });
    }
    res.status(404)
    res.json({
        message: "Spot couldn't be found",
        statusCode: 404
    })
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
        spot.save();
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
    if (spot) {
         //Authorization
         if (req.user.id !== spot.ownerId) {
            res.status(403)
            res.json({
                message: "Forbidden",
                statusCode: 403
            })
        }
        await spot.destroy();
        res.status(200)
        res.json({
            message: `Successfully deleted`,
            statusCode: 200
        });
    } else {
        res.status(404);
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})

module.exports = router;
