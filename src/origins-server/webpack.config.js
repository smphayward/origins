const path = require('path');
const {
  NODE_ENV = 'production',
} = process.env;
module.exports = {
  entry: './src/origins-server.ts',
  mode: NODE_ENV,
  target: 'node',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'origins-server.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
         
        use: [
          'ts-loader',
        ]
      }
    ]
  }
}
