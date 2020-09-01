const Usuarios = require("../models/Usuarios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


//Registra un nuevo usuario en la base de datos.
exports.registrarUsuario = async(req, res) => {
        //Leer los datos del usuario y colocarlos en el modelo Usuario
        const usuario = new Usuarios(req.body);
        usuario.password = await bcrypt.hash(req.body.password, 12);
        //almacenar el usuario
        try {
            await usuario.save();
            res.json({ mensaje: "Usuario creado correctamente." });
        } catch (error) {
            res.json({ mensaje: "Hubo un error" });
        }
    }
    //Autentica un usuario
exports.autenticarUsuario = async(req, res, next) => {
    //Buscar el usuario.
    const { email, password } = req.body;
    const usuario = await Usuarios.findOne({ email });
    //Si no existe el usuario
    if (!usuario) {
        await res.status(401).json({ mensaje: "Ese usuario no existe." });
        next();
    } else {
        //El usuario existe, verificar si el password es correcto o incorrecto.
        if (!bcrypt.compareSync(password, usuario.password)) {
            //si el password es incorrecto.
            await res.status(401).json({ mensaje: 'Password incorrecto.' });
            next();
        } else {
            //password correcto, firmar el token.
            const token = jwt.sign({
                email: usuario.email,
                nombre: usuario.nombre,
                id: usuario._id
            }, 'llavesecreta', {
                expiresIn: '1h'
            });
            //retornar el token
            res.json({ token });
        }
    }
}