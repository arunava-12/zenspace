import express from "express";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // basic validation
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Email exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const { password: _p, ...safeUser } = user;
  res.json({ user: safeUser });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Wrong password" });

  const { password: _p, ...safeUser } = user;
  res.json({ user: safeUser });
});

router.get("/me/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
});

export default router;
