var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
	},
	
	module: {
		rules: [

			{ 
				test: /\.jsx?$/, 
				loader: 'babel-loader',
				include: /src/,
				options: {
					presets: ['env', 'react']
				}
			},

		]//rules
	},//module

	plugins: [

		new HtmlWebpackPlugin({
			template: 'src/index.html'
		})

	]//plugins

};
