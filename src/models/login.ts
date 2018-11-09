export class LoginRequest {
  Username: string;
  Password: string;
}

export class LoginResponse {
  id: number;
  role: string;
  idNumber: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  companyId: number;
  holdingId: number;
  image: string;
}
