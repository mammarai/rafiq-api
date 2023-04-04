import mongoose, { ObjectId } from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: String,
  chatbots: { type: [mongoose.Types.ObjectId] },
});

export const UserModel = mongoose.model("User", UserSchema);

export function getUserById(id: String) {
  UserModel.findById(id);
}
export function newUser(values: Record<string, any>) {
  new UserModel(values).save().then((user) => {
    return user.toObject();
  });
}
export function updateUserById(id: String, values: Record<string, any>) {
  UserModel.findByIdAndUpdate(id, values);
}
export function getUserByEmail(email: String) {
  UserModel.findOne({ email });
}
