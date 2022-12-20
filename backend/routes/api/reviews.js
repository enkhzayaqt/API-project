const { urlencoded } = require('express');
const express = require('express');

const { Spot, User, SpotImage, Review, ReviewImage } = require('../../db/models');
const { restoreUser , requireAuth} = require('../../utils/auth');

const router = express.Router();

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                attributes: {
                    exclude: [
                      'createdAt',
                      'updatedAt'
                    ]
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            },

        ]
    })
    res.json({
        Reviews: reviews
    })
})


module.exports = router;
