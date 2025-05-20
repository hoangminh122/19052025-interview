export interface IFetchAttributes {
  method: string;
  params?: any;
  body?: any;
  headers?: any;
}

export interface IAuthConfigAttributes {
  host: string;
  endpoint?: string;      //  /auth/token
}

export interface IAuthConfig {
  development: IAuthConfigAttributes;
  production: IAuthConfigAttributes;
}
