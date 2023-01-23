const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
      minlength: 3,
      maxlength: 50,
    },
    role: {
      type: "String",
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: Number,
      required: [true, "Please provide your phone number"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide an  email address"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
    },
    coparent: {
      type: String,
    },
    profilePic: {
      public_id: { type: String },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre("remove", async function (next) {
  await this.model("Gallery").deleteMany({ user: this._id });
});

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
