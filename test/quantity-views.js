const should = require('chai').should();
const expect = require('chai').expect;
const parseNumber = require('../lib/util').parseNumber;
const capitalize = require('../lib/util').capitalize;
const Unit = require('../lib/core').Unit;
const Quantity = require('../lib/core').Quantity;
const lengthDef = require('../lib/defs').defaultQuantities.length;

describe('#parseNumber', () => {
    it('Parse a number as itself', () => {
        parseNumber(1.3).should.equal(1.3);
        parseNumber(0).should.equal(0);
    });
    it('NaN is not a number', () => {
        parseNumber(NaN).toString().should.equal('NaN');
    });
    it('Infinity and -Infinity are not numbers', () => {
        parseNumber(Infinity).toString().should.equal('NaN');
        parseNumber(-Infinity).toString().should.equal('NaN');
    });
    it('null is not a number', () => {
        parseNumber(null).toString().should.equal('NaN');
    });
    it('A string of a number is a number', () => { 
        parseNumber('1').should.equal(1);
        parseNumber('1.2').should.equal(1.2);
        parseNumber('-4.7').should.equal(-4.7);
        parseNumber('-4.7').should.equal(-4.7);
        parseNumber('1e-5').should.equal(0.00001);
    });
    it('Rest of strings are not numbers', () => {
        parseNumber('a').toString().should.equal('NaN');
        parseNumber('a1235').toString().should.equal('NaN');
        parseNumber('hello').toString().should.equal('NaN');
    });
    it('Even strings starting by numbers are not numbers', () => {
        parseNumber('1a').should.be.NaN;
        parseNumber('1e').should.be.NaN;
        parseNumber('-1e').should.be.NaN;
        parseNumber('1e1a').should.be.NaN;
        parseNumber('1e1e').should.be.NaN;
    });
});

describe('#capitalize', () => {
    it('Normal use', () => {
        capitalize('hello').should.equal('Hello');
        capitalize('Hello').should.equal('Hello');
        capitalize('HEllO').should.equal('HEllO');
    });
    it('String of length 1', () => {
        capitalize('a').should.equal('A');
        capitalize('A').should.equal('A');
    });
    it('Empty string', () => {
        capitalize('').should.equal('');
    });
    it('String starting by space', () => {
        capitalize(' hello').should.equal(' hello');
    });
    it('String starting by digit', () => {
        capitalize('1hello').should.equal('1hello');
    });
});

describe('#Unit properties and methods', () => {
    let u = new Unit({ });
    let props = ['name', 'multiplier', 'symbol'];
    let methods = ['fromValue', 'toValue'];
    it('Properties', () => {
        for (const prop of props) {
            u.should.has.property(prop);
        }
    });
    it('Methods', () => {
        for (const meth of methods) {
            u.should.respondTo(meth);
        }
    });
});


describe('#Unit creation', () => {
    it('Default constructor values', () => {
        let u = new Unit({ });
        u.should.has.property('name', '');
        u.should.has.property('multiplier', 1);
        u.should.has.property('symbol', '');
    });
    it('Only some values specified', () => {
        let u = new Unit({ multiplier: 7 });
        u.name.should.equal('');
        u.multiplier.should.equal(7);
        u.symbol.should.equal('');
    });
    it('Full unit specified', () => {
        let u = new Unit({ name: 'meter', multiplier: 2, symbol: 'm' });
        u.name.should.equal('meter');
        u.multiplier.should.equal(2);
        u.symbol.should.equal('m');
    });
});

describe('#Unit operation', () => {
    let u = new Unit({ multiplier: 1.2 });
    it('Unit.fromValue with null precision return numbers', () => {
        u.fromValue(2).should.be.a('number');
        u.fromValue(2, null).should.be.a('number');
        u.fromValue('a').should.be.NaN;
        u.fromValue('a', 2).should.equal('NaN');
    });
    it('Unit.fromValue with precision within 1,21 return strings', () => {
        u.fromValue(2, 5).should.be.a('string');
        u.fromValue('a', 5).should.be.a('string');
    });
    it('Unit.fromValue return correct values', () => {
        u.fromValue(2).should.equal(2.4);
        u.fromValue(3).should.equal(3 * u.multiplier);
        u.fromValue(3, 6).should.equal('3.60000');
    });
    it('Unit.fromValue accepts strings as input value', () => {
        u.fromValue('2').should.equal(2.4);
        u.fromValue('2a').should.be.NaN;
    });
    it('Unit.toValue allways return numbers', () => {
        u.toValue(2).should.be.a('number');
        u.toValue('a').should.be.NaN;
        u.toValue('8.76').should.be.a('number');
    });
    it('Unit.toValue return correct values', () => {
        u.toValue(1.2).should.equal(1);
        u.toValue(3).should.equal(3 / u.multiplier);
    });
    it('Unit.toValue accept strings as input value', () => {
        u.toValue('2').should.equal(2 / u.multiplier);
        u.toValue('2a').should.be.NaN;
    });
});

describe('#Quantity methods and properties', () => {
    let Q = Quantity;
    let q = new Quantity();
    let props = ['_value', 'name', 'precision'];
    let smethods = ['_addUnit', 'create'];
    let methods = [];
    it('Quantity class respond to static methods', () => {
        for (const meth of smethods) {
            Q.should.itself.respondTo(meth);
        }
    });
    it('Quantity class do not respond to non static methods', () => {
        for (const meth of methods) {
            Q.should.itself.not.respondTo(meth);
        }
    });
    it('Quantity instance properties', () => {
        for (const prop of props) {
            q.should.has.property(prop);
        }
    });
    it('Quantity instances do not respond to static methods', () => {
        for (const meth of smethods) {
            q.should.not.respondTo(meth);
        }
    });
    it('Quantity instances respond to non static methods', () => {
        for (const meth of methods) {
            q.should.respondTo(meth);
        }
    });
});

describe('#Quantity creation', () => {
    let name = 'Length';
    let L = Quantity.create(lengthDef, name);
    let l = new L(2);
    let l1 = new L(1, 'distance', null);
    it('Constructor name is correct', () => {
        L.name.should.equal(name);
    });
    it('.units are correct', () => {
        l.units.should.eql(Array.from(lengthDef, v => v.name));
    });
    it('multipliers are correct', () => {
        (Array.from(l1.units, v => l1[v])).should.eql(
            Array.from(lengthDef, v => v.multiplier));
    });
    it('symbols are correct', () => {
        (Array.from(l.units, v => l.getSymbol(v))).should.eql(
            Array.from(lengthDef, v => v.symbol));
    });
    it('_value is correct', () => {
        l._value.should.equal(2);
    });
    it('conversion', () => {
        l1.centimetre = 1;
        l1.metre.should.equal(0.01);
    });
});
