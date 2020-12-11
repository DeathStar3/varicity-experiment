import {expect} from 'chai';

import { District } from '../src/model/entities/district.interface';
import { ConfigLoader } from '../src/controller/parser/configLoader';
import { FilesLoader } from '../src/controller/parser/filesLoader';
import { VPVariantsStrategy } from "../src/controller/parser/strategies/vp_variants.strategy";

function countBuilding(districts: District[]) : number{
  let sum = 0;
  districts.forEach(d => {
    sum += d.buildings.length;
    sum += countBuilding(d.districts)
  })
   return sum;
}

function countDistricts(districts: District[]) : number{
  let sum = 0;
  districts.forEach(d => {
    sum += 1;
    sum += countDistricts(d.districts)
  })
   return sum;
}

describe('cross check', function() {
    it('cross check cross_check_1', function() {
        let entities = new VPVariantsStrategy().parse(FilesLoader.loadDataFile('cross_check_1'), ConfigLoader.loadDataFile("config"));
        let ent = entities.filterCompLevel(1);
        let dis = ent.district.districts
        let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
        expect(numberOfBuiildings).equal(22);
    });
})
