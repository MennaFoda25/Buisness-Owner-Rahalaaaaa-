const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./util/AppError');
const globalErrorHandlers = require('./controlles/errorController')

const userRouter = require('./routes/userRoutes');
const cityRouter = require('./routes/cityRoutes');
const attractiosnRouter = require('./routes/attractionRoutes');
const hotelsRouter = require('./routes/hotelRoutes');
const restaurantsRouter = require('./routes/restaurantRoutes');
const hotelReviewRoutes = require('./routes/hotelReviewRoutes');
const restaurantReviews = require('./routes/restReviewRoutes')


const app = express();

app.use(cors());

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'DEV') {
  app.use(morgan('dev'));
}

// neccessary for parsing the body of the req 
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES index

app.use('/api/users', userRouter);
app.use('/api/cities', cityRouter);
app.use('/api/hotelreviews', hotelReviewRoutes);
app.use('/api/restaurantReviews', restaurantReviews);



// dashaboard specfic endpoints 
app.use('/api/attractions', attractiosnRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/restaurants', restaurantsRouter);
//app.use('/api/')



app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl}!`, 404));
});

app.use(globalErrorHandlers)

module.exports = app;

