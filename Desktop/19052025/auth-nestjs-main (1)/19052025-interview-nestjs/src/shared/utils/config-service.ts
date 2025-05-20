import { IAuthConfig, IAuthConfigAttributes } from "../config/interfaces/auth-config.interface";

export function getConfig(configInput: IAuthConfig) {
  var config: IAuthConfigAttributes;
  switch (process.env.NODE_ENV) {
    case 'prod':
    case 'production':
      config = configInput.production;
    case 'dev':
    case 'development':
      config = configInput.development;
    default:
      config = configInput.development;
  }
  return config;
}