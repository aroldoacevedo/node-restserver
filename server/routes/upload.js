const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let id = req.params.id;
    let tipo = req.params.tipo;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: true,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    // Cambiar nombre del archivo
    // 1-20122020.jpg
    let nombreArchivo = `${ id }-${ (new Date()).getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });

});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioBD) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!usuarioBD) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        borraArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;

        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    })
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoBD) {
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        borraArchivo(productoBD.img, 'productos');

        productoBD.img = nombreArchivo;

        productoBD.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    })
}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;