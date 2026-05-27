import mongoose from "mongoose";

export interface IContact extends mongoose.Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const ContactSchema = new mongoose.Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name."],
    },
    email: {
      type: String,
      required: [true, "Please provide an email."],
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email."],
    },
    message: {
      type: String,
      required: [true, "Please provide a message."],
      minlength: [10, "Message must be at least 10 characters."],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
