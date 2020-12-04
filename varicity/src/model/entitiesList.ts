import { District } from './entities/district.interface';
import { Building } from './entities/building.interface';
import {Link} from "./entities/link.interface";
import { VPVariantsImplem } from './entitiesImplems/vpVariantsImplem.model';

export class EntitiesList {

    // TODO: change implem to only have ONE root district

    buildings: Building[] = [];
    district: District; // [com] => [polytech, utils] => **[unice]**
    links: Link[] = [];
    compositionLinks: Link[] = [];

    constructor() {}

    public getBuildingFromName(name: string) : Building {
        for (let i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].fullName === name) {
                return this.buildings[i];
            }
        }
        const res = this.district.getBuildingFromName(name);
        if (res !== undefined) {
            return res;
        }
        return undefined;
    }

    public filterCompLevel(level: number) : EntitiesList {
        let result = new EntitiesList();
        return result;
    }
}