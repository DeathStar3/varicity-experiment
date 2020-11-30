import { Building3D } from '../../view/common/3Delements/building3D';
import { Building } from './building.interface';

export interface Color {
    name: string;
    color: string; // HEX COLOR string
}

export interface ConfigColor {
    colors: {
        outline: string, // HEX color string
        edges: string, // HEX color string
        faces: [Color],
    }
}

export interface ConfigClones {
    objects: Building[],
    map: Map<Building, {
        original: Building3D,
        clones: Building3D[]
    }>
}

export interface ConfigInterface {
    building: ConfigColor;
    district: ConfigColor;
    link: {
        colors: [Color]
    };

    vp_building: {
        color: string; // HEX color string
    }

    blacklist: string[]; //all classes that must not appear

    clones: ConfigClones;

    force_color: string; // HEX color string
}