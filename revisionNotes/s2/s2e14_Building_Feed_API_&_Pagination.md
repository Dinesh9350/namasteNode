Episode-14 - Building Feed API & Pagination ✅

GET /user/feed - Gets you the profiles of other users on platform

```js
//feed
//1. do now show my profile in feed
//2. do not show profile whom i already sent request of interested and ignored
//3. do not show profile whom i already accepted (have connection) and rejected

userRouter.get("/user/feed", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //finds all connection requests (sent + receieved)
    //select - to filter or send specific data
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //user who sent or receive req from/to me
    //new Set only store unique values
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((conn) => {
      hideUsersFromFeed.add(conn.fromUserId.toString());
      hideUsersFromFeed.add(conn.toUserId.toString());
    });

    console.log("hideUsersFromFeed: ", hideUsersFromFeed);
    const users = await User.find({
      //$nin - not in array (id should not be present in Array from hideUsersFromFeed)
      //$ne - not equal to
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA);

    res.send({
      message: "Data fetch successfully!",
      data: users,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
```

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

Pagination

/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)

skip = (page-1)*limit

