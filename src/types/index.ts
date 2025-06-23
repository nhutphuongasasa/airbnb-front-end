
// export type safeListing =Omit<
//   Listing,
//   "createAt"
// > & {
//   createAt: string
// }

// export type SafeReservation = Omit<
//   Reservation,
//   "createAt" | "startDate" | "endAt" | "listing"
// >&{
//   createAt: string,
//   endAt: string,
//   startDate: string,
//   listing: safeListing
// }

// export type SafeUser = Omit<
//   User,
//   "createdAt" | "updatedAt" | "emailVerified"
// > & {
//   createdAt?: string;
//   updatedAt?: string;
//   emailVerified?: string | null;
// };


export interface SafeUser {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  hashedPassword?: string;
  favoriteIds: string[];
  createdAt?: string;
  updatedAt?: string;
  emailVerified?: string | null;
}

export interface SafeReservation {
  id: string;
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createAt: string;
  listing: SafeListing;
}

export interface SafeListing {
  id: string;
  title: string;
  description: string;
  imageSrc: string[];
  createAt: string;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  userId: string;
  price: number;
}
