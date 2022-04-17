import { ENUM_EVENT_TRIGGER_MODE } from "./types.ENUM_EVENT_TRIGGER_MODE";
export type EVENT_PARAMS = {
    event_name: string,
    event_code: string,
    event_trigger_mode: ENUM_EVENT_TRIGGER_MODE,
    event_label: number | string
    url:string
} & Record<string, any>