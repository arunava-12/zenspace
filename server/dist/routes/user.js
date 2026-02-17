"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../prisma"));
const router = express_1.default.Router();
router.put("/avatar/:id", async (req, res) => {
    const { avatar } = req.body;
    const { id } = req.params;
    const user = await prisma_1.default.user.update({
        where: { id },
        data: { avatar },
    });
    res.json({ user });
});
exports.default = router;
