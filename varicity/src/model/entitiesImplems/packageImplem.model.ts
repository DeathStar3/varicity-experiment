import { District } from '../entities/district.interface';
import { ClassImplem } from './classImplem.model';

export class PackageImplem implements District {
    buildings: ClassImplem[];
    districts: PackageImplem[];
    name: string;
    startX: number;
    startY: number;

    constructor() {
        
    }

    addDistrict(district: PackageImplem) {
        // depending on district.name => com.polytech.unice
        // find the corresponding district com.polytech
        // add district unice to the corresponding district com.polytech
        throw new Error('Method not implemented.');
    }

    addBuilding(building: ClassImplem) {
        // depending on building.name => com.polytech.unice.object.java
        // find the corresponding district com.polytech.unice
        // add building object.java to the corresponding district com.polytech.unice
        throw new Error('Method not implemented.');
    }

    belongsTo(district: PackageImplem): boolean {

        let districtNameSplitted = district.name.split('.');
        let thisNameSplitted = this.name.split('.');

        // Possible to optimize ?
        // districtNameSplitted should always be > thisNameSplitted, since it will be recursive
        // therefore, it should be possible to only compare thisNameSplitted[thisNameSplitted.length] with districtNameSplitted[thisNameSplitted.length]
        // since previous districts should have compared the others before
        for(let i = 0; i < thisNameSplitted.length; i++) {
            if(thisNameSplitted[i] != districtNameSplitted[i]) {
                return false;
            }
        }
        return true;
    }

    getTotalWidth(): number {
        throw new Error('Method not implemented.');
    }
}