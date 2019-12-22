Object.assign(module.exports, {
    wrapArrInChar(arr, char = `'`) {
        return arr.map(value => `${char}${value}${char}`);
    },
    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }
});

//test utilities
//console.log(module.exports.wrapArrInChar(['g',4,"k"]));
