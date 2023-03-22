const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors
      .array()
      .map((error) => `${error.msg}`);

    const err = Error('Bad request.');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad request.';
    next(err);
  }
  next();
};


// function validateNewSpot(data) {
//   const errors = [];
//   if (!data.address) errors.push(["address", "Street address is required"]);
//   if (!data.city) errors.push(["city", "City is required"]);
//   if (!data.state) errors.push(["state", "State is required"]);
//   if (!data.country) errors.push(["country", "Country is required"]);
//   if (!data.lat) errors.push(["lat", "Latitude is not valid"]);
//   if (!data.lng) errors.push(["lng", "Longitude is not valid"]);
//   if (!data.name) errors.push(["name", "Name must be less than 50 characters"]);
//   if (!data.description) errors.push(["description", "Description is required"]);
//   if (!data.price) errors.push(["price", "Price per day is required"]);
//   return errors;
// }

function validateNewReview(data) {
  const errors = [];
  if (!data.review) errors.push(["review", "Review text is required"]);
  if (!data.stars) errors.push(["stars", "Stars must be an integer from 1 to 5"]);
  return errors;
}


function validateQueryParams(data) {
  const errors = [];
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = data;

  if (parseInt(page) < 1 || parseInt(page) > 10 ) errors.push(["page", "Page must be greater than or equal to 1"]);
  if (parseInt(size) < 1 || parseInt(size) > 20) errors.push(["size", "Size must be greater than or equal to 1"]);
  if (minPrice && parseFloat(minPrice) < 0) errors.push(["minPrice", "Minimum price must be greater than or equal to 0"]);
  if (maxPrice && parseFloat(maxPrice) < 0) errors.push(["maxPrice", "Maximum price must be greater than or equal to 0"]);

  if (maxLat || parseFloat(maxLat) < -90 || parseFloat(maxLat) > 90) errors.push(["maxLat", "Maximum latitude is invalid"]);
  if (minLat || parseFloat(minLat) < -90 || parseFloat(minLat) > 90) errors.push(["minLat", "Minimum latitude is invalid"]);
  if (maxLng || parseFloat(maxLng) < -180 || parseFloat(maxLng) > 180) errors.push(["maxLng", "Maximum longitude is invalid"]);
  if (minLng || parseFloat(minLng) < -180 || parseFloat(minLng) > 180) errors.push(["minLng", "Minimum longitude is invalid"]);
  return errors;
}

module.exports = {
  handleValidationErrors, validateNewReview, validateQueryParams
};
