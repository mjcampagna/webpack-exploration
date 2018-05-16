# Exploring Webpack configuration

Through Webpack lies the path to madness. This I have gathered, reading various articles scattered like breadcrumbs amongst the Interwebs' tangles.

Rather than follow those crumbs, I have decided to cut my own path. My hope is to create a base Webpack configuration, simple and straight-forward, hewing as closely as I can to those modules and plugins maintained by the Webpack Team themselves. In this way, I hope to minimize the wonkiness and hackiness that many articles seem to encourage in their configurations.

At time of writing, Webpack 4.8.3 is current.

This article assumes some familiarity with [Node.js](https://nodejs.org/) and npm, and with setting up a new project folder or repository.

## Wait. Why ... ?

You might be wondering, do we need another Webpack article? Maybe you don't, but I do. Most articles I've found online are out-of-date, completely insane, or both. They steer the reader into brambles, then hand them band-aids to cover the wounds, in the form of third-party loaders and plugins that seem less like feature adds, and more like hacks.

This is a living document that I can update as Webpack and/or my needs continue to evolve, and I hope to avoid bloating my `package.json` or Webpack config with anything nonessential.

And by writing this down, I hope to maintain a clarity of mind, and stave off the madness that has clearly embraced so many others.

Let's get to it.

## First Steps

Initialize the project folder with:

````$ npm init````

It's okay to accept the defaults, and you will end up with a `package.json` ready to work with.

Install Webpack and its command-line interface as development dependencies with:

````$ npm install webpack webpack-cli --save-dev````

Within the project folder, create a `src` folder, containing two files, `index.html` and `index.js`. At this point, your folder should look like this:

````
node_modules
src
  index.html
  index.js
package-lock.json
package.json
````

Create a `.gitignore` file, and let's ignore both `node_modules` and `dist`, a folder which will be created later.

**.gitignore**
````
dist/
node_modules/
````

By default, Webpack will create the `dist` folder when it runs, and dump its output there. But we might like to clean up the existing `dist` when building anew, so let's set that up.

````
$ npm install del-cli --save-dev
````

This allows the deletion of files and directories, and is useful in build scripts.

Open the `package.json` file, and edit the "scripts" section to match the following.

**package.json**
````
...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "prebuild": "del-cli dist -f",
    "webpack": "webpack --production",
    "build": "npm run prebuild -s && npm run webpack -s"
  },
````

The `prebuild` will remove an existing `dist` folder, `webpack` will recreate it, and we'll use `build` to run both things at once, using:

````npm run build````

Go on, try it.

----

## Launching a Configuration File

To get Webpack doing more of the things we want, we should employ a configuration file. In the project root, create a new file, `webpack.config.js`, with these contents:

````
const path = require('path');

module.exports = {
	mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
	},
};
````

This essentially mimics Webpack's default behavior, and we will begin to expand on it. For details on what's here, see Webpack documentation for [Entry](https://webpack.js.org/concepts/#entry), [Output](https://webpack.js.org/concepts/#output) and [Mode](https://webpack.js.org/concepts/#mode). These are core concepts you'll want to understand.

Because it's 2018 and the JS is all the rage, you probably want to include Babel for the fogey browsers.

Install the following with npm.

````npm install babel-core babel-loader babel-preset-env --save-dev````

To use these, we'll need to grow our configuration file to include modules.

````
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
					presets: ['env']
				}
			},

		]//rules
	}//module
};

Optionally, we might include React transpiling. In that case:

````npm install babel-preset-react --save-dev````

And we add the React preset to our rules:

````
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
	}//module
````

----

### Sources

[Webpack - A Detailed Introduction](https://www.smashingmagazine.com/2017/02/a-detailed-introduction-to-webpack/), by Joseph Zimmerman


[A tale of Webpack 4 and how to finally configure it in the right way](https://hackernoon.com/a-tale-of-webpack-4-and-how-to-finally-configure-it-in-the-right-way-4e94c8e7e5c1), by Margarita Obraztsova

----