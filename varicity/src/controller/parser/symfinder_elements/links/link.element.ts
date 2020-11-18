import {LinkType} from "./linkType";

export class LinkElement {
    public source: string;
    public target: string;
    public type: LinkType;

    constructor(source: string, target: string, type: LinkType) {
        this.source = source;
        this.target = target;
        this.type = type;
    }
}