export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    createdAt: string;
}

export interface ProductDto {
  name: string;
  price: number;
  description: string;
}