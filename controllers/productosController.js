const Productos = require('../models/Productos');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');


const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '/../uploads/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato No válido'))
        }
    },
}

// pasar la configuración y el campo
const upload = multer(configuracionMulter).single('imagen');

// Sube un archivo 
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function(error) {
        if (error) {
            res.json({ mensaje: error })
        }
        return next();
    })
}

// agrega nuevos productos
exports.nuevoProducto = async(req, res, next) => {
    const producto = new Productos(req.body);

    try {
        if (req.file.filename) {
            producto.imagen = req.file.filename
        }
        await producto.save();
        res.json({ mensaje: 'Se agrego un nuevo producto' })
    } catch (error) {
        console.log(error);
        next();
    }
}


// Muestra todos los productos
exports.mostrarProductos = async(req, res, next) => {
        try {
            // obtener todos los productos
            const productos = await Productos.find({});
            res.json(productos);
        } catch (error) {
            console.log(error);
            next();
        }
    }
    //Muestra un producto especifico por su id.
exports.mostrarProducto = async(req, res, next) => {
        try {
            //Buscar el producto.
            const producto = await Productos.findById(req.params.idProducto);
            if (!producto) {
                res.json({ mensaje: 'Ese producto no existe.' })
                return next();
            }
            //Mostrar el producto
            res.json(producto);
        } catch (error) {
            console.log(error); //Mostrar el error en la consola.
            next();
        }
    }
    //Actualiza un producto segun su id.
exports.actualizarProducto = async(req, res, next) => {
        try {
            //Buscar el producto.
            const productoAnterior = await Productos.findById(req.params.idProducto);
            //Si no hay producto que actualizar, entonces detener y mandar msj de error.
            if (!productoAnterior) {
                res.json({ mensaje: 'Ese producto no existe.' });
                return next();
            }
            //Construir el nuevo producto.
            let nuevoProducto = req.body;
            //Verificar si hay una imagen nueva.
            if (req.file) {
                nuevoProducto.imagen = req.file.filename;
                //Verificar si hay una imagen anterior.
                if (req.file && productoAnterior.imagen) {
                    //Eliminar la imagen anterior
                    const imagenAnteriorPath = __dirname + `/../uploads/${productoAnterior.imagen}`;
                    //Eliminar archivo con file system que ya es parte de node
                    fs.unlink(imagenAnteriorPath, (error) => {
                        if (error) {
                            console.log(error);
                        }
                        return;
                    });
                }
            } else {
                nuevoProducto.imagen = productoAnterior.imagen;
            }


            //findOneAndUpdate: Parametros: _id, objeto con los datos nuevos, objeto new true para que almacena el dato anterior.
            let producto = await Productos.findOneAndUpdate({ _id: req.params.idProducto }, nuevoProducto, { new: true });
            res.json(producto); //Mostrar el producto.
        } catch (error) {
            console.log(error); //Mostrar el error en la consola.
            next();
        }
    }
    //Eliminar un producto por su id
exports.eliminarProducto = async(req, res, next) => {
    try {
        //Buscar el producto.
        const productoAEliminar = await Productos.findById(req.params.idProducto);
        //Si no hay producto que actualizar, entonces detener y mandar msj de error.
        if (!productoAEliminar) {
            res.json({ mensaje: 'Ese producto no existe.' });
            return next();
        }
        //Verificar si el producto a eliminar tiene una imagen.
        if (productoAEliminar.imagen) {
            //Eliminar la imagen anterior
            const imagenAEliminar = __dirname + `/../uploads/${productoAEliminar.imagen}`;
            //Eliminar archivo con file system que ya es parte de node
            fs.unlink(imagenAEliminar, (error) => {
                if (error) {
                    console.log(error);
                }
                return;
            });
        }
        //Eliminar el producto de MongoDB.
        await Productos.findOneAndDelete({ _id: req.params.idProducto });
        res.json({ mensaje: 'El producto se ha eliminado.' }); //Mandar msj de exito.
    } catch (error) {
        console.log(error); //Mostrar el error en la consola.
        next();
    }
}
exports.buscarProducto = async(req, res, next) => {
    try {
        //obtener el query
        const { query } = req.params;
        const producto = await Productos.find({ nombre: new RegExp(query, 'i') }); // i de case insensitive. Es decir que no le pare si es mayuscula o minuscula cuando este buscando el producto
        res.json(producto);
    } catch (error) {
        console.log(error); //Mostrar el error en la consola.
        res.send(error); //Enviar error al cliente de la api
        next();
    }
}