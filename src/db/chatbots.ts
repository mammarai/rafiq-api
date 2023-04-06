import { Document, Schema, model } from "mongoose";

// Define interface for the document sub-schema
interface IDocument {
  name: string;
}

// Define interface for the chatbot schema
interface IChatbot extends Document {
  owner: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  documents: IDocument[];
  multilingual: boolean;
  model: string;
  namespace: string;
}

const documentSubSchema = new Schema<IDocument>({
  name: {
    type: String,
    required: true,
  },
});

const chatbotSchema = new Schema<IChatbot>({
  owner: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  documents: {
    type: [documentSubSchema],
    required: true,
  },
  multilingual: {
    type: Boolean,
    required: true,
    default: false,
  },
  model: {
    type: String,
    enum: ["gpt-3.5-turbo", "gpt-4"],
    required: true,
  },
  namespace: {
    type: String,
    required: true,
  },
});

export const Chatbot = model<IChatbot>("Chatbot", chatbotSchema);

// Exporting functions to find, update and create new chatbot
export function findChatbot(id: string): Promise<IChatbot | null> {
  return Chatbot.findById(id);
}

export function updateChatbot(
  id: string,
  update: Partial<IChatbot>
): Promise<IChatbot | null> {
  return Chatbot.findByIdAndUpdate(id, update, { new: true }).exec();
}

export function newChatbot(chatbot: IChatbot): Promise<IChatbot> {
  return new Chatbot(chatbot).save();
}
