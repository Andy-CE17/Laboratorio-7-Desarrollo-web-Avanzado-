import bcrypt from "bcrypt";
import roleRepository from "../repositories/RoleRepository.js";
import userRepository from "../repositories/UserRepository.js";

export default async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const existingAdmin = await userRepository.findByEmail(email);

  if (existingAdmin) {
    console.log(`Administrador disponible: ${email}`);
    return;
  }

  const adminRole = await roleRepository.findByName("admin");
  const saltRounds = Number.parseInt(
    process.env.BCRYPT_SALT_ROUNDS || "10",
    10,
  );
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds);

  await userRepository.create({
    name: process.env.ADMIN_NAME,
    lastName: process.env.ADMIN_LAST_NAME,
    email,
    password,
    phoneNumber: process.env.ADMIN_PHONE_NUMBER,
    birthdate: process.env.ADMIN_BIRTHDATE,
    roles: [adminRole._id],
  });

  console.log(`Administrador creado: ${email}`);
}
