import userRepository from "../repositories/UserRepository.js";

const formatUser = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  birthdate: user.birthdate,
  age: user.age,
  url_profile: user.url_profile,
  address: user.address,
  roles: user.roles.map((role) => role.name),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

class UserService {
  async getAll() {
    const users = await userRepository.getAll();
    return users.map(formatUser);
  }

  async getById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    return formatUser(user);
  }

  async updateProfile(id, profileData) {
    const allowedData = {
      name: profileData.name,
      lastName: profileData.lastName,
      phoneNumber: profileData.phoneNumber,
      birthdate: profileData.birthdate,
      url_profile: profileData.url_profile || "",
      address: profileData.address || "",
    };

    if (profileData.email) {
      const normalizedEmail = profileData.email.trim().toLowerCase();
      const owner = await userRepository.findByEmail(normalizedEmail);

      if (owner && owner._id.toString() !== id) {
        const error = new Error("El correo ya se encuentra en uso");
        error.status = 400;
        throw error;
      }

      allowedData.email = normalizedEmail;
    }

    const user = await userRepository.updateProfile(id, allowedData);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    return formatUser(user);
  }
}

export default new UserService();
