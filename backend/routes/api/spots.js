const express = require('express');

const { Spot } = require('../../db/models');

const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();

    return res.json(spots);
    }
);

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spots = await Spot.findByPk(req.params.spotId);
    if (!spots) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }
    return res.json(spots);
    }
);

module.exports = router;
