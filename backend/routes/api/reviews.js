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

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);

    if (review && (review.userId === req.user.id)) {
        await review.destroy();
        res.status(200)
        res.json({
            message: `Successfully deleted`,
        });
    } else {
        res.status(404);
        res.json({
            message: "Review couldn't be found",
        })
    }
})
module.exports = router;
