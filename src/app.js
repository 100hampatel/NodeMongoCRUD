require('./connection/db')
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const i18n = require('./i18n/i18n')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const helmet = require("helmet")
const http = require('http')
const server = http.createServer(app)
const { stream } = require('../src/helpers/loggerService')
const rateLimit = require("express-rate-limit");
// public path
const publicDirectory = path.join(__dirname, '../')
app.use(express.static(publicDirectory))
const PORT = process.env.PORT || 3000;

// view engine
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.set('view engine', 'ejs')
app.use(helmet())
app.use(helmet.hsts({ maxAge: 300, includeSubDomains: true, preload: true }));
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(function(req, res, next) {
    res.setHeader("X-XSS-Protection", "1");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', `frame-src 'none'; object-src 'none'; script-src 'self'; style-src 'self';`);

    next();
});
app.set('trust proxy', 1)
app.use(
    rateLimit({
        windowMs: 30 * 60 * 1000, // 12 hour duration in milliseconds
        max: 500,
        message: "You exceeded 30 requests in 1 hour limit!",
        headers: true,
        handler: function(req, res, /*next*/ ) {
            return res.status(429).json({
                "message": "You sent too many requests.Please try again after 30 minutes",
                "statusCode": 429
            })
        }
    })
);

    // cors
app.use(cors())
app.options('*', cors())

// logger
app.use(morgan('combined', { stream: stream }))

// language file
app.use(i18n)

server.listen(PORT, () => {
    console.log('server listening on port:', PORT)
})

app.get('/', (req, res) => {
    res.send('Testing from the node staging')
})


const contact = require('./routes/api/v1/contacts.route')
app.use('/api/v1/contact', contact)



module.exports = app;