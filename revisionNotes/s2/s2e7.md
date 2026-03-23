## Episode-07 - Diving into the APIs

previously we were sending Static data to the Signup api,
we need to make it dyanamic
we can receive data from Postman Body -> raw -> (json)

so after sending json body from Postman to get data in api we use req
req.body -> undefined (i should have get the data but server is not able to read that json data)
To read json data in server, a middleware is required which can read json and convert it into js object

Express Json

app.use() will run for every route

```js
// app.js
//app.use - middleware, express.json() reads json
app.use(express.json());
//noew req.body will work in signup api, it gives us js object after reading json
console.log(req.body);
```

++++++++++++++++++++++++++++++++++++++++

get user by email
"/user"
//find user by email
find will return an array
it can give multiple users

```js
app.get("/user", async (req, res) => {
  console.log(req.body.email);
  const email = req.body.email;
  try {
    const users = await User.find({ email: email });
    if (users.length === 0) {
      res.status(404).send("User not found!");
    }
    res.send(users);
  } catch (error) {
    console.log("Error finding user: ", error.message);
  }
});
```

++++++++++++++++++++++++++++++++++

findOne to get only 1 user
if there are multiple then the oldest one

```js
const user = await User.findOne({ email: email });
if (!user) {
  res.status(404).send("User not found!");
}
res.send(users);
```

"/feed" api to get data of all the users from DB
find

```js
//get all users from DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong: ", error.message);
  }
});
```

++++++++++++++++++++++++++++++++++

//Delete a user
findByIdAndDelete

```js
//delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    if (!user) {
      res.status(404).send("No user found!");
    }
    res.send("Deleted User :" + user);
  } catch (error) {
    res.status(400).send("user id is not provided :" + error.message);
  }
});
```

++++++++++++++++++++++++++++++++++

//Update a user
findByIdAndDelete(id, upadteData, options)
options - {
//gives older version of document
returnDocument: "before"
//gives new version of document
returnDocument: "after"
}

```js
//update a user
app.patch("/user", async (req, res) => {
  const userId = req.body._id;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      data,
      {
        returnDocument: "after",
      },
    );
    console.log(user);
    if (!user) {
      res.status(404).send("No user found!");
    }
    res.send("User Updated Successfully :" + user);
  } catch (error) {
    res.status(400).send("user id is not provided :" + error.message);
  }
});
```
