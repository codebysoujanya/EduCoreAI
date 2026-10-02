import express from "express";
import Mentor from "../models/Mentor.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const mentors = await Mentor.find();
  res.json(mentors);
});

router.post("/", async (req, res) => {
  const mentor = await Mentor.create(req.body);
  res.json(mentor);
});

export default router;