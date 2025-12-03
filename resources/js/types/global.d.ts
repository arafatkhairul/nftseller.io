import { AxiosInstance } from 'axios';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    var route: (name?: string, params?: any, absolute?: boolean, config?: any) => string;
}
