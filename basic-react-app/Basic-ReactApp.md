---
# React App quick start ( Without CRA )
---
Author: Susheel Kumar Pogaku
Last Updated: Apr 20, 2020
---
### Pre-reqs
| npm must be installed already

### Steps to follow
First, create a local folder for the app

    $ mkdir react-app
Navigate to the app directory

    $ cd react-app
Now, run the following command to initialize the app setup

    $ npm init -y
| skip `-y` flag to answer the questionnaire instead of defaults
npm init will create a new `package.json` file. We can now start installing dependencies for our app. Start with

    $ npm install react react-dom
You can see these entries being added under dependencies in package.json file, also now there is a new directory called `node_modules` created.

Create a sub-directory `app` (can be any named anything) and add `index.html`, `index.js` and `index.css` files under it
    
    $ mkdir app
    $ cd app
    $ touch index.js index.css index.html
Let's start writing `Hello World`
> app/index.html
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```
>app/index.js
```javascript
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends Component {
    render() {
        return 'Hello world !!';
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

To run this code properly in our browser, we'd need [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/). To install these dependencies, run the following command

    $ npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader css-loader style-loader webpack webpack-cli webpack-dev-server html-webpack-plugin
 | The `--save-dev` flag is to make sure these dependencies are added as dev-dependencies (NOT build dependencies) under the package.json file
 
 Now, create a file named `webpack.config.js` under `react-app` (project root) directory adn add the following code
 > webpack.config.js
 ```javascript
 let HtmlWebpackPlugin =  require('html-webpack-plugin');
 module.exports = {
    entry : './app/index.js',
    mode: 'development',
    module : {
        rules : [
            { test: /\.(js|jsx)$/, use: [ 'babel-loader' ]},
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]}
        ]
    },
    plugins : [
        new HtmlWebpackPlugin ({
            template : 'app/index.html'
        })
    ]
}
 ```
 Update the `package.json` file to include the following additions
 ```javascript
 ...
"name": "react-app",
....
"main": "index.js",
"babel": {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-react"
    ]
},
"scripts": {
    "start": "webpack-dev-server --open"
},
"dependencies": {...},
"devDependencies": {...}
 ...
 ```
 
 ### Finally,
 run the following command
 
    $ npm start
 and open `localhost:8080` in your browser to see your react app in action.
 
 ### Quick rundown
 
    mkdir react-app
    cd react-app
    npm init -y
    npm install react react-dom
    mkdir app
    cd app
    touch index.html index.js index.css
    ## update files
    cd ..
    npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader css-loader style-loader webpack webpack-cli webpack-dev-server html-webpack-plugin
    touch webpack.config.js
    ## update webpack.config.js
    ## update package.json
    npm start
 