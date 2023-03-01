const path = require('path');

module.exports = {
   webpack: {
      alias: {
         '@': path.resolve(__dirname, 'src/'),
         '@pages': path.resolve(__dirname, 'src/pages/'),
         '@actions': path.resolve(__dirname, 'src/actions/'),
         '@images': path.resolve(__dirname, 'src/assets/images/'),
         '@components': path.resolve(__dirname, 'src/components/'),
         '@common': path.resolve(__dirname, 'src/components/common'),
      }
   },
   jest: {
      configure: {
         moduleNameMapper: {
            '^@(.*)$': '<rootDir>/src$1'
         }
      }
   }
};