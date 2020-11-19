export interface Building {
    width: number;
    height: number;
    types: string[];

    name: string;
    fullName: string;

    toString() : string;
    getHeight() : number;
    getWidth() : number;
}