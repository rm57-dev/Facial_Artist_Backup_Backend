const db = require('../config/conexion_db');
const nodemailer = require('nodemailer');

class CitasController {

  // Crear nueva cita (correo: "tu cita está por confirmar")
  async agregarCita(req, res) {
    const { fecha, hora, nota, id_usuario, email, nombre } = req.body;

    try {
      // 🔹 Insertar cita SIN nombre (tu tabla no tiene esa columna)
      const [result] = await db.query(
        'INSERT INTO Cita (fecha, hora, nota, estado, id_usuario, email) VALUES (?, ?, ?, ?, ?, ?)',
        [fecha, hora, nota, 'pendiente', id_usuario || null, email]
      );

      const id_cita = result.insertId;

      // 📩 Enviar correo de confirmación pendiente
      if (email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Facial Artist" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "📩 Tu cita está por confirmar",
          html: `
            <h2 style="color:#b8860b">Tu cita está por confirmar</h2>
            <p>Hola ${nombre || "Cliente"}, hemos recibido tu solicitud.</p>
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p><strong>Hora:</strong> ${hora}</p>
            <p>Muy pronto será revisada por nuestro equipo ✨</p>
          `,
        };

        await transporter.sendMail(mailOptions);
      }

      res.status(201).json({
        id_cita,
        fecha,
        hora,
        nota,
        estado: "pendiente",
        email,
        id_usuario
      });

    } catch (error) {
      console.error("ERROR agregarCita:", error);
      res.status(500).json({ error: 'Error al crear la cita' });
    }
  }

  // Obtener todas las citas
  async obtenerCitas(req, res) {
    try {
      const [citas] = await db.query('SELECT * FROM Cita ORDER BY fecha ASC, hora ASC');
      res.json(citas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener citas' });
    }
  }

  // Obtener cita por ID
  async obtenerCitaPorId(req, res) {
    const { id } = req.params;
    try {
      const [cita] = await db.query('SELECT * FROM Cita WHERE id_cita = ?', [id]);
      if (cita.length === 0) return res.status(404).json({ error: 'Cita no encontrada' });
      res.json(cita[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener la cita' });
    }
  }

  // Actualizar cita
  async actualizarCita(req, res) {
    const { id } = req.params;
    const { fecha, hora, nota, estado } = req.body;

    try {
      await db.query(
        'UPDATE Cita SET fecha = ?, hora = ?, nota = ?, estado = ? WHERE id_cita = ?',
        [fecha, hora, nota, estado, id]
      );

      const [cita] = await db.query('SELECT * FROM Cita WHERE id_cita = ?', [id]);
      res.json(cita[0]);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar la cita' });
    }
  }

  // Eliminar cita
  async eliminarCita(req, res) {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM Cita WHERE id_cita = ?', [id]);
      res.json({ message: 'Cita eliminada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la cita' });
    }
  }

  // CONFIRMAR CITA + enviar correo premium
  async confirmarCita(req, res) {
    const { id } = req.params;

    try {
      const [cita] = await db.query('SELECT * FROM Cita WHERE id_cita = ?', [id]);

      if (!cita.length) return res.status(404).json({ error: "Cita no encontrada" });

      const cliente = cita[0];

      // actualizar a confirmada
      await db.query('UPDATE Cita SET estado = "confirmada" WHERE id_cita = ?', [id]);

      // enviar correo premium
      if (cliente.email) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Facial Artist" <${process.env.EMAIL_USER}>`,
          to: cliente.email,
          subject: "💎 Tu cita ha sido CONFIRMADA",
          html: `
            <h2 style="color:#b8860b">✨ Cita Confirmada ✨</h2>
            <p>Tu cita ha sido confirmada.</p>
            <p><strong>Fecha:</strong> ${cliente.fecha}</p>
            <p><strong>Hora:</strong> ${cliente.hora}</p>
            <p>¡Te esperamos para una experiencia exclusiva! 💖</p>
          `,
        };

        await transporter.sendMail(mailOptions);
      }

      res.json({ message: "Cita confirmada y correo enviado" });

    } catch (error) {
      console.error("ERROR confirmarCita:", error);
      res.status(500).json({ error: "Error al confirmar la cita" });
    }
  }
}

module.exports = new CitasController();
