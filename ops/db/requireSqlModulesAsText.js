const fs = require('fs');

function requireSqlModulesAsText() {
  require.extensions['.sql'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
  };
}


module.exports = {
  requireSqlModulesAsText
};