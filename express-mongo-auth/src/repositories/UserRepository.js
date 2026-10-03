import User from "../models/User.js";

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email, { includePassword = false } = {}) {
    let query = User.findOne({ email }).populate("roles");

    if (includePassword) query = query.select("+password");
    return query.exec();
  }

  async findById(id) {
    return User.findById(id).populate("roles").exec();
  }

  async updateProfile(id, profileData) {
    return User.findByIdAndUpdate(id, profileData, {
      new: true,
      runValidators: true,
    })
      .populate("roles")
      .exec();
  }

  async updatePassword(id, hashedPassword) {
    return User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true, runValidators: true },
    ).exec();
  }

  async getAll() {
    return User.find().populate("roles").sort({ createdAt: -1 }).exec();
  }
}

export default new UserRepository();
