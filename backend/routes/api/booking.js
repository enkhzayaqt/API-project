const { urlencoded } = require('express');
const express = require('express');

const { Spot, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    const bookings = await Booking.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: [
                        'createdAt',
                        'updatedAt'
                    ]
                }
            },
        ]
    })
    res.json({
        Bookings: bookings
    })
})


// Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const { startDate, endDate } = req.body;
    const editBooking = await Booking.findOne({
        where: {
            id: req.params.bookingId,
            userId: req.user.id
        }
    });
    if (!editBooking) {
        res.status(404)
        res.json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    } else if (startDate > endDate) {
        res.status(400)
        res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    } else if (new Date(editBooking.endDate) < new Date()) {
        res.status(403)
        res.json({
            message: "Past bookings can't be modified",
            statusCode: 403
        })

    } else {
        if (startDate) editBooking.startDate = startDate;
        if (endDate) editBooking.endDate = endDate;
        editBooking.save();
        return res.json(editBooking)
    }

});

// Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const booking = await Booking.findOne({
        where: {
            id: req.params.bookingId,
            userId: req.user.id
        }
    });

    if (booking) {
        if (new Date() > new Date(booking.startDate)) {
            res.status(403)
            res.json({
                message: "Bookings that have been started can't be deleted",
                statusCode: 403
            })
        } else {
            await booking.destroy();
            res.status(200)
            res.json({
                message: `Successfully deleted`,
                statusCode: 200
            });
        }
    } else {
        res.status(404);
        res.json({
            message: "Booking couldn't be found",
            statusCode: 404
        })
    }
})
module.exports = router;
