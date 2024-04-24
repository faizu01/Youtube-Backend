import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
  /*
  Steps to register a user : -
  */
  //get the details of userSchema from frontend
  const { userName, email, fullName, password } = req.body;
  console.log(userName, email, fullName, password);
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

  console.log(avatar);

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

const loginUser = asyncHandler(async (req, res) => {
  /* 
       step1) username/email lo
       step2) password lo 
       step3) validate kro
       step4) check if user exists in DB or not if not throw error else access and refresh token generate and send secure cookie
       step5) login krwado user ko and show success to login
    */

  try {
    const { userName, email, password } = req.body;
    if (!userName || !email) {
      throw new ApiError(400, "userName or email is required");
    }

    const user = User.findOne({
      $or: [{ email }, { userName }]
    });

    if (!user) {
      throw new ApiError(400, "Invalid user");
    }

    const isValidPassword = user.isCorrectPassword(password);

    if (!isValidPassword) {
      throw new ApiError(401, "Invalid Password");
    }

    const accessToken = await user.generateAccessTokens();
    const refreshToken = await user.generateRefreshTokens();

    if (!accessToken) {
      throw new ApiError(
        500,
        "something went wrong while generating the access or refresh tokens"
      );
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const Option = {
      httpOnly: true,
      secure: true
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, Option)
      .cookie("refreshToken", refreshToken, Option)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "user logged in successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error);
  }
});
export { registerUser, loginUser };
