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

    constructor() { }

    api_classes: string[];
}