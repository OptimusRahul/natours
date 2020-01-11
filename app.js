const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//--------------- Access Control Allow Origin -----------------
app.use(cors());
//api.natours.com, front-end natours.com
// app.use({
//   origin: "https://www.natours.com"
// });

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

app.use(express.static(path.join(__dirname,'public'))); //Serving static files

//1) GLOBAL MIDDLEWARES
//Security HTTP Headers
app.use(helmet());

//Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour'
});

app.use('/api',limiter);

app.post('/webhook-checkout', express.raw({ type: 'application'}), bookingController.webhookCheckOut);

//Body parser, reading data from body in req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
app.use(cookieParser());



//Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration', "ratingsQuantity", "ratingsAverage", "maxGroupSize", "difficulty", "price"
  ]
}));

app.use(compression());

//Test middlware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//2) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;