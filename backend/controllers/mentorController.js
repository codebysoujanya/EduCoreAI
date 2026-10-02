import Mentor from "../models/Mentor.js";
import Student from "../models/Student.js";

// CREATE MENTOR
export const createMentor = async (req, res) => {
  try {
    const { name, expertise, experience } = req.body;

    const mentor = await Mentor.create({
      name,
      expertise,
      experience,
      students: [],
    });

    res.json({
      success: true,
      mentor,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ASSIGN STUDENT TO MENTOR
export const assignStudent = async (req, res) => {
  try {
    const { mentorId, studentId } = req.body;

    const mentor = await Mentor.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    mentor.students.push(studentId);
    await mentor.save();

    res.json({
      success: true,
      message: "Student assigned to mentor",
      mentor,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MENTOR DETAILS
export const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().populate("students");
    res.json({ success: true, mentors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MENTOR FOR A STUDENT
export const getMentorByStudent = async (req, res) => {
  try {
    const mentors = await Mentor.find({
      students: req.params.studentId,
    });

    res.json({ success: true, mentors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};