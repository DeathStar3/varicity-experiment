import { District } from './entities/district.interface';
import { Building } from './entities/building.interface';

export class EntitiesList {

    buildings: Building[];
    districts: District[]; // [com] => [polytech, utils] => **[unice]**

    constructor() {}

    addDistrict(district: District) {
    }

    addBuilding(building: Building) {
    }
}