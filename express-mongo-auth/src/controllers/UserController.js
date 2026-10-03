import userService from "../services/UserService.js";

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      return res.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await userService.getById(req.userId);
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }

  async updateMe(req, res, next) {
    try {
      const user = await userService.updateProfile(req.userId, req.body);
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  }
}

export default new UserController();
