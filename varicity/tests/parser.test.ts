import {expect} from 'chai';

import { ClassesPackagesStrategy } from "../src/controller/parser/strategies/classes_packages.strategy";

describe('parsing without links', function() {
  it('parse', function() {
    let entities = new ClassesPackagesStrategy().parse('test1WithoutLinks');
    let districts = entities.district.districts[0].districts[0].districts
    let numberOfDistricts = districts.length;
    expect(numberOfDistricts).equal(2);
    let numberOfBuildings = 0;
    districts.forEach(d => {
      numberOfBuildings += d.buildings.length
    })
    expect(numberOfBuildings).equal(5);
  }); 
});

describe('parsing links', function() {
  it('parse', function() {
    let entities = new ClassesPackagesStrategy().parse('test2WithLinks');
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(2);
  }); 
});