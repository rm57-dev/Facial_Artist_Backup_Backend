import express from "express";
import { sendAppointmentEmail } from "../services/emailService.js";

const router = express.Router();

router.post("/create", async (req, res) => {
    const { name, email, date, hour, service } = req.body;

    try {
        // 1️⃣ Aquí puedes guardar en tu BD (si ya tienes)
        // pero por ahora lo dejamos simple

        // 2️⃣ Enviamos el correo
        await sendAppointmentEmail(email, {
            name,
            date,
            hour,
            service,
        });

        // 3️⃣ Respondemos al frontend
        res.json({ 
            success: true,
            message: "Cita creada y correo enviado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al enviar el correo",
            error: error.message
        });
    }
});

export default router;
