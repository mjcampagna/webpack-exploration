const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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

			{
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },

			{
        test: /\.(png|gif|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
							limit: 8192,
							name: 'images/[name].[ext]'
            }
          }
				]
			}

		]//rules
	},//module

	plugins: [

		new HtmlWebpackPlugin({
			title: 'My App',
			template: 'src/index.html'
		}),

		new MiniCssExtractPlugin({
      filename: "style.css"
    })


	]//plugins

};
