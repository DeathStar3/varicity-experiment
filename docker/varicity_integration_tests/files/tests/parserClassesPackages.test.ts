import {expect} from 'chai';

import { ClassesPackagesStrategy } from "../src/controller/parser/strategies/classes_packages.strategy";

describe('parsing all tests projects with classe packages strategy', function() {
  it('parse abactract decorator', function() {
    let entities = new ClassesPackagesStrategy().parse('abstract_decorator');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(4);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(3);
  }); 

  it('parse abactract decorator', function() {
    let entities = new ClassesPackagesStrategy().parse('composition_levels_inheritance');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(1);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  }); 

  it('parse composition_levels_mixed', function() {
    let entities = new ClassesPackagesStrategy().parse('composition_levels_mixed');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(1);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  }); 

  it('parse decorator', function() {
    let entities = new ClassesPackagesStrategy().parse('decorator');
    let districts = entities.districts[0].districts[0].districts
    let numberOfDistricts = districts.length;
    expect(numberOfDistricts).equal(1);
    let numberOfBuiildings = 0;
    districts.forEach(d => {
      numberOfBuiildings += d.buildings.length
    })
    expect(numberOfBuiildings).equal(4);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(3);
  }); 

  it('parse density', function() {
    let entities = new ClassesPackagesStrategy().parse('density');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(6);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(4);
  });

  it('parse factory', function() {
    let entities = new ClassesPackagesStrategy().parse('factory');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(4);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(2);
  });

  it('parse generic_decorator', function() {
    let entities = new ClassesPackagesStrategy().parse('generic_decorator');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(4);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(3);
  });

  it('parse attribute_composition', function() {
    let entities = new ClassesPackagesStrategy().parse('attribute_composition');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(1);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(0);
  });

  it('parse attribute_composition_factory', function() {
    let entities = new ClassesPackagesStrategy().parse('attribute_composition_factory');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(10);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(9);
  });

  it('parse generics', function() {
    let entities = new ClassesPackagesStrategy().parse('generics');
    let buildings = entities.buildings
    let numberOfBuiildings = buildings.length;
    expect(numberOfBuiildings).equal(3);
    let numberOfLinks = entities.links.length;
    expect(numberOfLinks).equal(2);
  });
});