import {expect} from 'chai';

import { VPVariantsStrategy } from "../src/controller/parser/strategies/vp_variants.strategy";

describe('parsing without links', function() {
  it('parse', function() {
    let entities = new VPVariantsStrategy().parse('test3ForVPParser');
    // console.log(entities.districts[0]);
    let dis = entities.districts[0].districts
    let numberOfBuiildings = 0;
    let numberOfDistricts = 0;
    // console.log(dis[0].vp);
    dis.forEach(d => {
      // console.log(d);
      // console.log(d.vp)
      numberOfBuiildings += d.buildings.length;
      // if(d.vp !== undefined){
      //   numberOfBuiildings += 1;
      // }
      numberOfDistricts += d.districts.length;
      numberOfBuiildings += numberOfDistricts;
    })
    console.log(numberOfBuiildings);
    console.log(numberOfDistricts);
    // expect(numberOfBuiildings).equal(5);
  }); 
});