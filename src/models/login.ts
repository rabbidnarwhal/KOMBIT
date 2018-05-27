export class LoginRequest {
  Username: string;
  Password: string;
}

export class LoginResponse {
  id: number;
  idNumber: string;
  username: string;
  name: string;
  email: string;
  companyId: number;
  holdingId: number;
}
