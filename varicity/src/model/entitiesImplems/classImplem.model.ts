import { Building } from "../entities/building.interface";

export class ClassImplem implements Building {
    name: string;
    width: number;
    height: number;

    constructor(name: string, methodNumber: number, attributeNumber: number) {
        this.name = name;
        this.height = methodNumber
        this.width = attributeNumber;
    }
}