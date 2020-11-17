import {NodeType} from "./nodeType";

export class NodeElement {
    name: string;
    type: NodeType;
    nbAttributes: number;
    nbFunctions: number;

    constructor(name: string) {
        this.name = name;
    }
}