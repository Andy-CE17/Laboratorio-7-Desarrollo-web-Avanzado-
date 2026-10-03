import express from "express";

const router = express.Router();

router.get("/", (req, res) => res.redirect("/signIn"));
router.get("/signIn", (req, res) => res.render("sign-in"));
router.get("/signUp", (req, res) => res.render("sign-up"));
router.get("/dashboard", (req, res) => res.render("user-dashboard"));
router.get("/admin", (req, res) => res.render("admin-dashboard"));
router.get("/admin/users/:id", (req, res) =>
  res.render("user-detail", { userId: req.params.id }),
);
router.get("/profile", (req, res) => res.render("profile"));
router.get("/403", (req, res) => res.status(403).render("403"));

export default router;
