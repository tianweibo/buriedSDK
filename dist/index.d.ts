 
import { FED_PARAMS } from "./dataTypes/types.FED_PARAMS";
import { EVENT_PARAMS } from "./dataTypes/types.EVENT_PARAMS";
declare class BuriedPoint {
    isProd: boolean;
    defaultSetting: Record<string, any>;
    isPosition: boolean;
    host: string;
    host_test: string;
    lat: FED_PARAMS["lat"];
    lon: FED_PARAMS["lon"];
    storageList: Array<EVENT_PARAMS>;
    setConfig(config: Record<string, any>, next?: () => void): void;
    setAsyncConfig(config: Record<string, any>, next?: () => void): void;
    private defaultSettingCheck;
    private eventParamsCheck;
    getData1(): void;
    doFed(config: FED_PARAMS): Promise<any>;
    get_event_time(): number;
    getFedParams(options: Record<string, any>): FED_PARAMS;
    fed(obj: EVENT_PARAMS): Promise<any>;
    setPosition(flag: boolean): void;
    private showPosition;
}
declare const buriedpointH5: BuriedPoint;
export default buriedpointH5;
