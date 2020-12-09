import { Color, ConfigClones, ConfigColor, ConfigInterface } from "../entities/config.interface";

export enum CriticalLevel {
    LOW_IMPACT = 0,
    MEDIUM_IMPACT = 1,
    HIGH_IMPACT = 2
}

export class Config implements ConfigInterface {
    building: ConfigColor;
    district: ConfigColor;
    link: {
        colors: [Color]
    };
    vp_building: {
        color: string; // HEX color string
    };
    blacklist: string[];
    clones: ConfigClones;
    force_color: string; // HEX color string
    api_classes: string[];
    parsing_mode: string;

    constructor() { }

    public static instanceOfColor(object: any): object is Color {
        return object &&
            object.name && typeof (object.name) == "string" &&
            object.color && typeof (object.color) == "string";
    }

    public static instanceOfConfigColor(object: any): object is ConfigColor {
        return object &&
            object.outline && typeof (object.outline) == "string" &&
            object.edges && typeof (object.edges) == "string" &&
            object.faces && Array.isArray(object.faces) && object.faces.every((v: any) => this.instanceOfColor(v)) &&
            object.outlines && Array.isArray(object.outlines) && object.outlines.every((v: any) => this.instanceOfColor(v));
    }

    public static alterField(config: Config, fields: string[], value: [string, string] | Color): CriticalLevel { // for the tuple : [prev value, cur value]
        let cur = config;
        if (fields.includes("vp_building")) {
            if (Array.isArray(value)) {
                config.vp_building.color = value[1];
                return CriticalLevel.MEDIUM_IMPACT;
            }
            else {
                if(this.instanceOfColor(value)) {
                    throw new Error('Tried to assign Color ' + value + ' object to string in field vp_building.color.');
                }
            }
        }
        if (fields.includes("parsing_mode")) {
            if (Array.isArray(value)) {
                config.parsing_mode = value[1];
                return;
            }
        }
        for (let key of fields) {
            cur = cur[key]; // we go deeper
        }
        if (Array.isArray(cur)) {
            if (cur.every(v => Config.instanceOfColor(v)) && Config.instanceOfColor(value)) {
                let obj = cur.find(v => v.name == value.name);
                obj.color = value.color;
                return CriticalLevel.LOW_IMPACT;
            } else { // value is prob a string
                if (cur.some(v => v == value[0])) { // already exists
                    let index = cur.findIndex(v => v == value[0])
                    if (value[1] == "") { // prev value was defined, current wasn't, therefore we delete entry
                        cur.splice(index, 1);
                    }
                    else { // prev and current are defined, therefore we change value
                        cur[index] = value[1];
                    }
                } else { // doesn't exist, so we push the new value
                    cur.push(value[1]);
                }
                if(fields.includes("api_classes")) return CriticalLevel.HIGH_IMPACT;
            }
            return CriticalLevel.MEDIUM_IMPACT;
        }
    }
}