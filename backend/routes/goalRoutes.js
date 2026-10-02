import express from "express";
import Goal from "../models/Goal.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const goal = await Goal.create(req.body);
  res.json(goal);
});

router.get("/:userId", async (req, res) => {
  const goals = await Goal.find({
    userId: req.params.userId,
  });

  res.json(goals);
});

export default router;