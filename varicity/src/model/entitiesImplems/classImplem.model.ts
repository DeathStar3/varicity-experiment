import { Building } from "../entities/building.interface";

export class ClassImplem extends Building {

    heightName: string = "height";
    widthName: string = "width"

    constructor(name: string, height: number, width: number, types: string[], fullName: string, level: number) {
        super();
        this.name = name;
        this.height = height;
        this.width = width;
        this.types = types;
        this.fullName = fullName;
        this.compLevel = level;
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
            + ", "+this.heightName+": "
            + this.height
            + ", "+this.widthName+": "
            + this.width
            + "\ntypes: "
            + this.types
            + "}";
    }
}