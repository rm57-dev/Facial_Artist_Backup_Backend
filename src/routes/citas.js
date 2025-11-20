// rutas/citas.js
import express from "express";
import db from "../database/db.js"; // tu conexión MySQL
import nodemailer from "nodemailer";

const router = express.Router();

// =====================
//  CONFIGURAR TRANSPORT
// =====================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================
//   CREAR UNA CITA
// =====================
router.post("/", async (req, res) => {
  try {
    const {
      servicio,
      profesional,
      fecha,
      hora,
      nombre,
      celular,
      email,
      notas,
      estado,
      id_usuario,
    } = req.body;

    if (!servicio || !profesional || !fecha || !hora || !nombre || !celular || !email) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const sql = `INSERT INTO citas (servicio, profesional, fecha, hora, nombre, celular, email, notas, estado, id_usuario)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      servicio,
      profesional,
      fecha,
      hora,
      nombre,
      celular,
      email,
      notas,
      estado,
      id_usuario,
    ];

    db.query(sql, values, async (err, result) => {
      if (err) {
        console.error("Error en la DB", err);
        return res.status(500).json({ error: "Error en la base de datos" });
      }

      // =====================
      //  ENVIAR CORREO
      // =====================
      const mailOptions = {
        from: `Facial Artist <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "✨ Tu cita ha sido agendada - Facial Artist",
        html: `
          <h2>Hola ${nombre}, tu cita ha sido registrada ✔</h2>

          <p><b>Detalles de tu cita:</b></p>
          <ul>
            <li><b>Servicio:</b> ${servicio}</li>
            <li><b>Profesional:</b> ${profesional}</li>
            <li><b>Fecha:</b> ${fecha}</li>
            <li><b>Hora:</b> ${hora}</li>
            <li><b>Notas:</b> ${notas || "Sin notas adicionales"}</li>
          </ul>

          <p>Gracias por agendar con <b>Facial Artist</b>. ¡Te esperamos! 💖</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Error enviando correo", emailError);
      }

      res.json({ message: "Cita creada y correo enviado", id: result.insertId });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;