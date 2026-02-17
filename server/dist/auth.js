"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    // basic validation
    if (!name || !email || !password)
        return res.status(400).json({ error: "Missing fields" });
    const existing = await prisma_1.default.user.findUnique({ where: { email } });
    if (existing)
        return res.status(400).json({ error: "Email exists" });
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: { name, email, password: hashed },
    });
    const { password: _p, ...safeUser } = user;
    res.json({ user: safeUser });
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Missing fields" });
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        return res.status(400).json({ error: "User not found" });
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        return res.status(400).json({ error: "Wrong password" });
    const { password: _p, ...safeUser } = user;
    res.json({ user: safeUser });
});
router.get("/me/:id", async (req, res) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: req.params.id },
    });
    if (!user)
        return res.status(404).json({ error: "User not found" });
    const { password, ...safeUser } = user;
    res.json({ user: safeUser });
});
exports.default = router;
