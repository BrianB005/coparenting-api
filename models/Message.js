const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");
const MessageSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: [200, "Message is too long"],
    },
    body: {
      type: String,
      required: true,
      maxLength: [400, "Message is too long"],
    },
    sender: {
      type: mongoose.Types.ObjectId,
      required: [true, "Sender can't be empty"],
      ref: "User",
      autopopulate: true,
    },
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver can't be empty"],
      autopopulate: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);
MessageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model("Message", MessageSchema);
