# Episode-06 - Scheduling Cron Jobs

Every morning at 8am there should be email should go to the user about the friend req which they have recieved in the last day

Backend
npm i node-cron

```js
// utils/cronjob.js
const cron = require("node-cron");
cron.schedule("* * * * * *", () => {
  console.log("Hello world" + new Date());
});
```

```js
// app.js
require("./utils/cronjob.js");
// this file will run and this cron will be scheduled
```

["* * * * * *"] run cron job every second
1st: seconds(optional), 2nd: minute, 3rd: hour, 4th: day of the month, 5th: month, 6th: day of the week
["* * * * * *"] - second (optional)
["* * * * *"] - minute
["* * * *"] - hour
["* * *"] - day (month)
["* *"] - month
["*"] - day (week)

```js
// utils/cronjob.js
const cron = require("node-cron");
//run at 8 am
cron.schedule("0 8 * * *", () => {
  console.log("Hello world" + new Date());
});
```

for doing today day -1 day or 10 days
npm i date-fns

```js
const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

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
        const res = await sendEmail.run(
          "New Friend Request Pending for: ",
          email,
        );
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
```

bee queue and bull npm packages to make bulk of sending email