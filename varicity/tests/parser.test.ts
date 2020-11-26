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
    console.log(entities);
    expect(7).equal(7);
  }); 
});