## Episode-13 - ref, Populate & Thought process of writing APIs ✅

// - POST /request/review/:status/:requestId
// - POST /request/review/accepted/:requestId
// - POST /request/review/rejected/:requestId

now here i can accept/reject the interested requests

```js
//routes/request.js
requestRouter.post(
  "/request/review/:status/:requestId",
  UserAuth,
  async (req, res) => {
    try {
      //sending a connection request
      const loggedInUser = req.user;
      const loggedInUserId = req.user._id;
      const status = req.params.status;
      const requestId = req.params.requestId;

      const allowedStatuses = ["accepted", "rejected"];

      if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid Status type: " + status);
      }

      const fromUser = await User.findById(requestId);
      if (!loggedInUser) {
        throw new Error("toUser not found");
      }
      if (!fromUser) {
        throw new Error("fromUserId not found");
      }

      //check if there is any existing connection request
      const interestedConnectionRequest = await ConnectionRequestModel.findOne({
        fromUserId: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });

      if (!interestedConnectionRequest) {
        throw new Error("Connection Request Not Found!");
      }

      interestedConnectionRequest.status = status;
      const data = await interestedConnectionRequest.save();

      res.json({
        message: `${loggedInUser.firstName} ${loggedInUser.lastName} ${status} ${fromUser.firstName} ${fromUser.lastName}`,
        data: data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  },
);
```

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

## userRouter

GET /user/requests/received
GET /user/connections
GET /user/feed - Gets you the profiles of other users on platform

```js
//user.js
// GET /user/requests/received

userRouter.get("/user/requests/reveieved", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const receievedId = req.params.receievedId;
    const incomingConnectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    });

    res.send({
      message: "Data fetch successfully!",
      data: incomingConnectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
```

//here i am getting id of the user who sent interested to my profile but we also need to know which user sent the connection aka name or other info of user who want to make a connection

Problem ?
currently i'm matching each request one by one that in toUser it's me and whihc is sent by ankit then i'll save it and similarly it'll check other requests one by one but it's a poor way of handling it

Soution ?
Building relationship btw two DB's
ref and populate
//ref = "User"
creating connection with userSchema

```js
//before
"data": [
{
  "_id": "69c4d68e96247b9b3646bd1f",
  "fromUserId": "69c4c29f30768406a9daacba",
  "toUserId": "69c17c275a87184cf0591b26",
  "status": "interested",
  "createdAt": "2026-03-26T06:47:42.243Z",
  "updatedAt": "2026-03-26T06:47:42.243Z",
  "__v": 0
  }
]
```

```js
// models/connectionRequest.js
fromUserId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
```

Now ref: "User", will refer to the User collection

```js
// routes/user.js
const incomingConnectionRequests = await ConnectionRequestModel.find({
  toUserId: loggedInUser._id,
  status: "interested",
}).populate("fromUserId", ["firstName", "lastName"]);
```

Because we are Referering to User collection, we can populate data from that already sorted data. Like from fromUserId (User), we can extract first and lastName from all that Users.

```js
//after
 "data": [
        {
            "_id": "69c4d68e96247b9b3646bd1f",
            "fromUserId": {
                "_id": "69c4c29f30768406a9daacba",
                "firstName": "Mark",
                "lastName": "Zukkerber"
            },
            "toUserId": "69c17c275a87184cf0591b26",
            "status": "interested",
            "createdAt": "2026-03-26T06:47:42.243Z",
            "updatedAt": "2026-03-26T06:47:42.243Z",
            "__v": 0
        }
  ]
```

```js
// routes/user.js
//similary
const incomingConnectionRequests = await ConnectionRequestModel.find({
toUserId: loggedInUser.\_id,
status: "interested",
}).populate("fromUserId", [ "firstName","lastName","photoUrl","age","gender","about", "skills",
]);

//better way to populate " "
const incomingConnectionRequests = await ConnectionRequestModel.find({
toUserId: loggedInUser.\_id,
status: "interested",
}).populate("fromUserId","firstName lastName photoUrl age gender about skills");
```

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

GET /user/connections
//accepted status
//it can either be the sender or receiever

```js
//models/connetionRequest.js
toUserId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
```

```js
//request accepted by user
//accepted status, it can either be the sender or receiever
userRouter.get("/user/connections", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((conn) => {
      //Important!
      // conn.fromUserId ===loggedInUser._id, will give err bc we cannot compare two mongodb id direactly ❌
      // conn.fromUserId.toString() ===loggedInUser._id.toString() ✅

      if (conn.fromUserId.equals(loggedInUser._id)) {
        return conn.toUserId;
      }
      return conn.fromUserId;
    });

    res.send({
      message: "Data fetch successfully!",
      data: data,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = userRouter;
```
