import { comparePassword, generateToken, hashPassword } from "../../utils/auth";
import { APIError } from "../../utils/error";
import { UserModel } from "./model";
import { TLoginControllerInput, TRegisterControllerInput, TUpadateUserRole } from "./validation";



export async function createUserservice(input: TRegisterControllerInput) {
  const { email, username, password, role } = input;

  const user = await UserModel.findOne({ email });
  if (user) {
    throw APIError.conflict("user email already exist");
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new UserModel({
    email,
    username,
    password: hashedPassword,
    role,
  });
  await newUser.save();

  return newUser;
}

export async function loginService(input: TLoginControllerInput) {
  const { email, password} = input;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw APIError.unauthorized("Invalid username or password");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw APIError.unauthorized("Invalid username or password");
  }

  // if (user.role !== "admin") {
  //   throw APIError.unauthorized("Invalid role");
  // }
  const token = generateToken({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

export async function getUserById(id: string) {
  const user = await UserModel.findById(id);
  if (!user) {
    throw APIError.notFound("User not found");
  }

  return user;
}

export async function updateUserRoleservice(input: TUpadateUserRole) {
  const { role, userId } = input;

  const user = await UserModel.findOne({ _id: userId });

  if (!user) {
    throw APIError.notFound("user not found");
  }

  const result = await UserModel.findByIdAndUpdate(userId, {
    $set: {
      id: userId,
      role: role,
    },
  });

  

  return true;
}

