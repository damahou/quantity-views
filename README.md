# Multi-unit Quantity Views

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/damahou/quantity-views/blob/master/LICENSE)

This is a node library to easily change the displayed unit of a quantity
(Length, Area, Speed, Pressure...), and easily set the quantity value in any
predefined unit.

**Caution:** This library should not be used in code requiring high accuracy or
efficient/massive unit conversions. It is intended as an auxiliary resource to
implement user interfaces, mainly associated to data binding techniques as
in angular or react.


## Installation

To install the library, run:

    $ npm install quantity-views -g

or add it as a dependency to your project.

## Basic usage

Install the library and try it in a interactive node session

    $ node

First, require one of the builtin quantity classes (more about builtin
quantities below)

    > Length = require('quantity-views').Length
    [Function: Length]

and instanciate it as an object representing for example a width, with a
value of 1 (1 what? More below)    

    > width = new Length(value=1, name='width')
    Length { _value: 1, name: 'width', precision: 15 }

Check the available units that `width` can display/be set

    > width.units
    [ 'metre',
      'centimetre',
      'millimetre',
      'inch',
      'foot',
      'footUS',
      'yard',
      'kilometre',
      'nauticalMille',
      'mille',
      'milleUS' ]

Obtain our `width` in metres (we discover that the initial values is in metres)

    > width.metre
    '1.00000000000000'

and then in centimetres

    > width.centimetre
    '100.000000000000'

Now set our `width` in centimetres

    > width.centimetre = 3.4
    3.4

and get it in metres

    > width.metre
    '0.0340000000000000'

or inches

    > width.inch
    '1.33858267716535'

Set `width` as one inch

    > width.inch = 1
    1

and obtain it in millimetres

    > width.millimetre
    '25.4000000000000'

Inputs can be strings strictly representing floats

    > width.foot = '2.3'
    '2.3'
    > width.metre
    '0.701040000000000'

Weird strings are allowed

    > width.yard = '34hhjp'
    '34hhjp'

but the quantity then is Not a Number

    > width.metre
    'NaN'

Show symbols for every unit

    > Array.from(width.units, v => [v, width.getSymbol(v)])
    [ [ 'metre', 'm' ],
      [ 'centimetre', 'cm' ],
      [ 'millimetre', 'mm' ],
      [ 'inch', 'in' ],
      [ 'foot', 'ft' ],
      [ 'footUS', 'ftUS' ],
      [ 'yard', 'yd' ],
      [ 'kilometre', 'km' ],
      [ 'nauticalMille', 'NM' ],
      [ 'mille', 'mi' ],
      [ 'milleUS', 'miUS' ] ]


## Builtin quantities

The quantity classes available on `require(quantity-views)`, are

- Length
- Area
- Volume
- Speed
- Acceleration
- Mass
- Density
- Force
- Pressure
- Torque
- Energy
- Power
- Time
- Temperature
- DynamicViscosity
- KineticViscosity
- Adimensional

Their constructors can take the optional arguments

- `value` A number. Defaults to `NaN`. This is stored in the `._value` property.
  It is the value of the quantity in no particular unit. For the builtin
  quantity classes, `._value` attribute coincides with the value of the
  quantity in the corresponding SI base unit.
- `name` A string. Defaults to `''`. Stored in the `.name` attribute. 
  Not used by the library. It is an user field.
- `precision` A number within 1 and 21 or `null`. Defaults to 15. Stored in the
  `.precision` attribute. If `.precision` is a number, all unit queries are
  strings formatted with 'Number.prototype.toPrecision(quantity.precision)'.
  If precision is `null`, raw numbers are returned:



      $ node
      > Length = require('quantity-views').Length
      [Function: Length]
      > distance = new Length()
      Length { _value: NaN, name: '', precision: 15 }
      > distance.nauticalMille = 2
      2
      > distance.kilometre
      '3.70400000000000'
      > distance.precision = 5
      5
      > distance.kilometre
      '3.7040'
      > distance.mille
      '2.3016'
      > distance.precision = null
      null
      > distance.kilometre
      3.704
      > distance.mille
      2.301558896047085
      > distance.kilometre = ''
      ''
      > distance.mille
      NaN
      > distance.precision = 10
      10
      > distance.mille
      'NaN'

## User defined quantities

Builtin quantity classes are described in
[lib/defs.js](https://github.com/damahou/quantity-views/blob/master/lib/defs.js).
Feel free of defining your own quantity classes in the same format.

The class `Quantity` is also exported when requiring `quantity-views`. It is a
constructor for new quantity classes:

    $ node
    Quantity = require('quantity-views').Quantity
    > MyQties = Quantity.createFromDefs({
    ... mylength: [
    ... {name: 'astronomicalUnit', multiplier: 1/149597870700, symbol: 'AU'},
    ... {name: 'lightSecond', multiplier: 1/299792458, symbol: ''},
    ... {name: 'parsec', multiplier: 1/3.085677581e16, symbol: 'pc'}]})
    { Mylength: [Function: Mylength] }
    > coriolanusOdometre = new MyQties.Mylength(1e13)
    Mylength { _value: 10000000000000, name: '', precision: 15 }
    > coriolanusOdometre.astronomicalUnit
    '66.8458712226845'
    > coriolanusOdometre.lightSecond
    '33356.4095198152'
    > coriolanusOdometre.parsec
    '0.000324077928996043'
    > coriolanusOdometre._value
    10000000000000

Note also that in this example the `._value` is not stored in any unit of the
quantity.

## License

This code is subject to
[MIT](https://github.com/damahou/quantity-views/blob/master/LICENSE) license.
