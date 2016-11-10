const parseNumber = require('./util').parseNumber;
const capitalize = require('./util').capitalize;

class Unit {
    constructor({name='', multiplier=1, symbol=name, shift=0}) {
        this.name = name;
        this.multiplier = multiplier;
        this.symbol = symbol;
        this.shift = shift;
    }

    fromValue(val, prec=null) {
        var number = parseNumber(val) * this.multiplier + this.shift;
        return prec === null ? number : number.toPrecision(prec);
    }

    toValue(val) {
        return (parseNumber(val) - this.shift) / this.multiplier;
    }

}

class Quantity {
    constructor(value=NaN, name='', precision=15, unit=null) {
        this._value = parseNumber(value);
        this.name = name;
        this.precision = precision;
        this.unit = unit === null && this.units ?
                             this.units[0] : null;
    }

    get value() {
        return this[this.unit];
    }
    set value(val) {
        if (this.units.includes(this.unit)) {
            this[this.unit] = val;
        }
    }

    static _addUnit(cls, unit) {
        Object.defineProperty(cls.prototype, unit.name, {
            get: function () {
                return unit.fromValue(this._value, this.precision);
            },
            set: function (val) {
                this._value = unit.toValue(val);
            }
        });
    }

    static create(uns=[], name='NewQuantity') {
        // This is to set NewQuantity.name as name
        let NewQuantity = {
            [name]: class extends Quantity { }
        };

        let units = new Map(Array.from(uns, (un) => {
            let unit = new Unit(un);
            Quantity._addUnit(NewQuantity[name], unit);
            return [unit.name, unit];
        }));

        Object.defineProperty(NewQuantity[name].prototype, 'units', {
            value: Array.from(units.keys())
        });
        NewQuantity[name].prototype.getSymbol = function (unitName) {
            return units.get(unitName).symbol;
        };

        return NewQuantity[name];

    }

    static createFromDefs(qtyDefs) {
        let quantities = {};
        // TODO: Use Object.entries instead of Object.keys
        for (const qtyName of Object.keys(qtyDefs)) {
            let name = capitalize(qtyName.trim());
            quantities[name] = Quantity.create(qtyDefs[qtyName], name);
        }
        return quantities;
    }
}

exports.Unit = Unit;
exports.Quantity = Quantity;
