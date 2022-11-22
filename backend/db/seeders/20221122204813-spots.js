'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '4700 arbor dr',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        lat: 123446,
        lng: 1233456,
        name: 'Arbor',
        description: 'apartment',
        price: 150
      },
      {
        ownerId: 2,
        address: '400 harold dr',
        city: 'Florida',
        state: 'FL',
        country: 'USA',
        lat: 123446,
        lng: 1233456,
        name: 'Harold',
        description: 'townhouse',
        price: 250
      },
      {
        ownerId: 3,
        address: '700 walter dr',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        lat: 123446,
        lng: 1233456,
        name: 'Walter',
        description: 'House',
        price: 350
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: {
        [Op.in]: [1,2,3]
      }
    }, {});
  }
};
