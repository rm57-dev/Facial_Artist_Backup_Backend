const db = require('../config/conexion_db');

class CitasController {
    async obtenerCitas(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM Cita ORDER BY fecha, hora');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las citas' });
        }
    }

    async agregarCita(req, res) {
        const { fecha, hora, nota, estado, id_usuario } = req.body;

        try {
            const [result] = await db.query(
                'INSERT INTO Cita (fecha, hora, nota, estado, id_usuario) VALUES (?, ?, ?, ?, ?)',
                [fecha, hora, nota, estado || 'pendiente', id_usuario]
            );

            const [cita] = await db.query('SELECT * FROM Cita WHERE id_cita = ?', [result.insertId]);
            res.status(201).json(cita[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la cita' });
        }
    }

    async actualizarCita(req, res) {
        const { id } = req.params;
        const { fecha, hora, nota, estado } = req.body;

        try {
            await db.query(
                'UPDATE Cita SET fecha = ?, hora = ?, nota = ?, estado = ? WHERE id_cita = ?',
                [fecha, hora, nota, estado, id]
            );

            const [cita] = await db.query('SELECT * FROM Cita WHERE id_cita = ?', [id]);
            if (!cita.length) {
                return res.status(404).json({ error: 'Cita no encontrada' });
            }
            res.json(cita[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la cita' });
        }
    }

    async eliminarCita(req, res) {
        const { id } = req.params;
        try {
            const [result] = await db.query('DELETE FROM Cita WHERE id_cita = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Cita no encontrada' });
            }
            res.json({ message: 'Cita eliminada' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar la cita' });
        }
    }
}

module.exports = CitasController;