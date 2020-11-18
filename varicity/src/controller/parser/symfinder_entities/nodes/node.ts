import {NodeType} from "./nodeType";

export class NodeElement {
    name: string;
    types: NodeType[];
    nbAttributes: number;
    nbFunctions: number;

    constructor(name: string) {
        this.name = name;
    }
}