Object.assign(module.exports, {
    wrapArrInChar(arr, char = `'`) {
        return arr.map(value => `${char}${value}${char}`);
    }
});

//test utilities
//console.log(module.exports.wrapArrInChar(['g',4,"k"]));
