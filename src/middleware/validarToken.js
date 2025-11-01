const jwt = require('jsonwebtoken');

function validarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ Error: 'Token requerido' });

jwt.verify(token, process.env.JWT_secret || 'secreto', (err, decoded) => {
    if (err) return res.status(401).json({ Error: 'Token inválido' });

    req.user = decoded; //datos del ususario 
    next();
  }); 
}

module.exports = validarToken;