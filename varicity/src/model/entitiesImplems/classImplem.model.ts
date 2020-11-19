import { Building } from "../entities/building.interface";

export class ClassImplem implements Building {
    width: number;
    height: number;
    types: string[];
    name: string;
    fullName: string;

    constructor(name: string, methodNumber: number, attributeNumber: number, types: string[], fullName: string) {
        this.name = name;
        this.height = methodNumber;
        this.width = attributeNumber;
        this.types = types;
        this.fullName = fullName;
    }

    public getHeight() : number {
        return 0.5 + this.height*0.5;
    }

    public getWidth() : number {
        return 0.5 + this.width*0.5;
    }

    public toString() : string {
        return "{fullName: "
            + this.fullName
            + ", methodVariants: "
            + this.height
            + ", attributes: "
            + this.width
            + "\ntypes: "
            + this.types
            + "}";
    }
}