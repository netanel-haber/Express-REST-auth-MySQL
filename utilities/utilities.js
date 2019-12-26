Object.assign(module.exports, {
  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  },
  reorderKeyValuePairs(jumbledKeys, jumbledValues, realKeyOrder) {
    return new Map(realKeyOrder
      .map(key => {
        return (jumbledKeys.indexOf(key) !== -1) ?
          [key, jumbledValues[jumbledKeys.indexOf(key)]] :
          null
      })
      .filter(val => val !== null));
  }
});

//test utilities

