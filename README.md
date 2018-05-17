# Exploring Webpack configuration

Through Webpack lies the path to madness. This I have gathered, reading various articles scattered like breadcrumbs amongst the Interwebs' tangles.

Rather than follow those crumbs, I have decided to cut my own path. My hope is to create a base Webpack configuration, simple and straight-forward, hewing as closely as I can to those modules and plugins maintained by the Webpack Team themselves. In this way, I hope to minimize the wonkiness and hackiness that many articles seem to encourage in their configurations.

At time of writing, Webpack 4.8.3 is current.

This article assumes some familiarity with [Node.js](https://nodejs.org/) and npm, and with setting up a new project folder or repository.

## Wait. Why ... ?

You might be wondering, do we need another Webpack article? Maybe you don't, but I do. Most articles I've found online are out-of-date, completely insane, or both. They steer the reader into brambles, then hand them band-aids to cover the wounds, usually in the form of third-party loaders and plugins that seem less like feature adds, and more like hacks.

This is a living document that I can update as Webpack and/or my needs continue to evolve, and I hope to avoid bloating my `package.json` or Webpack config with anything nonessential.

And by writing this down, I hope to maintain some clarity of mind, staving off the madness that has clearly embraced so many others.

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

This allows the deletion of files and directories, and is useful in build scripts. `del-cli` is fully separate from Webpack, so we can use it without cluttering the configuration file that we'll be building shortly.

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

````$ npm run build````

Go on, try it. =D

----

## Creating the Configuration File

To get Webpack doing more of the things we want, we should employ a configuration file. We might think about the configuration file as our map, a record of where we've been, and a guide for where we next expect to go.

 In the project root, create a new file, `webpack.config.js`, with these contents:

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

As written, this essentially mimics Webpack's default behavior. We'll sketch in more of the terrain as we travel forward. For details on what's here, see Webpack documentation for [Entry](https://webpack.js.org/concepts/#entry), [Output](https://webpack.js.org/concepts/#output) and [Mode](https://webpack.js.org/concepts/#mode). These are core concepts you'll want to understand.

Because it's 2018 and the newer ECMAScript is all the rage, you probably want to include Babel, helpful for teaching the new slang to fogey browsers.

Install the following with npm.

````$ npm install babel-core babel-loader babel-preset-env --save-dev````

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

The regular expression used above, `/.jsx?$/`, will match both `.js` and `.jsx`, just in case you want to use React in your app. Speaking of, we might include React transpiling; skip this next step if you don't need it.

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

It's also worth noting that our HTML template does not explicitly include the script file. Don't worry! Webpack will add the script inclusions before the `body` element closes.

And finally, we are including a `link` element referencing a stylesheet that does not yet exist. That's next.

----

## The CSS!

To here, the road we have cut has been fairly direct. As we get into CSS, though, I must warn you that I've found the terrain somewhat swampy.

Webpack's documentation recommends pairing `css-loader` and `style-loader`. Install them with:

````$ npm install style-loader css-loader --save-dev````

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

As Webpack invokes loaders from right-to-left, the sequence above -- 'style-loader', 'css-loader' -- is important. Don't swap them.

Create a `style.css` file in your `src` folder, and put something -- anything! -- inside of it. Here's something:

**src/style.css**
````css
html {
  background: #ffffff;
  color: #333333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  height: 100%;
  text-rendering: optimizelegibility;
  -ms-touch-action: manipulation;
      touch-action: manipulation;
}

body {
  height: 100%;
  margin: 0;
  padding: 36px 48px;
}
````

Finally, because Webpack can have only a single entry point, and that's our `index.js` file, we must reference our new CSS file within it. At the very top:

**src/index.js**
````js
import css from './style.css';
````

Run your build, and your CSS should appear in the compiled `main.js` file. It works, but it's also lame. Because putting CSS into your JavaScript files is lame. toUpperCase(). LAME.

To combat lameness, here we break from our first-party mission statement, and reach for a third-party solution. That solution is `mini-css-extract-plugin`.

````$ npm install mini-css-extract-plugin --save-dev````

In reading elsewhere, you may find references toward using `extract-text-webpack-plugin`, but visiting that module's Github page, you will find them stating, "Since webpack v4 the extract-text-webpack-plugin should not be used for css. Use mini-css-extract-plugin instead." And so we shall.

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

## Below, a work-in-progress ...

The content below is likely to evolve, or may change entirely. I'm in the midst of writing it, so proceed at your own risk.

## Handling Images

We're well on our way through the swamp, but not out of the muck just yet. Images may appear in your HTML and/or CSS, and Webpack is still leaving them behind. Let's work on including them in our build.

Create an `images` folder inside of `src`, and this is where you'll drop image files.

````
src
  images
````

And we'll need two Webpack loaders, `file-loader` and `url-loader`.

````$ npm install file-loader url-loader --save-dev````

In your configuration file, update your module rules to include the below rule for images files, following the existing CSS rule.

**webpack.config.js**
````js
...
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },

      {
        test: /\.(png|jpg|jpeg|gif)$/,
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
````



----

## What's Next?!

SASS, perhaps. Minification. Assets handling?

This document is still evolving, so I'll add to it as needed.

----

### Sources

[Webpack Documentation](https://webpack.js.org/concepts/) (essential)

[mini-css-extract-plugin on Github](https://github.com/webpack-contrib/mini-css-extract-plugin) (useful)

[Webpack - A Detailed Introduction](https://www.smashingmagazine.com/2017/02/a-detailed-introduction-to-webpack/), by Joseph Zimmerman (out-of-date)

[A tale of Webpack 4 and how to finally configure it in the right way](https://hackernoon.com/a-tale-of-webpack-4-and-how-to-finally-configure-it-in-the-right-way-4e94c8e7e5c1), by Margarita Obraztsova (informative, but a mess)

[Handling Images](https://medium.com/a-beginners-guide-for-webpack-2/handling-images-e1a2a2c28f8d), by Bharat Tiwari
----