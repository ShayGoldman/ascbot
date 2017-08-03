function overrideDefaults(defaults, ...overrides) {
  return Object.assign({}, defaults, ...overrides);
}


module.exports = {
  overrideDefaults
};