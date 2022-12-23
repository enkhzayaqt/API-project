const { urlencoded } = require('express');
const express = require('express');

const { Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();


// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const deleteImage = await ReviewImage.findByPk(req.params.imageId);
    if (deleteImage) {
        const review = await Review.findByPk(deleteImage.reviewId)
       
        if (review) {
            //Authorization
            if (req.user.id !== review.userId) {
                res.status(403)
                res.json({
                    message: "Forbidden",
                    statusCode: 403
                })
            }

            await deleteImage.destroy();
            res.status(200)
            res.json({
                message: `Successfully deleted`,
                statusCode: 200
            });
        }
    }
    res.status(404);
    res.json({
        message: "Review Image couldn't be found",
        statusCode: 404
    })
})
module.exports = router;
