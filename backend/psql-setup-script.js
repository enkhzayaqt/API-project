const { sequelize } = require('./db/models');

// This code checks to see if the schema name you have defined as
// an environment variable is already present in the database.
// If it is not, sequelize executes the SQL command to create that schema within the database.
sequelize.showAllSchemas({ logging: false }).then(async (data) => {
  if (!data.includes(process.env.SCHEMA)) {
    await sequelize.createSchema(process.env.SCHEMA);
  }
});
