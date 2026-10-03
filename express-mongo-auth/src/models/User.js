import mongoose from "mongoose";

const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/;
const PHONE_PATTERN = /^[0-9+() -]{7,20}$/;

const calculateAge = (birthdate) => {
  if (!birthdate) return null;

  const today = new Date();
  const date = new Date(birthdate);
  let age = today.getFullYear() - date.getFullYear();
  const monthDifference = today.getMonth() - date.getMonth();

  if (
    monthDifference < 0
    || (monthDifference === 0 && today.getDate() < date.getDate())
  ) {
    age -= 1;
  }

  return age;
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Ingresa un correo válido"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: (value) => value.startsWith("$2") || PASSWORD_PATTERN.test(value),
        message:
          "La contraseña debe incluir una mayúscula, un número y un carácter especial (# $ % & * @)",
      },
      select: false,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [PHONE_PATTERN, "Ingresa un número telefónico válido"],
    },
    birthdate: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value < new Date(),
        message: "La fecha de nacimiento debe ser anterior a hoy",
      },
    },
    url_profile: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      maxlength: 180,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("age").get(function getAge() {
  return calculateAge(this.birthdate);
});

export { PASSWORD_PATTERN, calculateAge };
export default mongoose.model("User", userSchema);
