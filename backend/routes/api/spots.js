const express = require('express');

const { Spot, User } = require('../../db/models');

const { restoreUser } = require('../../utils/auth');
const { validateNewSpot} = require('../../utils/validation')

const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    return res.json(spots);
}
);

// Get all Spots owned by the Current User
router.get('/current', restoreUser, async (req, res) => {
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
}
);



router.post('/', restoreUser, async (req, res, err) => {

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



module.exports = router;
