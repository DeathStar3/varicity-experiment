export abstract class Building {
    width: number;
    height: number;
    types: string[];

    // TODO: remove fullName to keep only building name
    name: string;
    fullName: string;

    constructor() {
        this.types = [];
    }i

    abstract toString() : string;
    abstract getHeight() : number;
    abstract getWidth() : number;
}