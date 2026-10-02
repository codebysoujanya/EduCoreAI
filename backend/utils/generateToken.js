import jwt from "jsonwebtoken";

const generateToken = (id, role = "student") => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;