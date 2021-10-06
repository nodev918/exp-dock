const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports ={
    entry:'./src/index.js',
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname,'dist'),
        clean:true,
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        })
    ],
    mode:'development',
    devServer:{
        static:'./dist',
        port:'3000'
    },
    module:{
        rules:[
            {
                test:/\.css$/i,
                use:['style-loader','css-loader']
            },
            {
                test:/\.(png|jpg|jpeg|svg|gif)$/i,
                type:'asset/resource'
            }
        ]
    }
}