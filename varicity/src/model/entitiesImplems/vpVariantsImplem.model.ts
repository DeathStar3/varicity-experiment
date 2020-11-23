import {District} from "../entities/district.interface";
import {ClassImplem} from "./classImplem.model";

export class VPVariantsImplem extends District {

    addBuilding(building: ClassImplem) {
        return this.buildings.push(building);
    }

    addDistrict(district: VPVariantsImplem) {
        return this.districts.push(district);
    }

    getTotalWidth(): number {
        return 0;
    }

    hasChild(obj: ClassImplem | VPVariantsImplem): boolean {
        let result = false;
        for (let i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].name === obj.name) {
                return true;
            }
        }

        for (let i = 0; i < this.districts.length; i++) {
            if (this.buildings[i].name === obj.name) {
                return true;
            } else if (this.districts[i].hasChild(obj)) {
                return true;
            }
        }

        return false;
    }

}