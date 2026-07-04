import { RoomType } from "../../generated/prisma/enums";

export type createRoomCategoryDTO = {
  hotelId: number;
  price: number;
  roomType: RoomType;
  roomCount: number;
};
