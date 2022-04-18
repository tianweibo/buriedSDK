/* act_id: "未知"                            // 活动ID          - 需要传入 手动
act_name: "未知"                             // 活动名称         - 需要传入 手动
app: ""                                     //  ？
application_dep_platform: "crm_enbrands"    // 部署平台code     - 通过埋点平台获取传入
application_label: "common"                 // 部署平台name     - 通过埋点平台获取传入
city: ""                                    // 所属城市
device_model: ""                            // 设备幸好
distinct_id: 100                            // 用户ID          - 手动传入，标识用户唯一性的字段，埋点平台有很多未知的情况，需考虑
district: ""                                // 客户端所在的区县信息
event_code: "sjymMaidian"                   // 事件code        - 通过埋点平台获取传入
event_elements: "[]"                        // ???
event_label: "all_general"                  // 事件标签         - 通过埋点平台获取传入
event_name: "事件页面-埋点"                   // 事件name        - 通过埋点平台获取传入
event_paramters: "[]"                       // ????
event_time: 1650085480159                   // 埋入时间        
event_trigger_mode: "open"                  // 事件触发类型     - 通过埋点平台获取传入
ip: ""                                      // ip
is_interactive: false                       // 是否标准互动
is_prod: false                              // 埋点的环境       - 手动传入 true false
lat: ""                                     // 经纬度
lon: ""                                     // 经纬度
member_id: "未知"                            // 会员ID          - 手动传入
merchant_id: 100                            // 店铺ID          - 手动传入
mix_nick: "未知"                             // 混淆nick        - 手动传入
nick: "未知"                                 // nick           - 手动传入
open_id: "未知"                              //  微信平台下请务必传入正确的open_id                 - 手动传入
open_type: 1                                //  1正常数据也就是对接新埋点平台，2互动营销类的，3其他 
os: ""                                      //  系统
os_version: ""                              //  系统版本
ouid: "未知"                                 //  ouid（TB）                                   - 手动传入
phone: "未知"                                //  手机号                                       - 手动传入
platform_app: "埋点管理平台"                  //  应用名称                                      - 通过埋点平台获取传入
platform_app_code: "mdglpt"                 //  应用code                                     - 通过埋点平台获取传入
platform_app_version: "1.1.1"               //  应用版本                                      - 通过埋点平台获取传入
platform_business: "BD"                     //  部署                                         - 通过埋点平台获取传入
platform_system: "pc"                       //  系统运行的系统                                 - 通过埋点平台获取传入
provider: "未知"                             //  提供者                                       - 手动传入
province: ""                                //  客户端所在的省份
referrer: "https://bp.enbrands.com/event"   //  页面路径
runtime_env: "pc"                           //  运行环境                                     - 手动传入
screen_height: 1080                         //  设备高
screen_width: 1920                          //  设备宽
url: "/app"                                 //  页面路由
user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36"   //???
vis_carrier: ""                             //  访问载体,对于Web,填入浏览器，对于APP，填入Android或IOS的App	WEB：Mozilla。Android：MIUI iPhone：iOS，对应$browser
vis_version: ""                             //  访问载体版本
visitor_id: "" */                           //  客户端设备唯一标识，PC端填入浏览器fingerprint，手机端可填Android:IMEI/Iphone:udid	fingerprin通过JS可以获取

