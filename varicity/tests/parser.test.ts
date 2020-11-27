import {expect} from 'chai';

import { ClassesPackagesStrategy } from "../src/controller/parser/strategies/classes_packages.strategy";

describe('calculate', function() {
    it('add', function() {
      let result = 5+ 2;
      expect(result).equal(7);
    }); 
  });

describe('parsing', function() {
  it('parse', function() {
    let entities = new ClassesPackagesStrategy().parse('test1WithoutLinks');
    let districts = entities.districts[0].districts[0].districts
    let numberOfDistricts = districts.length;
    expect(numberOfDistricts).equal(2);
    let numberOfBuiildings = 0;
    districts.forEach(d => {
      numberOfBuiildings += d.buildings.length
    })
    // console.log(districts);
    expect(numberOfBuiildings).equal(5);
  }); 
});