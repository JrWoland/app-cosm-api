require('dotenv').config();
const APP_CONFIG = {
  MONGO_ATLAS_USER: process.env.TEST_MONGO_ATLAS_USER,
  MONGO_ATLAS_DATABASE: process.env.TEST_MONGO_ATLAS_DATABASE,
  MONGO_ATLAS_PW: process.env.TEST_MONGO_ATLAS_PW,
  JWT_KEY: process.env.TEST_JWT_KEY,
  JWT_EXPIRES_IN: process.env.TEST_JWT_EXPIRES_IN,
  CONNECTION_STRING: ``,
};
module.exports = APP_CONFIG;
