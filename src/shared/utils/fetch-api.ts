import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { IAuthConfigAttributes, IFetchAttributes } from '../config/interfaces/auth-config.interface';

const httpService = new HttpService();
export async function fetchApi(config: IAuthConfigAttributes, attributes?: IFetchAttributes) {
    // const config = getConfig(conf);
    return httpService
        .request({
            baseURL: config.host,
            method: attributes?.method || METHOD_REQUEST.GET,
            url: config.endpoint || '',
            data: attributes?.body,
            params: attributes?.params,
            headers:attributes?.headers
        })
        .pipe(map(response => response.data))
        .toPromise()
        .then(res => res)
        .catch(err => {
            console.log(err);
            throw err;
        });
}