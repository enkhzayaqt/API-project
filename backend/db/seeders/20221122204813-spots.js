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
        name: 'Private room in nature lodge',
        description: 'Spend your next vacation sipping coffee by the largest freshwater Lake in the world! This beautiful lodge is a perfect getaway into the wild side, while being in a centralized location close to natural and commercial attractions. ',
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
        name: 'Lakefront Cottage with Private Beach',
        description: 'Come and enjoy this cozy and peaceful cottage with amazing views from every room! This house sits on a private 132 feet beach with a large  patio. Start your day with a cup of coffee on the porch.  ',
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
        name: 'Magnificent 2BD Apartment ',
        description: 'Modern 2 bedroom 2 bathroom apartment offers stunning views of downtown New York skyline, from a convenient prime location in Downtown neighborhood, close to the Time Square and within walking distance of cultural city landmarks.',
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
