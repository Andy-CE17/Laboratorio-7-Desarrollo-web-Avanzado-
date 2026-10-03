import roleRepository from "../repositories/RoleRepository.js";

export default async function seedRoles() {
  const roleNames = ["user", "admin"];

  for (const name of roleNames) {
    const existingRole = await roleRepository.findByName(name);
    if (!existingRole) await roleRepository.create({ name });
  }

  console.log("Roles disponibles: user, admin");
}
