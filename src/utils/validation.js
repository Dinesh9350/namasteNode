const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is inValid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }
};

const validateProfileEditData = (req) => {
  const { firstName, lastName, age, gender, photoUrl, skills, about } =
    req.body;
  if (firstName && typeof firstName !== "string") {
    throw new Error("First name is not Valid");
  } else if (lastName && typeof lastName !== "string") {
    throw new Error("Last name is not Valid");
  } else if (age && age < 18 && age > 80) {
    throw new Error("Age must be between 18 and 80");
  } else if (gender && !["male", "female"].includes(gender)) {
    throw new Error("Gender is not Valid");
  } else if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("PhotoUrl is not Valid");
  } else if (about && about.length > 100) {
    throw new Error("About, only 100 character are allowed");
  } else if (skills && Array.isArray(skills) && skills.length > 5) {
    throw new Error("skills, only 5 skills are allowed");
  }

  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "photoUrl",
    "skills",
  ];
  //.every - return boolean
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );
  if (!isEditAllowed) {
    throw new Error("Invalid Update request!");
  }

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateProfileEditData,
};
