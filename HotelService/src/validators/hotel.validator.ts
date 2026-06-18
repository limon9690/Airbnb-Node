import { z } from "zod";

export const createHotelSchema = z.object({
    name : z.string().min(1),
    address : z.string().min(1),
    location : z.string().min(1),
    rating : z.number().optional(),
});