const host = "https://bp-receive.enbrands.com/receive/addReceive";
const host_test = "https://test-open-gateway.enbrands.com/receive/addReceive";
const host_impAna = "https://test-hd-analyse.enbrands.com/applet/reportAct";
const keys = [
    'is_prod', // 是否生产环境
    'runtime_env',
    // 事件
    // 'event_uuid', // event_uuid，server_time这两个前端不用传，由filebeat提供的
    'event_time',
    'event_name',
    'event_code',
    'event_trigger_mode',
    'event_elements',
    'event_paramters',
    'event_label',

    // 我们每个互动都要传递
    'distinct_id',
    'member_id',
    'merchant_id',
    'act_id',
    'is_interactive',
    'url',

    // 应用
    'platform_system',
    'platform_app',
    'platform_app_code',
    'platform_app_version',
    'platform_business',
    'application_dep_platform',
    'application_label',

    
    // 新增字段
    'nick',
    'mix_nick',
    'open_id',
    'phone',
    'ouid',
    'act_name',
    'provider',
    'open_type', //1正常数据也就是对接新埋点平台，2互动营销类的，3其他


    // How
    'app',
    'os',
    'os_version',
    'vis_carrier',
    'vis_version',
    'visitor_id',
    'device_model',
    'referrer',
    'screen_height',
    'screen_width',
    'user_agent',
    'utm',

    // where
    'ip',
    'lon',
    'lat',
    'province',
    'city',
    'district',
]
import { FED_PARAMS } from "./dataTypes/types.FED_PARAMS";
import {EVENT_PARAMS} from "./dataTypes/types.EVENT_PARAMS"
import axios from 'axios';
import http from "./http"
// ceshi11112222223343222
class BuriedPoint{
    public defaultSetting: Record<string, any> = {};  // 最终完成喂点传递参数
    public isPosition:boolean=false; 
    public host: string = host;
    public host_test: string = host_test;     
    public lat: FED_PARAMS["lat"] = '';
    public lon: FED_PARAMS["lon"] = '';
    public storageList: Array<EVENT_PARAMS> = [];
    public setConfig(config:Record<string,any>,next?: () => void){
        this.defaultSetting = config;
        if (config.runtime_env === 'h5' || config.runtime_env === 'pc') {
            
            if(this.isPosition){ // 获取经纬度
                navigator.geolocation && navigator.geolocation.getCurrentPosition(this.showPosition);
            }
            
        }
        next && next()        // 初始化结束之后去完成喂点等
    }
    public setAsyncConfig(config: Record<string, any>, next?:() => void) {
        this.defaultSetting = {
            ...this.defaultSetting,
            ...config
        }
        next?.();
    }
    private defaultSettingCheck (): boolean {      // 初始化值的校验
        const { defaultSetting } = this;
        if (!defaultSetting.nick) {
            console.warn('请传入旺旺号|未知');
            return false
        }
        if (!defaultSetting.mix_nick) {
            console.warn('请传入加密后的旺旺号|未知');
            return false
        }
        if (!defaultSetting.act_name) {
            console.warn('请传入活动名称|未知');
            return false
        }
        if (!defaultSetting.open_id) {
            console.warn('微信平台下请务必传入open_id|未知');
            return false
        }
        if (!defaultSetting.phone) {
            console.warn('请传入电话|未知');
            return false
        }
        if (!defaultSetting.ouid) {
            console.warn('淘宝平台下请务必传入ou_id|未知');
            return false
        }
        if (!defaultSetting.provider) {
            console.warn('请传入提供者|未知');
            return false
        }
        if (!defaultSetting.open_type) {
            console.warn('请设置open_type');
            return false
        }else if(defaultSetting.open_type!=1 && defaultSetting.open_type!=2 && defaultSetting.open_type!=3){
            console.warn('open_type的值为1正常数据也就是对接新埋点平台，2互动营销类的，3其他');
            return false
        }



        if (!defaultSetting.platform_app) {
            console.warn('请设置 platform_app, 比如 OLAY SKIN ID 肌肤测试系统');
        }

        if (!defaultSetting.platform_app_code) {
            console.warn('请设置 platform_app_code, 必须为标识该应用的唯一英文code');
        }

        if (!defaultSetting.application_label) {
            console.warn('请设置 application_label, 作为一个应用的标识');
        }

        if (!defaultSetting.platform_app_version) {
            console.warn('请设置 platform_app_version, 也就是该应用的版本');
        }

        if (!defaultSetting.platform_business) {
            console.warn('请设置 platform_business, 也就是该应用的业务平台：TB、TM、JD、WX、JZONE、DY、YZ、OTHERS');
        }
        if (!defaultSetting.application_dep_platform) {
            console.warn('请设置 application_dep_platform, 也就是该应用的部署平台');
        }

        if(!(typeof(defaultSetting.is_interactive) == 'boolean')){
            console.warn('请设置 is_interactive, 是否互动');
        }
        // -----------------标识身份-----------------
        if (!defaultSetting.merchant_id) {
            console.warn('请设置 merchant_id, 即商家店铺ID。如果没有，直接填写 "未知" ');
        }

        if (!defaultSetting.distinct_id) {
            console.warn('用户登陆的ID，大平台（淘宝、京东）侧用户ID（能区别用户唯一性），如果未登录，直接填写 "未知" ');
        }

        if (!defaultSetting.act_id) {
            console.warn('当下参与的活动ID，由当下互动活动的业务ID决定。如果没有，直接填写 "未知" ');
        }

        if (!defaultSetting.member_id) {
            console.warn('店铺会员ID，如果没有，直接填写 "未知" ');
        }

        if (typeof defaultSetting.is_prod !== 'boolean') {
            console.warn('请填写 is_prod，是否是生产环境');
        }

        if (!defaultSetting.runtime_env) {
            console.warn('请填写 runtime_env: "pc"、"h5"、"jd"、"qq"、"weapp"、"swan"、"alipay"、"tt"、"rn" ');
        }

        if (!defaultSetting.platform_app || !defaultSetting.platform_app_code || !defaultSetting.platform_app_version || !defaultSetting.platform_business || !defaultSetting.application_dep_platform || typeof defaultSetting.is_interactive !== 'boolean' || !defaultSetting.merchant_id || !defaultSetting.distinct_id || !defaultSetting.act_id || !defaultSetting.member_id || typeof defaultSetting.is_prod !== 'boolean' || !defaultSetting.application_label || !defaultSetting.runtime_env) {
            return false
        }
        return true
    }
    private eventParamsCheck(obj: EVENT_PARAMS): boolean { // 前端喂点值的校验
        const { defaultSetting } = this;
        if (!obj.event_name) {
            console.warn('请填写事件名称');
        }
        if (!obj.event_code) {
            console.warn('请填写事件code');
        }
        if (!obj.event_trigger_mode) {
            console.warn('请填写事件的trigger_mode');
        }
        if (!obj.event_label) {
            console.warn('请填写事件标签');
        }
        if (defaultSetting.runtime_env !== 'pc' && defaultSetting.runtime_env !== 'h5' && !obj.url) {
            console.warn('请填写当前事件的页面url，非网页的情况下，url为必填参数');
        }
        if (!obj.event_name || !obj.event_code || !obj.event_trigger_mode || !obj.event_label || defaultSetting.runtime_env !== 'pc' && defaultSetting.runtime_env !== 'h5' && !obj.url) {
            return false
        }
        return true
    }
    public async doFed(config: FED_PARAMS): Promise<any> {
        if (config.runtime_env === 'h5' || config.runtime_env === 'pc') {
            if (config.is_prod) {
                return axios.post(this.host, config);
            } else {
                return axios.post(this.host_test, config)
            }
        }
        if (config.runtime_env === 'alipay'){
            return http.post("/receive/addReceive",{
                ...config
            })
        }
        
        /* if (config.is_prod) {
            this.request({
                url: this.host,
                data: config
            })
        } else {
            this.request({
                url: this.host_test,
                data: config
            })
        } */ 
    }
    public get_event_time(): number {   // 获取当前时间
        return +new Date()
    }
    public getFedParams(options: Record<string, any>): FED_PARAMS {
        const params: any = {};
        for(let i in keys) {
            const key = keys[i];
            params[key] = '';
            try {
                if (options[key] !== undefined) {
                    params[key] = options[key]
                } else if (this.defaultSetting[key] !== undefined) {
                    params[key] = this.defaultSetting[key]
                } else {
                    params[key] = (<any>this)['get_' + key]();
                }
            } catch (e) {
                params[key] = '';
            }
            
        }
        let kvs = [];
        if (params.event_paramters instanceof Array) {
            kvs = params.event_paramters
        } else {
            for(let i in params.event_paramters){
                kvs.push({
                    name: i,
                    value: params.event_paramters[i]
                })
            }
        }
        params.event_paramters = JSON.stringify(kvs);
        params.event_elements = JSON.stringify(params.event_elements);

        console.log('params', params)
        return params;
    }
    public async fed(obj: EVENT_PARAMS): Promise<any> { // 前端喂点
        const result = this.defaultSettingCheck();
        const eventParamsResult = this.eventParamsCheck(obj);
        obj.event_time = this.get_event_time();
        this.storageList.push(obj)
        if (result && eventParamsResult) {
            this.storageList.map(async(storage) => {
                return this.doFed(this.getFedParams(storage))
            });
            //return OmegaLogger.prototype.fed.call(this, obj);
            this.storageList = []
        }
        if (!result) {
            this.storageList.push(obj);
            this.storageList.length > 100 && console.warn(`当下埋点异常，参数校验不通过，已累计异常埋点${this.storageList.length}条`);
        }
    }
    // 是否开启定位
    public setPosition(flag:boolean){
        this.isPosition=flag;
    }
    private showPosition (position: any) {
        var lat = position.coords.latitude; //纬度
        var lon = position.coords.longitude; //经度
        this.lat = lat;
        this.lon = lon;
        console.info('纬度:'+lat+',经度:'+lon);
    }
    
}
export default BuriedPoint;