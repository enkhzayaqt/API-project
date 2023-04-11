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
        price: 150,
        image: 'https://a0.muscache.com/im/pictures/323b2430-a7fa-44d7-ba7a-6776d8e682df.jpg?im_w=720'
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
        price: 250,
        image: 'https://a0.muscache.com/im/pictures/2adf6ef9-e131-431b-a34e-9566e768f509.jpg?im_w=720'
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
        price: 350,
        image: 'https://a0.muscache.com/im/pictures/miso/Hosting-640667961411400558/original/4b1ebdb2-7da8-4df6-825b-bd8dc05f9ff4.jpeg?im_w=720'
      },
      {
        ownerId: 1,
        address: '300 main rd',
        city: 'Langley',
        state: 'KY',
        country: 'USA',
        lat: 123446,
        lng: 1233456,
        name: 'The Bluegrass Palace',
        description: 'There is a special place, nestled amidst the rolling hills of Kentucky bluegrass, where 29,000 square feet of unmitigated luxury welcomes you. Where the private gates open to a 9 acre idyllic paradise all your own. ',
        price: 150,
        image: 'https://a0.muscache.com/im/pictures/miso/Hosting-47051400/original/2b9c593f-2027-4f97-a1f7-6eabd4605b5c.jpeg?im_w=1200'
      },
      {
        ownerId: 2,
        address: '613 harold dr',
        city: 'Nashville',
        state: 'TN',
        country: 'USA',
        lat: 123446,
        lng: 1233456,
        name: 'Supreme Luxury for Discerning Tastes',
        description: 'Extraordinary property for discerning tastes. Upscale everything. Massive rooms (6 En suite). Heated pool* and hot tub. Outdoor gardens. Huge Theatre. Gym with high end equipment. True Golf Simulator. 9 bedrooms, 10 baths. Luxurious in every way, yet warm and family oriented. Hosts and Boasts FUN!  On 3 acres.  ',
        price: 899,
        image: 'https://a0.muscache.com/im/pictures/miso/Hosting-49504733/original/685bc6a5-4220-4370-b1da-cf8e7b57fd30.jpeg?im_w=720'
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
        price: 750,
        image: 'https://a0.muscache.com/im/pictures/miso/Hosting-640667961411400558/original/4b1ebdb2-7da8-4df6-825b-bd8dc05f9ff4.jpeg?im_w=720'
      },
      {
        ownerId: 1,
        address: 'Park Rd 4W',
        city: 'Burnet County',
        state: 'TX',
        country: 'USA',
        lat: 123446,
        lng: 1233456,
        name: 'Bavarian Castle nestled in the Texas Hill Country',
        description: 'Just minutes from several Highland Lakes and conveniently located 45 minutes NW of Austin, TX,  resides a ​14,000 square foot Bavarian inspired castle where you can be a King or a Queen for the night.  ',
        price: 1691,
        image: 'https://a0.muscache.com/im/pictures/144d9f91-cc3b-4fd0-bbcb-6ba94f98ef5b.jpg?im_w=1200'
      },
      {
        ownerId: 2,
        address: '84 Beverly ct',
        city: 'Beverly Hills',
        state: 'CA',
        country: 'USA',
        lat: 123446,
        lng: 1233456,
        name: 'Beverly Hills Maison',
        description: 'Private, gated French country chateau-inspired home sits at the end of a cul de sac on nearly 2 acres of land and is surrounded by stately trees, mature landscaping, and verdant canyon views. Beautifully living room with fireplace, formal dining room, large kitchen, and light-filled breakfast area. Spectacular canyon views from every room and nearby access to Beverly Hills, and the valley. Expansive backyard and pool area.',
        price: 2484,
        image: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-47354666/original/a2d99008-721a-4153-89e5-c3d251a0389b.jpeg?im_w=720'
      },
      {
        ownerId: 3,
        address: '100 malibu dr',
        city: 'Malibu',
        state: 'CA',
        country: 'USA',
        lat: 123446,
        lng: 1233456,
        name: 'Petra Manor',
        description: "Most villas have a great room, but this manor just north of Malibu Pier has many—even the bedrooms, cinema, and wine cave loom large. Mixing French, Italian, and Spanish design, this is Mediterranean meets Hollywood in high fashion. Linger in the pool with views of stone walls and lawn, play tennis on the private court, and host cocktails at the marble wet bar. You're 1.5 miles from the Pier.",
        price: 16160,
        image: 'https://a0.muscache.com/im/pictures/15dd8957-70d5-452a-8649-49913f40fada.jpg?im_w=720'
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
