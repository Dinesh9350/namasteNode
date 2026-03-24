## Episode-10 - Authentication, JWT & Cookies ✅

- User -> Login(e,p) -> Server
- Server generates JWT token and sends back to the User(client)
- Now the Client will send that JWT token every Request headers to the server
- Basically it checks JWT is authenticated or not before every api call and server validates it

When the server is sending JWT token and sends it to Frontend, to be able to store it in Frontend, we use Cookies

Cookie

- When user logs in, the server sends Succesful response and along with it, it sends token inside cookie
- We can also set expiry of the cookie or token

Authentication Flow:-
Whenever a user is logging in, Sever will create a token attach it into a cookie and sends back.
Now that cookie will be store by the Browser and in any next request the cookie will be sent along with it.
When cookie will be sent along, we validate it once again and do anything what i want to do in the application.

//to send a cooke
res.cookie("token", "123456789");

```js
if (isPasswordValid) {
  //Create a JWT Token
  //add Token to Cookie and send the response to ther User
  res.cookie("token", "123456789");
  res.status(200).send("Login Successfully!");
} else {
  throw new Error("Invalid email or password");
}
```

Login using postman -> cookies there this cookie will be shown

+++++++++++++++++++++++++++++

/profile api
before profile api will be called, i want to validate my cookie
const cookie = req.cookies;

```js
app.get("/profile", (req, res) => {
  const cookie = req.cookies;
  console.log(cookie); //undefined
  res.send("Reading Cookie!");
});
```

logs gives (undefined) because it is not able to read, we need Middleware for that to Read Cookie
cookie-parser (middleware)

`npm i cookie-parser`

```js
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/profile", (req, res) => {
  //Reading Cookie!
  const cookie = req.cookies;
  console.log(cookie); //{ token: '123456789' }
  res.send("Reading Cookie!");
});
```

[Object: null prototype] {} after removing cookie from Postman and sending req again
Only after login then /profile is sending cookie back

Login injects the cookie into the client then client will get the cookie back

++++++++++++++++++++++++++++++++++++++

const { token } = cookies;
//Validate Token from coookie

JWT
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30

(Header).(Payload).(Signature) = JWT

for creating JWT Token
jsonwebtoke
`npm i jsonwebtoken`

jwt.sign()
jwt.verify()

Now we are generating a real Jwt

```js
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //Create a JWT Token
      //jwt.sign( hiding info , privateKey (password only server knows)
      //user id is hidden in this jwt token along with the password
      const token = await jwt.sign({ _id: user._id }, "dev@Tinder$444");
      console.log(token);

      //add Token to Cookie and send the response to ther User
      res.cookie("token", token);
      res.status(200).send("Login Successfully!");
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(400).send("Login Failed:" + error.message);
  }
});
```

//decodedMessage gives us the \_id in decoded form of the logged in user
//everytime jwt will create a new token in login
Profile will return the data of the user which is logged in

```js
app.get("/profile", async (req, res) => {
  try {
    //Reading Cookie!
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token!");
    }
    //Reading Cookies
    console.log("cookies", cookies);

    //Validate Token
    const decodedMessage = await jwt.verify(token, "dev@Tinder$444");
    console.log("decodedMessage: ", decodedMessage);

    const { _id } = decodedMessage;
    console.log("LoggedOn user id is: ", _id);

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!");
    }

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
```

++++++++++++++++++++++++++++++++++

jwt verification is now working well in /profile but not working in other rest api's
We have to add the authentication for other api's also
We will use Auth Middleware to check whether the user token is valid or not

Auth Middleware for JWT
middlewares > auth.js

```js
//auth.js
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const UserAuth = async (req, res, next) => {
  try {
    //Read the token from request cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    //Validate the token
    const decodedMessage = await jwt.verify(token, "dev@Tinder$444");
    const { _id } = decodedMessage;

    //Find the User
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    next();
  } catch (error) {
    res.status(400).send("Authentication Failed: ", error.message);
  }
};

module.exports = { UserAuth };
```

Apply the JWT Auth

```js
//app.js
const { UserAuth } = require("./middlewares/auth.js");
app.get("/profile", UserAuth, async (req, res) => {});
```

same for other Api's which requies JWT auth

//We are getting the logged in User in the Auth but to be able ton send it in /profile
request.user to attach user into the req

sent the user

```js
//auth.js
const UserAuth = async (req, res, next) => {
  req.user = user;
};
```

receieve the User

```js
//app.js
app.get("/profile", UserAuth, async (req, res) => {
  const user = req.user;
});
```

Now the JWT middleware is working fine and we can attach it in any api
++++++++++++++++++++++++++++++++++++++++

remove all unneccessary api's like:

//find user by email
app.get("/user")

//delete a user
app.delete("/user")

//update a user
app.patch("/user/:userId")

//get all users from DB
app.get("/feed")

signup, login, profile are left

++++++++++++++++++++++++++++++++++++++++

Creating API to sendConnectionRequest

To be able to send connection request we need 2 things;
from, to user id
from user id we can get from userAuth (jwt)

toUser we can get from params sendConnectionRequest/:toUserId and find that user

```js
//app.js
app.post("/sendConnectionRequest/:toUserId", UserAuth, async (req, res) => {
  //sending a connection request
  const user = req.user;
  const toUserId = req.params.toUserId;
  const toUser = await User.findById(toUserId);
  res.send(
    user.firstName +
      " " +
      user.lastName +
      " sent Connection Request to " +
      toUser.firstName +
      " " +
      toUser.lastName,
  );
});
```

We can also setExpiry time in the Jwt token,
similary we can expire the cookies also
Always expire you JWT Token

```js
//app.js
const token = await jwt.sign({ _id: user._id }, "dev@Tinder$444", {
  expiresIn: "1d",
});
res.cookie("token", token, {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
});
```

++++++++++++++++++++++++++++++++++++++++

Mongoose Schema Methods
Schema - userSchema
models/user.js

in schema we can attach helper methods that is applicable for all the user
we can offload generating JWT token to userSchema

```js
//user.js
const jwt = require("jsonwebtoken");

const userSchema = new Schema();
userSchema.methods.getJWT = async function () {
  const user = this;
  //Create a JWT Token
  const token = await jwt.sign({ _id: user._id }, "dev@Tinder$444", {
    expiresIn: "1d",
  });
  console.log("token: ", token);
  return token;
};
```

```js
//app.js
//inside login
const token = await user.getJWT();
```

Offloading Password Compare to Schema (Good Practice)

```js
//user.js
const bcrypt = require("bcrypt");

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  console.log("isPasswordValid: ", isPasswordValid);
  return isPasswordValid;
};
```

````js
//app.js
const isPasswordValid = await user.validatePassword(password);
```

++++++++++++++++++++++++++++++++++++++++

Good Practice:

1. Keep JWT creating in the Auth in /login
2. compare password can be offload to the Schema is a good practice
````
