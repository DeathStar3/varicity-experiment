import { Building } from "../entities/building.interface";

export class ClassImplem implements Building {
    width: number = 0.5;
    height: number = 0.5;
    name: string;

    constructor(name: string, methodNumber: number, attributeNumber: number) {
        this.name = name;
        this.height += methodNumber * 0.5;
        this.width += attributeNumber * 0.5;
    }
}