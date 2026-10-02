import express from "express";

const router = express.Router();

const placements = [];

// APPLY FOR PLACEMENT
router.post("/", (req, res) => {
  const { studentId, company, role } = req.body;

  const application = {
    studentId,
    company,
    role,
    status: "applied",
    date: new Date(),
  };

  placements.push(application);

  res.json({
    success: true,
    application,
  });
});

// GET ALL PLACEMENTS
router.get("/", (req, res) => {
  res.json({
    success: true,
    placements,
  });
});

export default router;