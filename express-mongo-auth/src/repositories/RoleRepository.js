import Role from "../models/Role.js";

class RoleRepository {
  async findByName(name) {
    return Role.findOne({ name }).exec();
  }

  async create(roleData) {
    return Role.create(roleData);
  }

  async getAll() {
    return Role.find().sort({ name: 1 }).exec();
  }
}

export default new RoleRepository();
