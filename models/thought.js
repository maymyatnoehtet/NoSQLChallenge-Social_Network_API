const mongoose = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    username: {
      type: String,
      require: true,
    },
    reactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reaction",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

// thoughtSchema.virtual("reactionCount").get(function () {
//   return this.reactions.length;
// });

const Thought = mongoose.model("Thought", thoughtSchema);
module.exports = Thought;
