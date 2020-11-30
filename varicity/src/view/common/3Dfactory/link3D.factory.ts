import { Scene } from '@babylonjs/core';
import { Building3D } from '../3Delements/building3D';
import { Link3DImplem } from '../3Delements/link3DImplem';
import { UndergroundRoad3DImplem } from '../3Delements/undergroundRoad3DImplem';
import { Link3D } from './../3Dinterfaces/link3D.interface';

export class Link3DFactory {
    public static createLink(src: Building3D, dest: Building3D, type: string, scene: Scene): Link3D {
        switch(type) {
            case 'DUPLICATES':
            // case 'DUPLICATES': return new UndergroundRoad3DImplem(src, dest, type, scene);
            case 'INSTANTIATE':
            case 'EXTENDS':
            case 'IMPLEMENTS': return new Link3DImplem(src, dest, type, scene);
            default: throw new Error("Tasukete kudasai goshujin franshoah sama");
        }
    }
}