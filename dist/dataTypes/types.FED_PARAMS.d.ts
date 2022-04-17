import { ENUM_APPLICATION_DEP_PLATFORM } from "./types.ENUM_APPLICATION_DEP_PLATFORM";
import { ENUM_EVENT_TRIGGER_MODE } from "./types.ENUM_EVENT_TRIGGER_MODE";
import { ENUM_PLATFORM_BUSINESS } from "./types.ENUM_PLATFORM_BUSINESS";
export declare type FED_PARAMS = {
    nick: string;
    mix_nick: string;
    open_id: string;
    phone: string;
    ouid: string;
    provider: string;
    open_type: number;
    act_name: string;
    /**
     * 事件UUID
     * @description 主要用于校验数据重复，有收集服务打入，如影响性能可不用
     */
    is_prod?: boolean;
    runtime_env: string;
    /**
     * 事件时间戳
     * @description 客户端事件发生的时间戳（毫秒）
     */
    event_time: number;
    /**
     * 事件名
     * @description 参考：http://fed-jifenn.oss-cn-shenzhen.aliyuncs.com/buried-docs/event/
     */
    event_name: string;
    /**
     * 事件code
     * @description 参考：http://fed-jifenn.oss-cn-shenzhen.aliyuncs.com/buried-docs/event/
     */
    event_code: string;
    /**
     * 触发方式
     * @description 触发方式，点击、触摸、滑动，参照《埋点事件触发模式》
     */
    event_trigger_mode: ENUM_EVENT_TRIGGER_MODE;
    /**
     * 触发元素
     * @description 事件触发元素，app页面或HTML中定义的元素, BUTTON
     */
    event_elements?: Array<string>;
    /**
     * 事件参数
     * @description K/V格式存储，参数队列
     */
    event_paramters: Array<object>;
    /**
     * 事件标签
     */
    event_label: number | string;
    /**
     * 到达服务器时间戳
     * @description 前端不传，由收集服务打入
     */
    /**
     * 会话ID
     * @description 标识客户端的一次会话，会话结束后切换，具体需要参考google会话切分原则
     */
    session_id?: string;
    /**
     * 平台APP
     * @description 对应的APP名称，如导购、环游、会员中心
     */
    platform_app: string;
    /**
     * 平台APP的唯一code
     * @description 必须为唯一值，代表的某个仓库的唯一定义。是一个平台生成的唯一字符串。
     */
    platform_app_code: string;
    /**
     * 平台APP版本
     * @description 对应的APP版本，如导购1.0.1
     */
    platform_app_version: string;
    /**
     * 业务平台
     * @description 访问的业务平台：淘宝、天猫、京东、微信、其他
     */
    platform_business: ENUM_PLATFORM_BUSINESS;
    /**
     * 系统平台
     * @description 访问平台：IOS、Android、PC、H5、小程序（可分为微信小程序，钉钉小程序、支付宝小程序）
     */
    platform_system: string;
    /**
     * 应用部署平台
     */
    application_dep_platform: ENUM_APPLICATION_DEP_PLATFORM;
    /**
     * 应用标签
     */
    application_label: string | number;
    /**
     * 大平台用户ID
     * @description 用户登陆的ID，如果未登录，则为匿名分配，大平台（淘宝、京东）侧用户ID
     */
    distinct_id: string | number;
    /**
     * 店铺会员ID
     * @description 会员ID
     */
    member_id: string | number;
    /**
     * 店铺ID
     * @description
     */
    merchant_id: string | number;
    /**
     * 活动ID
     * @description 一个互动有多个活动的情况下需要埋改点位
     */
    act_id: string | number;
    /**
     * 是否互动
     */
    is_interactive: number;
    /**
     * 小程序应用名称
     * @description 是应用名称，不是互动
     */
    app?: string;
    /**
     * 操作系统
     * @description 客户端终端操作系统系统	iOS、Liunx、Android、Windows
     */
    os?: string;
    /**
     * 操作系统版本
     * @description 操作系统版本	Windows 10 Home
     */
    os_version?: string;
    /**
     * 访问载体
     * @description 访问载体,对于Web,填入浏览器，对于APP，填入Android或IOS的App	WEB：Mozilla。Android：MIUI iPhone：iOS，对应$browser
     */
    vis_carrier?: string;
    /**
     * 访问载体版本
     * @description 访问载体版本，对于Web，填入浏览器版本，对于APP，填入APP版本	WEB：77.0.3865.120 Android：10.2 iPhone：10.13.4
     */
    vis_version?: string;
    /**
     * 访客ID
     * @description 客户端设备唯一标识，PC端填入浏览器fingerprint，手机端可填Android:IMEI/Iphone:udid	fingerprin通过JS可以获取
     */
    visitor_id?: string;
    /**
     * 终端设备
     * @description 设备（Iphone 11、PC、Huawei Mete30）	Iphone、PC、Huawei Mete30
     */
    device_model?: string;
    /**
     * referrer
     * @description 访问的上一个指向，Web端（PC、H5）为URL地址、APP端为Pagename	https://baidu.com
     */
    referrer: string;
    /**
     * 访问页面
     * @description 当前请求的地址Web端（PC、H5）为URL地址、APP端为Pagename	Home_Page
     */
    url: string;
    /**
     * screen_height
     * @description 客户端屏幕尺寸-高度	APP端填入，WEB端可不填
     */
    screen_height?: number;
    /**
     * screen_width
     * @description 客户端屏幕尺寸-宽度	APP端填入，WEB端可不填
     */
    screen_width?: number;
    /**
     * userAgent
     * @description http header 中的user_agent	一般用于排错
     */
    user_agent?: string;
    /**
     * 客户端IP地址
     * @description 客户端设备IP地址
     */
    ip?: string;
    /**
     * 客户端经度
     * @description 经度，客户端访问时的地理位置
     */
    lon?: number | string;
    /**
     * 客户端纬度
     * @defaultde 纬度，客户端访问时的地理位置
     */
    lat?: number | string;
    /**
     * 客户端省份
     * @description 由客户端所在位置提供省份信息 陕西
     */
    province?: string;
    /**
     * 客户端市
     * @description 由客户端所在位置提供市信息	西安
     */
    city?: string;
    /**
     * 客户端区县
     * @description 由客户端所在位置提供区县信息 雁塔
     */
    district?: string;
};
