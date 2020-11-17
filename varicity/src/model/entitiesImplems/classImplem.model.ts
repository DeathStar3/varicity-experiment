import { Building } from "../entities/building.interface";

export class ClassImplem implements Building {
    width: number = 5;
    height: number = 5;
    name: string;

    constructor(name: string, methodNumber: number, attributeNumber: number) {
        this.name = name;
        this.height += methodNumber * 5;
        this.width += attributeNumber * 5;
    }
}