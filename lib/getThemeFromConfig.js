const requiredFields = ["id", "password", "store"];

module.exports = function getThemeFromConfig(config, name = 'dev') {
  const { themes } = config;
  const theme = themes[name];

  for (const field of requiredFields) {
    if (!theme[field]) {
      throw new Error(`${name} theme error - the ${field} field is required`);
    }
  }

  return theme;
}
