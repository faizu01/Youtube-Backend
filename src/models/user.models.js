import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jsonWebToken from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String, //cloudainary
      required: true
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Videos"
      }
    ],
    coverImage: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = bcrypt(this.password);
  next();
});

//verify the password if user signs in
userSchema.methods.isCorrectPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("Password Err " + error);
    throw error;
  }
};

userSchema.methods.generateAccessTokens = function () {
  return jsonWebToken.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

userSchema.methods.generateRefreshTokens = function () {
  jsonWebToken.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};
const User = mongoose.model("User", userSchema);
export default User;
