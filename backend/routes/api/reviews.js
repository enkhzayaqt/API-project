const { urlencoded } = require('express');
const express = require('express');

const { Spot, User, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateNewReview } = require('../../utils/validation');

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
                },
                include: {
                    model: SpotImage
                }
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            },
        ]
    })

    let reviewList = []
    reviews.forEach(review => {
        reviewList.push(review.toJSON());
    })

    reviewList.forEach(review => {
        review.Spot.SpotImages.forEach(image => {
            if (image.preview === true) {
                review.Spot.previewImage = image.url
            }
        })
        if (!review.Spot.previewImage) {
            review.Spot.previewImage = 'no image'
        }
        delete review.Spot.SpotImages
    })

    res.json({
        Reviews: reviewList
    })
})


// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body;

    const review = await Review.findOne({
        where: {
            id: req.params.reviewId,
            userId: req.user.id
        }
    })

    if (review) {
        const images = await ReviewImage.findAll({
            where: {
                reviewId: req.params.reviewId
            }
        })
        if (images.length < 10) {
            const reviewImage = await ReviewImage.create({
                reviewId: req.params.reviewId,
                url,
            })
            reviewImage.save()
            return res.json({
                'id': reviewImage.id,
                'url': reviewImage.url
            })
        } else {
            res.status(403)
            res.json({
                message: "Maximum number of images for this resource was reached",
                statusCode: 403
            })
        }

    }
    res.status(404)
    res.json({
        message: "Review couldn't be found",
        statusCode: 404
    })
})


// Edit a Review
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    const editReview = await Review.findOne({
        where: {
            id: req.params.reviewId,
            userId: req.user.id
        }
    });
    if (!editReview) {
        res.status(404)
        res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }
    const errors = validateNewReview(req.body);
    if (errors.length === 0) {
        const { review, stars } = req.body;
        editReview.review = review;
        editReview.stars = stars;
        editReview.save();
        res.status(200);
        res.json(editReview)
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

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);

    if (review && (review.userId === req.user.id)) {
        await review.destroy();
        res.status(200)
        res.json({
            message: `Successfully deleted`,
            statusCode: 200
        });
    } else {
        res.status(404);
        res.json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }
})
module.exports = router;
