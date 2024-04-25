require("dotenv").config();

module.exports = {
    PORT:  process.env.PORT,
    DB_AUTH_URL: process.env.DB_AUTH_URL,
    APP_URL: process.env.PROJECT_URL,
    PAGINATION_LIMIT: 10,
    SERVERERROR: 500,
    FAILURE: 400,
    UNAUTHORIZED: 401,
    SUCCESS: 200,
    MAINTANANCE: 503,
    RESUBMIT_STATUS: 6,
    META_STATUS_0: 0,
    META_STATUS_1: 1,
}