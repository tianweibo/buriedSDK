import cloud from '@tbmp/mp-cloud-sdk';
declare type HttpRequestMethod = "GET" | "POST";
/**
 * 发起一个Http请求
 * @param method 请求类型，GET 或 POST
 * @param url 请求地址
 * @param data 请求数据
 */
async function httpRequest(method: HttpRequestMethod, url: string, data: any = {}): Promise<any> {
    const startTime = +new Date();
    console.log(data,'dataPoint')
    cloud.init({env:data.is_prod?'online':'test'})
    try {
        const _data: any = {};
        const _params = {
            ...data,
        };
        if (method == "GET") {
        } else {
            _data.body = _params;
        }
        let result: any = {};
        result = await cloud.application.httpRequest({
            path: url, //不需要完整域名，只需要接口访问路径即可
            method: method,
            headers: { "Content-Type": "application/json" },
            exts: {
                timeout: 10000,
                //cloudAppId: 7606
                //cloudAppId: 31017
                cloudAppId: 34134
            }, //对于一个小程序关联多个云应用的场景，调用非默认云应用，需要指定对应的云应用Id,超时时间单位ms
            ..._data,
        });
        return result.data || result;
    } catch (err) {
        if (JSON.stringify(err).indexOf("mtop请求错误") >= 0) {
            throw { msg: "当前网络异常" };
        }
        throw (err || { msg: "服务器异常" });
    }
}

function get(url: string, data = {}): Promise<any> {
    return httpRequest("GET", url, data);
}

function post(url: string, data = {}): Promise<any> {
    return httpRequest("POST", url, data);
}

export default {
    httpRequest,
    get,
    post,
};
