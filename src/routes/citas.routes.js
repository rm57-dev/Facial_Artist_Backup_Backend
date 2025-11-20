const express = require('express');
const citasController = require('../controllers/citas.controller');

const router = express.Router();

// 🟡 Confirmar cita + Enviar correo (PRIMERO para evitar conflictos con :id)
router.put('/confirmar/:id', (req, res) => citasController.confirmarCita(req, res));

// Obtener todas las citas
router.get('/', (req, res) => citasController.obtenerCitas(req, res));

// Obtener cita por ID
router.get('/:id', (req, res) => citasController.obtenerCitaPorId(req, res));

// Crear cita
router.post('/', (req, res) => citasController.agregarCita(req, res));

// Editar cita
router.put('/:id', (req, res) => citasController.actualizarCita(req, res));

// Eliminar cita
router.delete('/:id', (req, res) => citasController.eliminarCita(req, res));

module.exports = router;
