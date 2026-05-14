export interface PaymentRequest {
  firstName: string;
  lastName: string;
  zipCode: string;
  cardNumber: string;
}

export interface PaymentResponse {
  id: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  createdAt: string;
}