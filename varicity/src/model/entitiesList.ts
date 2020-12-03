import { District } from './entities/district.interface';
import { Building } from './entities/building.interface';
import {Link} from "./entities/link.interface";
import { VPVariantsImplem } from './entitiesImplems/vpVariantsImplem.model';

export class EntitiesList {

    // TODO: change implem to only have ONE root district

    buildings: Building[] = [];
    districts: District[] = []; // [com] => [polytech, utils] => **[unice]**
    links: Link[] = [];

    constructor() {}

    addDistrict(district: District) {
        this.districts.push(district);
    }

    addBuilding(building: Building) {
    }

    public getBuildingFromName(namesList: string[]) : Building {
        if (namesList.length <= 1) {
            for (let i = 0; i < this.buildings.length; i++) {
                if (this.buildings[i].name === namesList[0]) {
                    return this.buildings[i];
                }
            }
            return undefined;
        } else {
            for (let i = 0; i < this.districts.length; i++) {
                const d = this.districts[i];
                if (d.name.split('.').shift() === namesList[0]){
                    const res = d.getBuildingFromName(namesList.slice(1));
                    if (res !== undefined)
                        return res;
                }
            }
            return undefined;
        }
    }
}