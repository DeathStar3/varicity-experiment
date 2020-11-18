import {Link} from "../entities/link.interface";
import {ClassImplem} from "./classImplem.model";

export class InheritanceImplem implements Link {
    public source: ClassImplem;
    public target: ClassImplem;
    public type: string;

    constructor(source: ClassImplem, target: ClassImplem, type: string) {
        this.source = source;
        this.target = target;
        this.type = type;
    }
}