'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "https://a0.muscache.com/im/pictures/255440d6-0478-442f-9976-2c47ff587fa6.jpg?im_w=720",
      },
      {
        reviewId: 2,
        url: "https://a0.muscache.com/im/pictures/4316b6ec-2afd-4d03-bc3e-8b2887304fc3.jpg?im_w=720",
      },
      {
        reviewId: 3,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-640667961411400558/original/7cde534b-8a5a-4d2e-a38b-2fa1dd51bdf4.jpeg?im_w=720",
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: {
        [Op.in]: [1,2,3]
      }
    }, {})
  }
};
