import {expect} from 'chai';

import { VPVariantsStrategy } from "../src/controller/parser/strategies/vp_variants.strategy";

describe('parsing without links', function() {
  it('parse', function() {
    let entities = new VPVariantsStrategy().parse('test1WithoutLinks');
    let districts = entities.districts[0].districts[0].districts
    let numberOfDistricts = districts.length;
    expect(numberOfDistricts).equal(0);
    let numberOfBuiildings = 0;
    districts.forEach(d => {
      numberOfBuiildings += d.buildings.length
    })
    expect(numberOfBuiildings).equal(5);
  }); 
});