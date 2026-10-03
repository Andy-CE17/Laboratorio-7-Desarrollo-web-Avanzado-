import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const token = authorization.slice(7).trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.userRoles = Array.isArray(payload.roles) ? payload.roles : [];
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Token no válido o caducado",
      code: error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
    });
  }
}
