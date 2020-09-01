const Pedidos = require("../models/Pedidos");



//Agrega un pedido
exports.nuevoPedido = async(req, res, next) => {
        const pedido = await Pedidos(req.body);
        try {
            await pedido.save();
            res.json({ mensaje: 'Se agrego un nuevo pedido.' });
        } catch (error) {
            //Si hay un error, console.log y next.
            res.send(error);
            console.log(error);
            next();
        }
    }
    // Muestra todos los pedidos
exports.mostrarPedidos = async(req, res, next) => {
        try {
            const pedidos = await Pedidos.find({}).populate('cliente').populate({
                path: 'pedido.producto',
                model: 'Productos'
            });

            res.json(pedidos);
        } catch (error) {
            console.log(error);
            next();
        }
    }
    //Muestra un pedido por su id.
exports.mostrarPedido = async(req, res, next) => {

        try {
            //Obtener el pedido.
            const pedido = await Pedidos.findById(req.params.idPedido).populate('cliente').populate({ path: 'pedido.producto', model: 'Productos' }); //populate permite mostrar los datos de la llave foranea.
            if (!pedido) {
                res.json({ mensaje: "Ese pedido no existe" }); //Mostrar msj de error.
                return next(); //Dejar de ejecutar el middleware
            }
            //Mostrar el pedido
            res.json(pedido);
        } catch (error) {
            //Si hay un error, console.log y next.
            res.send(error);
            next();
        }
    }
    //Actualiza el pedido por su ID.
exports.actualizarPedido = async(req, res, next) => {

        try {
            //Obtener el pedido.
            let pedido = await Pedidos.findOneAndUpdate({ _id: req.params.idPedido }, req.body, { new: true }).populate('cliente').populate({ path: 'pedido.producto', model: 'Productos' }); //populate permite mostrar los datos de la llave foranea.
            if (!pedido) {
                res.json({ mensaje: "Ese pedido no existe" }); //Mostrar msj de error.
                return next(); //Dejar de ejecutar el middleware
            }
            res.json(pedido); //Mostrar el pedido
        } catch (error) {
            //Si hay un error, console.log y next.
            res.send(error);
            next();
        }
    }
    //Eliminar un pedido por su id.
exports.eliminarPedido = async(req, res, next) => {
    try {
        //Obtener el pedido.
        await Pedidos.findOneAndDelete({ _id: req.params.idPedido });
        res.json({ mensaje: "El pedido se ha eliminado." }); //Mostrar el pedido
    } catch (error) {
        //Si hay un error, console.log y next.
        res.send(error);
        next();
    }
}