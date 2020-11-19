import { Building } from "../entities/building.interface";

export class ClassImplem implements Building {
    width: number = 0.5;
    height: number = 0.5;
    types: string[] = [];
    name: string;
    fullName: string;

    constructor(name: string, methodNumber: number, attributeNumber: number, types: string[], fullName: string) {
        this.name = name;
        this.height += methodNumber * 0.5;
        this.width += attributeNumber * 0.5;
        this.types = types;
        this.fullName = fullName;
    }
}