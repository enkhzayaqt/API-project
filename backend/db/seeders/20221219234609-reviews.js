'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: 'good',
        stars: 4,
      },
      {
        spotId: 2,
        userId: 2,
        review: 'bad',
        stars: 2,
      },
      {
        spotId: 3,
        userId: 3,
        review: 'very good',
        stars: 5,
      },
      {
        spotId: 4,
        userId: 1,
        review: 'A terrific place to relax, unwind and celebrate. The grounds were beautiful and the villa lived up to its description.',
        stars: 4,
      },
      {
        spotId: 5,
        userId: 2,
        review: 'excellent stay. great hosts. Very thoughtful and upgraded our room to the suite as it was vacant and we were travelling with a small baby. ',
        stars: 5,
      },
      {
        spotId: 6,
        userId: 3,
        review: 'Fabulous location, great pool area, lovely room with excellent air conditioning',
        stars: 5,
      },
      {
        spotId: 7,
        userId: 1,
        review: 'good',
        stars: 4,
      },
      {
        spotId: 8,
        userId: 2,
        review: 'bad',
        stars: 2,
      },
      {
        spotId: 9,
        userId: 3,
        review: 'We had an incredible stay at Jean-Louis’ glorious château, set within the idyllic environs of vineyards as far as the eye can see. ',
        stars: 5,
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1,2,3]
      }
    }, {})
  }
};
