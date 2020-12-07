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
describe('parsing without filtering by composition level', function() {
  it('parse', function() {
    let entities = new VPVariantsStrategy().parse('test3ForVPParser');
    let dis = entities.district.districts
    let numberOfDistricts = countDistricts(dis);
    let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
    expect(numberOfBuiildings).equal(4);
    expect(numberOfDistricts).equal(2);
  }); 
});

describe('parsing with filtering by composition level', function() {
  it('parse', function() {
    let entities = new VPVariantsStrategy().parse('test3ForVPParser');
    let ent = entities.filterCompLevel(1);
    let dis = ent.district.districts
    let numberOfDistricts = countDistricts(dis);
    let numberOfBuiildings = countBuilding(dis) + countDistricts(dis)
    expect(numberOfBuiildings).equal(4);
    expect(numberOfDistricts).equal(2);
  }); 
});