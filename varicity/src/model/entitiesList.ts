import { District } from './entities/district.interface';
import { Building } from './entities/building.interface';
import {Link} from "./entities/link.interface";
import { VPVariantsImplem } from './entitiesImplems/vpVariantsImplem.model';

export class EntitiesList {

    // TODO: change implem to only have ONE root district

    buildings: Building[] = [];
    districts: District[] = []; // [com] => [polytech, utils] => **[unice]**
    links: Link[] = [];
    compositionLinks: Link[] = [];

    constructor() {}

    addDistrict(district: District) {
        this.districts.push(district);
    }

    public getBuildingFromName(name: string) : Building {
        for (let i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].name === name) {
                return this.buildings[i];
            }
        }
        for (let i = 0; i < this.districts.length; i++) {
            const res = this.districts[i].getBuildingFromName(name);
            if (res !== undefined) {
                return res;
            }
        }
        return undefined;
    }
}