import Student from "../models/Student.js";

// CREATE STUDENT
export const createStudent = async (req, res) => {
  try {
    const data = req.body || {};

    const emotion = data.emotion || "";
    const attendance = Number(data.attendance || 0);
    const academicScore = Number(data.academicScore || 0);

    let risk = 0;

    if (emotion === "Stressed") risk += 30;
    if (emotion === "Confused") risk += 25;
    if (attendance < 75) risk += 30;
    if (academicScore < 60) risk += 20;

    const student = await Student.create({
      ...data,
      riskScore: Math.min(risk, 100),
    });

    res.json({
      success: true,
      student,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET ALL
export const getStudents = async (req, res) => {
  const students = await Student.find();
  res.json({ success: true, students });
};