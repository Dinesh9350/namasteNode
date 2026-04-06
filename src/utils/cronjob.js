const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
// const sendEmail = require("./sendEmail");

// Every morning at 8am there should be email should go to the user about the friend req which they have recieved in the last day
cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequestsOfYesterday = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    //converting back to array
    const listOfEmails = [
      ...new Set(pendingRequestsOfYesterday?.map((req) => req.toUserId.email)),
    ];

    for (let email of listOfEmails) {
      try {
        // const res = await sendEmail.run("New Friend Request Pending for: ", email);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});


