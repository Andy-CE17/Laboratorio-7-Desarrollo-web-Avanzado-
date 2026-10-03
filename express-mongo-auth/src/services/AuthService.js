import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PASSWORD_PATTERN } from "../models/User.js";
import roleRepository from "../repositories/RoleRepository.js";
import userRepository from "../repositories/UserRepository.js";

class AuthService {
  async signUp(userData) {
    const email = userData.email.trim().toLowerCase();
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      const error = new Error("El correo ya se encuentra en uso");
      error.status = 400;
      throw error;
    }

    if (!PASSWORD_PATTERN.test(userData.password)) {
      const error = new Error(
        "La contraseña debe tener 8 caracteres, una mayúscula, un número y un carácter especial",
      );
      error.status = 400;
      throw error;
    }

    const saltRounds = Number.parseInt(
      process.env.BCRYPT_SALT_ROUNDS || "10",
      10,
    );
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    let userRole = await roleRepository.findByName("user");
    if (!userRole) userRole = await roleRepository.create({ name: "user" });

    const user = await userRepository.create({
      name: userData.name,
      lastName: userData.lastName,
      email,
      password: hashedPassword,
      phoneNumber: userData.phoneNumber,
      birthdate: userData.birthdate,
      url_profile: userData.url_profile || "",
      address: userData.address || "",
      roles: [userRole._id],
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
    };
  }

  async signIn({ email, password }) {
    const user = await userRepository.findByEmail(email.trim().toLowerCase(), {
      includePassword: true,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error = new Error("Credenciales inválidas");
      error.status = 401;
      throw error;
    }

    const roles = user.roles.map((role) => role.name);
    const token = jwt.sign(
      { sub: user._id.toString(), roles },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        roles,
      },
    };
  }
}

export default new AuthService();
