const express = require('express');
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const productosController = require("../controllers/productosController");
const pedidosController = require("../controllers/pedidosController");
const usuariosController = require("../controllers/usuariosController");
//Middleware para proteger las rutas.
const auth = require("../middleware/auth");


module.exports = () => {
    /* CLIENTES */
    //Agrega nuevos clientes.
    router.post('/clientes', clienteController.nuevoCliente);
    //Obtener todos los clientes
    router.get('/clientes', auth, clienteController.mostrarClientes);
    //Muestra un cliente en especifico.
    router.get('/clientes/:idCliente', auth, clienteController.mostrarCliente);
    //Actualiza cliente por el id
    router.put('/clientes/:idCliente', auth, clienteController.actualizarCliente);
    //Eliminar cliente.
    router.delete('/clientes/:idCliente', auth, clienteController.eliminarCliente);
    /* PRODUCTOS */
    //Agrega un producto.
    router.post('/productos', auth, productosController.subirArchivo, productosController.nuevoProducto);
    //Muestra todos los productos.
    router.get('/productos', auth, productosController.mostrarProductos);
    //Muestra un producto especifico por su id. actualizarProducto
    router.get('/productos/:idProducto', auth, productosController.mostrarProducto);
    //Actualiza un producto segun su id.
    router.put('/productos/:idProducto', auth, productosController.subirArchivo, productosController.actualizarProducto);
    //Eliminar un producto especifico por su id.
    router.delete('/productos/:idProducto', auth, productosController.eliminarProducto);
    //Busqueda de productos
    router.post('/productos/:query', auth, productosController.buscarProducto);
    /* PEDIDOS */
    //Agrega nuevos pedidos.
    router.post('/pedidos/nuevo/:idUsuario', auth, pedidosController.nuevoPedido);
    //Obtener todos los pedidos
    router.get('/pedidos', auth, pedidosController.mostrarPedidos);
    //Muestra un pedido en especifico.
    router.get('/pedidos/:idPedido', auth, pedidosController.mostrarPedido);
    //Actualiza pedido por el id
    router.put('/pedidos/:idPedido', auth, pedidosController.actualizarPedido);
    //Eliminar un pedido por su id.
    router.delete('/pedidos/:idPedido', auth, pedidosController.eliminarPedido);

    /****USUARIOS****/
    router.post('/crear-cuenta', auth, usuariosController.registrarUsuario);
    router.post('/iniciar-sesion', usuariosController.autenticarUsuario);
    router.get('/', (req, res) => { res.send('inicio'); });
    return router;
}