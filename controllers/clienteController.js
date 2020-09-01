const Clientes = require("../models/Clientes");

exports.nuevoCliente = async(req, res, next) => {
        const clientes = new Clientes(req.body);

        try {
            //Almacenar el registro.
            await clientes.save();
            res.json({ mensaje: "Se agrego un nuevo cliente" });
        } catch (error) {
            //Si hay un error, console.log y next.
            res.send(error);
            next();

        }
    }
    //Muestra todos los clientes
exports.mostrarClientes = async(req, res, next) => {

        const clientes = await Clientes.find({});

        try {
            res.json(clientes);
        } catch (error) {
            //Si hay un error, console.log y next.
            res.send(error);
            next();
        }
    }
    //Muestra un cliente por su id
exports.mostrarCliente = async(req, res, next) => {
        const cliente = await Clientes.findById(req.params.idCliente);

        if (!cliente) {
            res.json({ mensaje: "Ese cliente no existe" });
            next();
        }
        //Mostrar el cliente.
        res.json(cliente);
    }
    //Actualiza un cliente por su id.
exports.actualizarCliente = async(req, res, next) => {
        try {
            //mongoose queries. Documentacion: https://mongoosejs.com/docs/api/query.html
            //findOneAndUpdate: Parametros: _id, objeto con los datos nuevos, objeto new true para que almacena el dato anterior. 
            const cliente = await Clientes.findOneAndUpdate({ _id: req.params.idCliente }, req.body, { new: true });
            res.json(cliente); //Mostrar el cliente.
        } catch (error) {
            //Si hay un error, console.log y next.
            res.send(error);
            next();
        }
    }
    //Eliminar un cliente por su id.
exports.eliminarCliente = async(req, res, next) => {
    try {
        await Clientes.findOneAndDelete({ _id: req.params.idCliente });
        res.json({ mensaje: "El cliente se ha eliminado." });
    } catch (error) {
        //Si hay un error, console.log y next.
        res.send(error);
        next();
    }
}