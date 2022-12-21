const { urlencoded } = require('express');
const express = require('express');

const { Spot, User, SpotImage, Review, ReviewImage } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { validateNewReview } = require('../../utils/validation');

const router = express.Router();



// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const deleteImage = await ReviewImage.findByPk(req.params.imageId);
    if (deleteImage) {
        const review = await Review.findOne({
            where: {
                id: deleteImage.reviewId,
                userId: req.user.id
            }
        })
        if (review) {
            await deleteImage.destroy();
            res.status(200)
            res.json({
                message: `Successfully deleted`,
            });
        }
    }
    res.status(404);
    res.json({
        message: "Review Image couldn't be found",
    })
})
module.exports = router;
