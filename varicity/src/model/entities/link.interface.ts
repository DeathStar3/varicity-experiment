import {Building} from "./building.interface";

export interface Link {
    target: Building;
    source: Building;
    type: string;
}