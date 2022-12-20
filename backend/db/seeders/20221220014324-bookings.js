'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: '2022-12-01',
        endDate: '2023-01-02',
      },
      {
        spotId: 2,
        userId: 2,
        startDate: '2022-11-01',
        endDate: '2022-11-30',
      },
      {
        spotId: 3,
        userId: 3,
        startDate: '2023-01-02',
        endDate: '2023-01-15',
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1,2,3]
      }
    }, {})
  }
};
