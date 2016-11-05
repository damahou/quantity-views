exports.parseNumber = (val) => {
    let num = Number(val);
    return Number.isNaN(num) || ! isFinite(num) ? NaN : parseFloat(val);
};

exports.capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};
