export class User {
  id: number;
  username: string;
  idNumber: string;
  idType: string;
  name: string;
  email: string;
  address: string;
  addressKoordinat: string;
  occupation: string;
  handphone: string;
  jobTitle: string;
  companyCoordinate: string;
  companyFixedCall: string;
  companyAddress: string;
  companyName: string;
  companyId: number;
  holdingName: string;
  holdingId: number;
  image: string;
  provinsiId: number;
  kabKotaId: number;
}

export class UserRequest {
  Address: string;
  AddressKoordinat: string;
  CompanyId: number;
  ProvinsiId: number;
  KabKotaId: number;
  // Email: string;
  // Handphone: string;
  JobTitle: string;
  // Name: string;
  Occupation: string;

  constructor(req: User) {
    this.Address = req.address;
    this.AddressKoordinat = req.addressKoordinat;
    this.CompanyId = req.companyId;
    this.JobTitle = req.jobTitle;
    this.Occupation = req.occupation;
    this.ProvinsiId = req.provinsiId;
    this.KabKotaId = req.kabKotaId;
  }
}
