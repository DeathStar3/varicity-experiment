export abstract class Building {
    width: number;
    height: number;
    types: string[];

    name: string;
    fullName: string;

    constructor() {
        this.types = [];
    }i

    abstract toString() : string;
    abstract getHeight() : number;
    abstract getWidth() : number;
}