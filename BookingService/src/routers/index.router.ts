import express from 'express';
import { bookingRouter } from './booking.router';

const v1Router = express.Router();

v1Router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

v1Router.use('/bookings', bookingRouter);

export default v1Router;