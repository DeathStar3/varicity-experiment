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
    sum += countBuilding(d.districts)
  })
   return sum;
}
describe('parsing without links', function() {
  it('parse', function() {
    let entities = new VPVariantsStrategy().parse('test3ForVPParser');
    // console.log(entities.districts);
    // console.log(entities.districts[0].districts[0].districts);
    let dis = entities.districts[0].districts
    let numberOfDistricts = countDistricts(entities.districts[0].districts);
    let numberOfBuiildings = countBuilding(entities.districts[0].districts) + countDistricts(entities.districts[0].districts)
    expect(numberOfBuiildings).equal(4);
    expect(numberOfDistricts).equal(2);
  }); 
});