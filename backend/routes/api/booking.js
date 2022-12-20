const { urlencoded } = require('express');
const express = require('express');

const { Spot, User, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');
const { restoreUser, requireAuth } = require('../../utils/auth');
const { validateNewReview } = require('../../utils/validation');

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
// router.put('/:bookingId', requireAuth, async (req, res, next) => {
//     const editBooking = await Booking.findOne({
//         where: {
//             id: req.params.bookingId,
//             userId: req.user.id
//         }
//     });
//     if (!editBooking) {
//         res.json({
//             message: "Booking couldn't be found",
//             statusCode: 404
//         })
//     }
//     const { startDate, endDate } = req.body;
//     if (startDate) editBooking.startDate = startDate;
//     if (endDate) editBooking.endDate = endDate;
//     res.json(editBooking)

//     if (startDate > endDate) {
//         return res.json({
//             message: "Validation error",
//             statusCode: 400,
//             errors: {
//               endDate: "endDate cannot come before startDate"
//             }
//           })
//     }

// });

// // Delete a Booking
// router.delete('/:bookingId', requireAuth, async (req, res) => {
//     const booking = await Booking.findByPk(req.params.bookingId);

//     if (booking && (booking.userId === req.user.id)) {
//         await booking.destroy();
//         res.status(200)
//         res.json({
//             message: `Successfully deleted`,
//         });
//     } else {
//         res.status(404);
//         res.json({
//             message: "Booking couldn't be found",
//         })
//     }
// })
module.exports = router;
