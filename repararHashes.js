require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

(async () => {
  try {
    const conexion = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("🔗 Conectado a la base de datos");

    const [usuarios] = await conexion.query("SELECT id_usuario, email, clave FROM usuarios");

    for (const usuario of usuarios) {
      if (!usuario.clave || usuario.clave.length < 60) {
        const nuevaClave = '123456'; // puedes cambiar esta contraseña base
        const hash = await bcrypt.hash(nuevaClave, 10);

        await conexion.query(
          "UPDATE usuarios SET clave = ? WHERE id_usuario = ?",
          [hash, usuario.id_usuario]
        );

        console.log(`✅ Hash actualizado para ${usuario.email}`);
      } else {
        console.log(`✔️ ${usuario.email} ya tiene un hash válido`);
      }
    }

    console.log("🎉 Reparación completada con éxito.");
    await conexion.end();
  } catch (error) {
    console.error("❌ Error al reparar hashes:", error);
  }
})();
