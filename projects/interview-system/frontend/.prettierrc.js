const { getPrettierConfig } = require('@iceworks/spec');

module.exports = {
  ...getPrettierConfig('react'),
  semi: false
};
