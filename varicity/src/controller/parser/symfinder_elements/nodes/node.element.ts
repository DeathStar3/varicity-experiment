
export class NodeElement {
    name: string;
    types: string[];
    nbAttributes: number;
    nbFunctions: number;
    nbVariants: number;
    nbConstructorVariants: number;
    nbMethodVariants: number;

    analyzed: boolean;
    root: boolean;

    constructor(name: string) {
        this.name = name;
        this.analyzed = false;
        this.root = true;
    }
}