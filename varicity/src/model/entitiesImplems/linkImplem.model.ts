import {Link} from "../entities/link.interface";
import {ClassImplem} from "./classImplem.model";

export class LinkImplem extends Link {
    constructor(source: ClassImplem, target: ClassImplem, type: string) {
        super();
        this.source = source;
        this.target = target;
        this.type = type;
    }
}