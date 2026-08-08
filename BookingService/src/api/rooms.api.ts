import axios from "axios";
import { serverConfig } from "../config";

const internalHeaders = {
  "x-internal-api-key": serverConfig.INTERNAL_API_KEY,
};

export const getAvailableRooms = async (
  roomCategoryId: number,
  checkInDate: string,
  checkOutDate: string,
) => {
  try {
    const response = await axios.get(
      `${process.env.HOTEL_SERVICE_URL}/available-rooms`,
      {
        params: {
          roomCategoryId,
          startDate: checkInDate,
          endDate: checkOutDate,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    throw error;
  }
};

export const updateBookingIdToRooms = async (
  bookingId: number,
  roomIds: number[],
) => {
  try {
    const response = await axios.put(
      `${process.env.HOTEL_SERVICE_URL}/update-booking-id`,
      {
        bookingId,
        roomIds,
      },
      { headers: internalHeaders },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating booking ID to rooms:", error);
    throw error;
  }
};

export const releaseRoomsByBookingId = async (bookingId: number) => {
  try {
    const response = await axios.put(
      `${process.env.HOTEL_SERVICE_URL}/release-booking-rooms`,
      {
        bookingId,
      },
      { headers: internalHeaders },
    );
    return response.data;
  } catch (error) {
    console.error("Error releasing rooms for booking:", error);
    throw error;
  }
};
