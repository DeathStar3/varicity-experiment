import { Color, ConfigClones, ConfigColor, ConfigInterface } from "../entities/config.interface";


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

    public static alterField(config: Config, fields: string[], value: string | Color): void {
        let cur = config;
        if (fields.includes("force_color")) {
            if (typeof value === "string") {
                config.force_color = value;
                return;
            }
            else throw new Error('Tried to assign Color object to string in field force_color.');
        } else {
            if(fields.includes("vp_building")) {
                if (typeof value === "string") {
                    config.vp_building.color = value;
                    return;
                }
                else throw new Error('Tried to assign Color object to string in field vp_building.color.');
            }
        }
        for (let key of fields) {
            cur = cur[key]; // we go deeper
        }
        if (Array.isArray(cur)) {
            if (cur.every(v => Config.instanceOfColor(v)) && Config.instanceOfColor(value)) {
                let obj = cur.find(v => v.name == value.name);
                obj.color = value.color;
            } else { // value is prob a string
                cur.push(value);
            }
        }
    }
}