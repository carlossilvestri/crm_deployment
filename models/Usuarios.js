const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true
    },
    nombre: {
        type: String,
        trim: true,
        required: 'Agrega tu Nombre'
    },
    password: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Usuarios', usuariosSchema);