import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
  /*
  Steps to register a user : -
   1) 
   2) 
   3) 
   4)
   5) 
   6) 
   7) 
   8) 
  */
  //get the details of userSchema from frontend 
  const { userName, email, fullName, password } = req.body;
  console.log(userName,email,fullName,password)
  //validate the data - should be non empty
  if (
    [userName, email, fullName, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are mandatory");
  }

  //Check if user already exixts then return
  const userExist = await User.findOne({
    $or: [{ userName, email }]
  });

  if (userExist) {
    throw new ApiError(409, "User already exixts");
  }

  //check if avatar & coverImage is uploaded to local server
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar required");
  }
  //upload image avatar and coverImage to clodinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  //validate if avatar uploaded to cloudinary
  
  console.log(avatar)

  if (!avatar) {
    throw new ApiError(400, "Avatar upload to cloudinary failed.");
  }

  //create a user object and store user object in DB
  const user = await User.create({
    userName,
    fullName,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url,
    email
  });
   console.log("Till here done");


  //remove password field from user object and return to frontend
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong");
  }

  return res.status(201).json({
    status: 200,
    message: "User created Success"
  });
});

export default registerUser;
