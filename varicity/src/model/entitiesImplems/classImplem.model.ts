import { Building } from "../entities/building.interface";

export class ClassImplem implements Building {
    width: number;
    height: number;
    name: string;

    constructor(name: string, methodNumber: number, attributeNumber: number) {
        this.name = name;
    }
}