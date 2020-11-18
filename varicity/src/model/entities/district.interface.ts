import { Building } from './building.interface';

export abstract class District {
    buildings: Building[];
    districts: District[];

    name: string;
    // width: number; // width will vary depending on number of districts and buildings, so maybe not declare it as attribute?

    startX: number;
    startY: number;

    abstract addDistrict(district: District);
    abstract addBuilding(building: Building);

    abstract getTotalWidth(): number;

    abstract hasChild(obj: District | Building): boolean;

    // Get a building from its full name
    // Parameter example ['org','jfree','chart','ClassName']
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
                const result = this.districts[i].getBuildingFromName(namesList.slice(1));
                if (result !== undefined) {
                    return result;
                }
            }
            return undefined;
        }
    }
}