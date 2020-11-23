
export class NodeElement {
    name: string;
    types: string[];
    nbAttributes: number;
    nbFunctions: number;
    nbVariants: number;

    constructor(name: string) {
        this.name = name;
    }
}