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