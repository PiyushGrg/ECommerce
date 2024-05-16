export interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  createdAt: string;
  updatedAt: string;

  // for cart
  quantity: number;
  totalPrice: number;
}

export interface CategoryType {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: string;
  createdAt: string;
  updatedAt: string;
}

export interface CatchBlockErrorType {
  response: {
    data: {
      message: string;
    };
  };
  message: string;
}

export interface ConfigQuantityType {
  _id: string;
  product: ProductType;
  orderId: Order;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  _id: string;
  name: string;
  phoneNumber: string;
  city: string;
  country: string;
  postalCode: string;
  street: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingAddress {
  _id: string;
  name: string;
  phoneNumber: string;
  city: string;
  country: string;
  postalCode: string;
  street: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  products: ProductType[];
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  userId: UserType;
  amount: number;
  isPaid: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}
