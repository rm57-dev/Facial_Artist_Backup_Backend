const express = require('express');
const CitasController = require('../controllers/citas.controller');

const router = express.Router();
const citasController = new CitasController();

// Rutas para citas
router.get('/', (req, res) => citasController.obtenerCitas(req, res));
router.get('/:id', (req, res) => citasController.obtenerCitaPorId(req, res));
router.post('/', (req, res) => citasController.agregarCita(req, res));
router.put('/:id', (req, res) => citasController.actualizarCita(req, res));
router.delete('/:id', (req, res) => citasController.eliminarCita(req, res));

module.exports = router;
