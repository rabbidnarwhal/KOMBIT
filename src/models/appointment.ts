export class AppointmentRequest {
  MakerId: number;
  RecepientId: number;
  ProductId: number;
  Date: string;
  LocationName: string;
  LocationCoords: string;
  Note: string;
}

export interface AppointmentResponse {
  id: number;
  userName: string;
  productName: string;
  status: string;
  date: string;
}

export class AppointmentDetailResponse {
  id: number;
  productId: number;
  makerName: string;
  recepientName: string;
  userName: string;
  productName: string;
  productSolution: string;
  productCompany: string;
  productHolding: string;
  status: string;
  date: string;
  locationName: string;
  locationCoords: string;
  note: string;
  rejectMessage: string;
  locationMap: string;
}

export interface AppointmentStatusRequest {
  Status: string;
  RejectMessage: string;
}
