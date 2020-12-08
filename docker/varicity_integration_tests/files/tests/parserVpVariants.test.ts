import {expect} from 'chai';

import { VPVariantsStrategy } from "../src/controller/parser/strategies/vp_variants.strategy";
import { District } from '../src/model/entities/district.interface';

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

/**
 * abstract decorator
 */
describe('parsing with filtering by composition level', function() {
  it('parse', function() {
    let entities = new VPVariantsStrategy().parse('abstract_decorator');
    let ent = entities.filterCompLevel(1);
    let dis = ent.district.districts
    let numberOfDistricts = countDistricts(dis);
    let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
    expect(numberOfBuiildings).equal(4);
    expect(numberOfDistricts).equal(2);
  }); 
});