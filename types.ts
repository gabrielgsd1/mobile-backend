export interface UserCredentials {
  email: string;
  password: string;
}

export type RegisterUserCredentials = UserCredentials & {
  name: string;
};

export type CarData = {
  Nome: string;
  Marca: string;
  AnoModelo: string;
  requestUrl: string;
};
