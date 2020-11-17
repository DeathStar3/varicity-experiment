import { Building } from "../entities/building.interface";

export class ClassImplem implements Building {
    width: number = 10;
    height: number = 10;
    name: string;

    constructor(name: string, methodNumber: number, attributeNumber: number) {
        this.name = name;
        this.height += methodNumber * 10;
        this.width += attributeNumber * 10;
    }
}