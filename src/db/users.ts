import mongoose, { ObjectId } from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: String,
  chatbots: { type: [mongoose.Types.ObjectId] },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUserById = (id: String) => UserModel.findById(id);
export const newUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => {
    return user.toObject();
  });
export const updateUserById = (id: String, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
export const getUserByEmail = (email: String) => UserModel.findOne({ email });
