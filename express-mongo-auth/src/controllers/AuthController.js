import authService from "../services/AuthService.js";

class AuthController {
  async signUp(req, res, next) {
    try {
      const requiredFields = [
        "name",
        "lastName",
        "phoneNumber",
        "birthdate",
        "email",
        "password",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "Completa todos los campos obligatorios",
          fields: missingFields,
        });
      }

      const user = await authService.signUp(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "El correo y la contraseña son obligatorios",
        });
      }

      const session = await authService.signIn({ email, password });
      return res.status(200).json(session);
    } catch (error) {
      return next(error);
    }
  }
}

export default new AuthController();
