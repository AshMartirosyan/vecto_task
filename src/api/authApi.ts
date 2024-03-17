import $apiClient from '.';

export interface LogInData {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface LogInResponse extends User {
  token: string;
}

export const login = (data: LogInData): Promise<LogInResponse> =>
  $apiClient.post('/auth/login', data);
export const getMe = (): Promise<User> => $apiClient.get('/auth/me');
