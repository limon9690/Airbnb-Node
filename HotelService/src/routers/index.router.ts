import express from 'express';
import { HotelRouter } from './hotel.router';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to the Hotel Service API",
        success: true,
    });
})

router.use('/hotels', HotelRouter);

export default router;