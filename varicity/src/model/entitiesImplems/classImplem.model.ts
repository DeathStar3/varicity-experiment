import { Vector3 } from "@babylonjs/core";
import { Building } from "../entities/building.interface";

export class ClassImplem implements Building {
    width: number = 0.5;
    height: number = 0.5;
    name: string;
    
    center: Vector3;
    bot: Vector3;
    top: Vector3;

    constructor(name: string, methodNumber: number, attributeNumber: number) {
        this.name = name;
        this.height += methodNumber * 0.5;
        this.width += attributeNumber * 0.5;
    }

    locate(center: Vector3, bot: Vector3, top: Vector3) {
        this.center = center;
        this.bot = bot;
        this.top = top;
    }
}