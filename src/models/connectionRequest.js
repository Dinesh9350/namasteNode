const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);

//compound index
//1 means Ascending, -1 means Descending
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//sending connection request to myself    Schema -> middleware
//connectionRequestSchema.save(), it'll be callled before this save
connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  //check if fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send Connection Request to Yourself!");
  }
});

const ConnectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequestModel;
