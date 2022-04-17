declare type HttpRequestMethod = "GET" | "POST";
/**
 * 发起一个Http请求
 * @param method 请求类型，GET 或 POST
 * @param url 请求地址
 * @param data 请求数据
 */
declare function httpRequest(method: HttpRequestMethod, url: string, data?: any): Promise<any>;
declare function get(url: string, data?: {}): Promise<any>;
declare function post(url: string, data?: {}): Promise<any>;
declare const _default: {
    httpRequest: typeof httpRequest;
    get: typeof get;
    post: typeof post;
};
export default _default;
