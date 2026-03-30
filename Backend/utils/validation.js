// Example custom validator (unused in current setup but can be extended)
const isValidObjectId = (value) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(value);
};

module.exports = {
  isValidObjectId,
};