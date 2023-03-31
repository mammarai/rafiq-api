import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  //url: { type: String, required: true },
  //type: { type: String, required: true }, *
  //size: { type: String, required: true },
});

const ChatbotSchema = new mongoose.Schema({
  owner: { type: String, required: true, immutable: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: false },
  createdAt: { type: Date, required: true, default: Date.now },
  pineconeIndex: { type: String, required: true, immutable: true },
  documents: { type: [DocumentSchema], required: true },
  multilingual: { type: Boolean, required: true, default: false },
  model: { type: String, required: true, default: "gpt-3.5-turbo" },
});

export const ChatBotModel = mongoose.model("Chatbot", ChatbotSchema);

export const getUserById = (id: String) => ChatBotModel.findById(id);
export const newChatbot = (values: Record<string, any>) =>
  new ChatBotModel(values).save().then((chatbot) => {
    return chatbot.toObject();
  });
export const updateChatbotById = (id: String, values: Record<string, any>) =>
  ChatBotModel.findByIdAndUpdate(id, values);
