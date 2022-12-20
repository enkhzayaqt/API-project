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
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviws';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1,2,3]
      }
    }, {})
  }
};
