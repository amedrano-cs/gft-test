export interface AccountRequest {
  userId: string;
  type: string;
  name: string;
}

export interface AccountResponse {
  _id: string;
  name: string;
  type: string;
  userId: string;
  deposits: number;
  withdrawals: number;
  balance: number;
}
