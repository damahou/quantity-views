const Quantity = require('./core').Quantity;
let defs = require('./defs');

Object.assign(exports, Quantity.createFromDefs(defs.defaultQuantities));
exports.Quantity = Quantity;
