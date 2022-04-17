export declare enum ENUM_EVENT_TRIGGER_MODE {
    /**
     *  一般落地页、详情页的打开方式
     */
    open = "open",
    /**
     *  大部分超链接点击、按钮等触发方式
     */
    click = "click",
    /**
     *  一般为懒加载页面在屏幕滑动时触发，上下左右滑动均可
     */
    slide = "slide",
    /**
     *  回调接口触发
     */
    callback = "callback",
    /**
     *  打开弹窗
     */
    dialog = "dialog",
    /**
     *  服务端接口返回
     */
    server = "server",
    /**
     *  视频播放
     */
    play = "play",
    /**
     * 前往某处
     * @description 前往某处
     */
    jump = "jump"
}
