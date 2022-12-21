const { urlencoded } = require('express');
const express = require('express');

const { Spot, User, SpotImage, Review, ReviewImage } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { validateNewReview } = require('../../utils/validation');

const router = express.Router();



// Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const deleteImage = await SpotImage.findByPk(req.params.imageId);
    const spot = await Spot.findOne({
        where: {
            id: deleteImage.spotId,
            ownerId: req.user.id
        }
    })
    if (deleteImage && spot) {
        await deleteImage.destroy();
        res.status(200)
        res.json({
            message: `Successfully deleted`,
        });
    } else {
        res.status(404);
        res.json({
            message: "Spot Image couldn't be found",
        })
    }
})
module.exports = router;
