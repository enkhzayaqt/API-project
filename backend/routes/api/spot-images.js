const { urlencoded } = require('express');
const express = require('express');

const { Spot, User, SpotImage, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const deleteImage = await SpotImage.findByPk(req.params.imageId);
    if (deleteImage) {
        const spot = await Spot.findByPk(deleteImage.spotId);

        if (spot) {
            //Authorization
            if (req.user.id !== spot.ownerId) {
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
        message: "Spot Image couldn't be found",
        statusCode: 404
    })
})
module.exports = router;
