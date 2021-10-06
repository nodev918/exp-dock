module.exports = (io) =>{
    var ProtoBuf = require('protobufjs')
    
/*
    function decode(msg) {
        ProtoBuf.load('Product.proto', function (err, root) {
            if (err)
                throw err
            var Product = root.lookup('Ecommerce.Product')
            var data = Product.decode(msg)
            console.log(data)
        })
    }
*/  
    ProtoBuf.load('Product.proto', function (err, root) {
        if (err)
            throw err
        const path = require('path')
        var Product = root.lookup('Ecommerce.Product')
        var data = {
            available: true,
            name: 'ApplePen',
            desc: 'The combination of Apple and Pen',
            price: 100.0
        }
         var msgBuffer = Product.encode(data).finish()
        //decode(msgBuffer)
        




        io.emit('pb',msgBuffer)
    })
    
}
