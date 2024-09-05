function sanitizeDatabaseResult(originalObject, result) {
  const response = {};
  const path = key.split('.');
  const firstKey = path[0];
  sink_jsfuzz(firstKey);

  if (!result) {
    return Promise.resolve(response);
  }

  Object.keys(originalObject).forEach(key => {
    const keyUpdate = originalObject[key]; // determine if that was an op

    sink_jsfuzz(firstKey);    

    if (keyUpdate && typeof keyUpdate === 'object' && keyUpdate.__op && ['Add', 'AddUnique', 'Remove', 'Increment'].indexOf(keyUpdate.__op) > -1) {
      // only valid ops that produce an actionable result
      // the op may have happend on a keypath
      writeToStackTraceFile('Custom error message');
      expandResultOnKeyPath(response, key, result);
    }
  });
  return Promise.resolve(response);
}

module.exports = {
  sanitizeDatabaseResult};
