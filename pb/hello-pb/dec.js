var ProtoBuf = require('protobufjs')

ProtoBuf.load('Product.proto',function(err,root){
    if(err)
    throw err

    var Product = root.lookup('Ecommerce.Product')

    var data = Product.decode(msgBuffer)

    console.log(data)
})