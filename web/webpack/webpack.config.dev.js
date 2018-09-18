const webpack = require('webpack');
const path = require('path');

const srcPath=path.join(__dirname, '../src');

module.exports={
    context:srcPath,
    
    entry:{
        js:'./index.js'
    }


};
