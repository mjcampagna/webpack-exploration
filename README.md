# Exploring Webpack configuration

Through Webpack lies the path to madness. This I have gathered, reading various articles scattered like breadcrumbs amongst the Interwebs' tangles.

Rather than follow those crumbs, I have decided to cut my own path. My hope is to create a base Webpack configuration, simple and straight-forward, hewing as closely as I can to those modules and plugins maintained by the Webpack Team themselves. In this way, I hope to minimize the wonkiness and hackiness that many articles seem to encourage in their configurations.

At time of writing, Webpack 4.8.3 is current.

This article assumes some familiarity with [Node.js](https://nodejs.org/) and npm, and with setting up a new project folder or repository.

## Wait. Why ... ?

You might be wondering, do we need another Webpack article? Maybe you don't, but I do. Most articles I've found online are out-of-date, completely insane, or both. They steer the reader into brambles, then hand them band-aids to cover the wounds, usually in the form of third-party loaders and plugins that seem less like feature adds, and more like hacks.

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
...js
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

**webpack.config.js**
````js
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

**webpack.config.js**
````js
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
````

The regular expression used above, `/.jsx?$/`, will match both `.js` and `.jsx`, just in case you want to use React in your app. Speaking of, we might include React transpiling:

````npm install babel-preset-react --save-dev````

And we add the React preset to our rules:

**webpack.config.js**
````js
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

## It's HTML Time!

Now let's get our HTML on. For this, we need the `HTML Webpack Plugin`. In keeping with our mission statement, this is maintained by the Webpack Team.

````$ npm install html-webpack-plugin --save-dev````

In our configuration file, we must **require** it, and add the `plugins` configuration.

**webpack.config.js**
````js
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
      title: 'My App',
      template: 'src/index.html'
    })

  ]//plugins

};
````

Now let's revist the empty `index.html` file we created at the top of the article. Open it up, and paste in the following:

**src/index.html**
````html
<!doctype html>
<html dir="ltr" lang="en">
  <head>

    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <title><%= htmlWebpackPlugin.options.title %></title>

    <link rel="stylesheet" href="style.css" />

  </head>
  <body>

  </body>
</html>
````

Note the strange enclosure in the HTML `<title>` element. This allows us to dynamically pull the app's name from the HtmlWebpackPlugin `title` option in our Webpack configuration file.

It's also worth nothing that our HTML template does not explicitly include the script file. Don't worry! Webpack will add the script inclusions before closing the `body` element.

And finally, we are including a `link` element referencing a stylesheet that does not yet exist. That's next.

----

## The CSS!

CSS in Webpack is weird. Let's just get that out of the way before we dive in.

We'll begin with Webpack's `css-loader` and `style-loader`. Install them with:

````$ npm install css-loader style-loader --save-dev````

Then update the rules in our module config.

**webpack.config.js**
````js
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
        use: ['style-loader', 'css-loader']
      }

    ]//rules
  },//module
````

Create a `style.css` file in your `src` folder, and put something -- anything! -- inside of it. Here's something:

**src/style.css**
````css
body {
  background-color: rgba(255,0,0,0.15);
}
````

Finally, because Webpack can have only a single entry point, we must reference our new CSS file within `index.js`. Weird, right? At the very top:

**src/index.js**
````js
import css from './style.css';
````

Run your build, and your CSS should appear in the compiled `main.js` file. It works, but it's also lame. Because putting CSS into your JavaScript files is lame. LAME.

To combat lameness, here we break from our first-party mission statement, and reach for a third-party solution. That solution is `mini-css-extract-plugin`.

````$ npm install mini-css-extract-plugin --save-dev````

In reading elsewhere, you may find references toward using `extract-text-webpack-plugin`, but visiting that module's Github page, you will find them stating, "Since webpack v4 the extract-text-webpack-plugin should not be used for css. Use mini-css-extract-plugin instead."

Our configuration file requires some updates: a require statement, module rules, and a plugin declaration. Here's the updated file in full:

**webpack.config.js**
````js
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
````

Running the build, you will now find a `style.css` file in your `dist` folder!

----

## What's Next?!

SASS, perhaps. Minification. Assets handling?

This document is still evolving, so I'll add to it as needed.

----

### Sources

[Webpack Documentation](https://webpack.js.org/concepts/) (essential)

[mini-css-extract-plugin on Github](https://github.com/webpack-contrib/mini-css-extract-plugin) (useful)

[Webpack - A Detailed Introduction](https://www.smashingmagazine.com/2017/02/a-detailed-introduction-to-webpack/), by Joseph Zimmerman (out-of-date)


[A tale of Webpack 4 and how to finally configure it in the right way](https://hackernoon.com/a-tale-of-webpack-4-and-how-to-finally-configure-it-in-the-right-way-4e94c8e7e5c1), by Margarita Obraztsova (an informative mess)

----