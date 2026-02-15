import express from "express";
import prisma from "../prisma";

const router = express.Router();

router.put("/avatar/:id", async (req, res) => {
  const { avatar } = req.body;
  const { id } = req.params;

  const user = await prisma.user.update({
    where: { id },
    data: { avatar },
  });

  res.json({ user });
});

export default router;
