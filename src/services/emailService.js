import express from "express";
import { sendAppointmentEmail } from "../services/emailService.js";
import db from "../config/db.js";  // ajusta el nombre si tu archivo se llama distinto

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        const { name, email, date, hour, service } = req.body;

        // 1️⃣ Guardar cita en la base de datos
        const sql = `
            INSERT INTO appointments (name, email, date, hour, service)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.execute(sql, [name, email, date, hour, service]);

        // 2️⃣ Enviar correo al cliente
        await sendAppointmentEmail(email, {
            name,
            date,
            hour,
            service,
        });

        // 3️⃣ Respuesta al frontend
        res.json({
            success: true,
            message: "Cita creada y correo enviado exitosamente"
        });

    } catch (error) {
        console.error("Error creando cita:", error);

        res.status(500).json({
            success: false,
            message: "Error creando la cita",
            error: error.message
        });
    }
});

export default router;
