# Exploring Webpack configuration

Through Webpack lies the path to madness. This I have gathered, reading various articles scattered like breadcrumbs amongst the Interwebs' tangles.

Rather than follow those crumbs, I have decided to cut my own path. My hope is to create a base Webpack configuration, simple and straight-forward, hewing as closely as I can to those modules and plugins maintained by the Webpack Team themselves. In this way, I hope to minimize the wonkiness and hackiness that many articles seem to encourage in their configurations.

At time of writing, Webpack 4.8.3 is current.

This article assumes some familiarity with [Node.js](https://nodejs.org/) and npm, and with setting up a new project folder or repository.

Initialize the project folder with:

````$ npm init````

It's okay to accept the defaults, and you will end up with a `package.json` ready to work with.

Install Webpack and its command-line interface as development dependencies with:

````$ npm install webpack webpack-cli --save-dev````

Within the project folder, create a `src` folder, containing two files, `index.html` and `index.js`. At this point, your folder should look like this:

````
node_modules
src
  -- index.html
	-- index.js
package-lock.json
package.json
````

Create a `.gitignore` file, and let's ignore both `node_modules` and `dist`, a folder which will be created later.

**.gitignore**
````
dist/
node_modules/
````

----

### Sources

[Webpack - A Detailed Introduction](https://www.smashingmagazine.com/2017/02/a-detailed-introduction-to-webpack/), by Joseph Zimmerman


[A tale of Webpack 4 and how to finally configure it in the right way](https://hackernoon.com/a-tale-of-webpack-4-and-how-to-finally-configure-it-in-the-right-way-4e94c8e7e5c1), by Margarita Obraztsova

----