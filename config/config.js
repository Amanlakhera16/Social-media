const path = require('path');
const logger = require('../utils/logger');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    mongo_uri: process.env.MONGODB_URL,
    client_url: process.env.CLIENT_URL,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
};

// Validation
const required = ['MONGODB_URL', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET'];
required.forEach(key => {
    if (!process.env[key]) {
        logger.error(`CRITICAL: Missing required environment variable: ${key}`);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
});

module.exports = config;
