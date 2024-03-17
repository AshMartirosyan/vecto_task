// import { api } from '.';

import $apiClient from '.';

export interface Product {
  id: number;
  title: string;
  category: string;
  brand: string;
  description: string;
  discountPercentage: number;
  images: Array<string>;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
}

export interface ResponseInfo {
  total: number;
  skip: number;
  limit: number;
}

export const getCategories = (): Promise<Array<string>> => $apiClient.get('/products/categories');
export const getProductsByCategoryName = ({
  category,
  skip,
  limit = 4,
}: {
  category: string;
  skip?: number;
  limit?: number;
}): Promise<ResponseInfo & { products: Array<Product> }> =>
  $apiClient.get(`products/category/${category}`, { params: { skip, limit } });
export const getAllProducts = ({
  skip,
  limit = 10,
}: {
  skip?: number;
  limit?: number;
}): Promise<ResponseInfo & { products: Array<Product> }> =>
  $apiClient.get('products', { params: { skip, limit } });

export const getProduct = (id: number): Promise<Product> => $apiClient.get(`products/${id}`);

export const searchProduct = (
  search: string,
): Promise<ResponseInfo & { products: Array<Product> }> =>
  $apiClient.get('/products/search', { params: { q: search } });
