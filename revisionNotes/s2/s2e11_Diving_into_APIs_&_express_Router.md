## Episode-11 - Diving into the APIs and express Router

go to Api list and see which Api we're going to create

Feed api gets 20,30 profiles at once instead
In Tinder if you Right swipe it calls like api, if you swipe left it calls pass api

Status: ignore, interested, accept, reject

In Sent Connection:-
Status: ignore, interested
Tinder calls Interest as Like and Ignore as Pass

In Connection Request:-
Status: accept, reject

Status: ignored, interested, accepeted, rejected

++++++++++++++++++++++++++++++++++++++

### Express Router

Instead of writing dozens of api in App.js, we should use express Router

## authRouter

- POST /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // Forgot password API

## connectionRequestRouter

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter

- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform

++++++++++++++++++++++++++++++++++++++

src > route > auth.js
src > route > profile.js
src > route > user.js
src > route > connectionRequest.js

app.get("/")
authrouter.get("/")
They both do the similar job

const app = express();
const router = express.Router()

app.use()
router.use()

//Everything works same as aap in Express Router, both are totally same

```js
//route/auth.js
const express = require("express");

const authRouter = express.Router();
//copy pasted whole api change app to authRouter
authRouter.post("/signup", async (req, res) => {});
authRouter.post("/login", async (req, res) => {});

module.exports = authRouter;
```

```js
//route/profile.js
const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile", UserAuth, async (req, res) => {});

module.exports = profileRouter;
```

//route/user.js
//route/request.js

same for rest routes

also take care of required dependencies in header of each routes
after that

```js
//app.js
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");

//For ex: someone goes to /profile then it goes to  check / means for all route, app.use("/", authRouter) it'll go inside authRouter and check whether that path is /signup or /login.
// if not then it comes out and executes next line app.use("/", profileRouter), here it finds /profile and do res.send so code stops executing
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
```

++++++++++++++++++++++++++++++++++++++

/logout api

```js
//routes/auth.js
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Sucessfully!");
});
```

++++++++++++++++++++++++++++++++++++++

/profile/edit api

```js
//app.js
profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    validateProfileEditData(req);

    const loggedInUser = req.user;
    //old way :-
    // const UpdatedUser = await User.findByIdAndUpdate(
    //   loggedInUser._id,
    //   req.body,
    //   {
    //     returnDocument: "after",
    //     runValidators: true,
    //   },
    // );

    //forEach - ilterates array, returns undefined
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} ${loggedInUser.lastName} profile Updated Successfully!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
```

```js
//utils/validation.js
const validateProfileEditData = (req) => {
  const { firstName, lastName, age, gender, photoUrl, skills, about } =
    req.body;
  if (firstName && typeof firstName !== "string") {
    throw new Error("First name is not Valid");
  } else if (lastName && typeof lastName !== "string") {
    throw new Error("Last name is not Valid");
  } else if (age && age < 18 && age > 80) {
    throw new Error("Age must be between 18 and 80");
  } else if (gender && !["male", "female"].includes(gender)) {
    throw new Error("Gender is not Valid");
  } else if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("PhotoUrl is not Valid");
  } else if (about && about.length > 100) {
    throw new Error("About, only 100 character are allowed");
  } else if (skills & (skills.length > 5)) {
    throw new Error("skills, only 5 skills are allowed");
  }

  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "photoUrl",
    "skills",
  ];
  //.every - return boolean
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );
  if (!isEditAllowed) {
    throw new Error("Invalid Update request!");
  }

  return isEditAllowed;
};
```

++++++++++++++++++++++++++++++++++++++

H.W
- PATCH /profile/password // Forgot password API
