import { Vector3 } from "@babylonjs/core";
import { Building } from "../entities/building.interface";

export class ClassImplem implements Building {
    width: number = 0.5;
    height: number = 0.5;
    types: string[] = [];
    name: string;
    fullName: string;
    
    center: Vector3;
    bot: Vector3;
    top: Vector3;

    constructor(name: string, methodNumber: number, attributeNumber: number, types: string[], fullName: string) {
        this.name = name;
        this.height += methodNumber * 0.5;
        this.width += attributeNumber * 0.5;
        this.types = types;
        this.fullName = fullName;
    }

    locate(center: Vector3, bot: Vector3, top: Vector3) {
        this.center = center;
        this.bot = bot;
        this.top = top;
    }
}