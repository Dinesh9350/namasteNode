# Episode-05 - Middlewares & Error Handlers

# Multiple Route Handlers - Middlewares

# ⚡ Quick Revision (Very Important)

- (req, res, next) → Normal middleware flow
- (err, req, res, next) → Error middleware (runs only on error)
- next() → passes control to next handler
- res.send() → ends request (nothing runs after this)
- Order matters (top → bottom execution)
- app.use("/") → matches everything
- app.use("/path") → prefix match (/path/\*)
- app.get/post/delete → exact route + method
- Multiple handlers possible → must call next() or send response
- If no response sent → request hangs
- Error handling:
  - try-catch → handles locally
  - next(err) → goes to error middleware
- Error middleware must be at end
- Middleware used for:
  - Auth
  - Logging
  - Validation

```js
app.get(
  "/user",
  (req, res) => {
    res.send("1st Response");
  },
  (req, res) => {
    res.send("2nd Response");
  },
);
```

Output: 1st Response, because res.send ends here

++++++++++++++++++++++++++++++++++

```js
app.get(
  "/user",
  (req, res) => {
    // res.send("1st Response");
    next();
  },
  (req, res) => {
    res.send("2nd Response");
  },
);
```

//res will hang
Output:

++++++++++++++++++++++++++++++++++++++

## next() - go to next router handleer

```js
app.get(
  "/user",
  (req, res, next) => {
    // res.send("1st Response");
    next();
  },
  (req, res) => {
    res.send("2nd Response");
  },
);
```

Output: 2nd Response

++++++++++++++++++++++++++++++++++

```js
app.get(
  "/user",
  (req, res, next) => {
    res.send("1st Response");
    next();
  },
  (req, res) => {
    res.send("2nd Response");
  },
);
```

Output: 1st Response, error in terminal because after res.send next() will be called and
goes to 2nd route handler and try to do res.send and this sends error from terminal

++++++++++++++++++++++++++++++++++

```js
app.get(
  "/user",
  (req, res, next) => {
    next();
    res.send("1st Response");
  },
  (req, res) => {
    res.send("2nd Response");
  },
);
```

Output: 2st Response, error in terminal because next() sends it next route handler even before res.send("1st Response"),
once next() gets executed and it did res.send("2nd Response"), the code goes back where next() end and tries to execute
res.send("1st Response") which cannot happen because it can send only one

++++++++++++++++++++++++++++++++++

```js
app.get(
  "/user",
  (req, res, next) => {
    //res.send("1st Response");
    next();
  },
  (req, res, next) => {
    //res.send("2nd Response");
    next();
  },
);
```

Output: Cannot GET /user, it expects res in next route handler but there is no route handler


++++++++++++++++++++++++++++++++++


```js
app.get("/user", [
  (req, res, next) => {
    //res.send("1st Response");
    next();
  },
  (req, res, next) => {
    res.send("2nd Response");
  },
]);
```

```js
app.get(
  "/user",
  [
    (req, res, next) => {
      //res.send("1st Response");
      next();
    },
    (req, res, next) => {
      //res.send("2nd Response");
      next();
    },
  ],
  (req, res, next) => {
    res.send("3nd Response");
  },
);
```

Route handlers can be wrapped in an Array


++++++++++++++++++++++++++++++++++


```js
app.get("/user", (req, res, next) => {
  next();
});
app.get("/user", (req, res) => {
  res.send("2nd Response");
});
```

Output: 2nd Response


++++++++++++++++++++++++++++++++++


```js
app.get("/user", (req, res) => {
  res.send("2nd Response");
});
app.get("/user", (req, res, next) => {
  next();
});
```

Output: 2nd Response


++++++++++++++++++++++++++++++++++


```js
app.use("/", (req, res) => {
  res.send("Handling / route");
});
app.get("/user", (req, res) => {
  res.send("2nd Response");
});
app.get("/user", (req, res, next) => {
  next();
});
```

Output: Handling / route


++++++++++++++++++++++++++++++++++


```js
app.use("/", (req, res, next) => {
  //res.send("Handling / route");
  next();
});
app.get("/user", (req, res) => {
  res.send("2nd Response");
});
app.get("/user", (req, res, next) => {
  next();
});
```

Output: 2nd Response
next() - goes top to bottom in express server and tries to send the Response back
it check all the app.xxx("matching route") functions


++++++++++++++++++++++++++++++++++


## Route handlers are like Middleware

```js
//this is a Middleware
("/",
  (req, res, next) => {
    next();
  });
```

```js
//Request handlers send the res back and all the rest with next() are Middlewares
("/user",
  (req, res) => {
    res.send("2nd Response");
  });
```


++++++++++++++++++++++++++++++++++


## Response Statuses

200 - OK
401 - Unauthorized
404 - Not found
500 - Internal Server Error


++++++++++++++++++++++++++++++++++


## Middleware Use

```js
app.get("/admin/getAllData", (req, res) => {
  //checking if user is Authorized
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (isAuthorized) {
    res.send("All Data Sent!");
  } else {
    res.status(401).send("Unauthorized Request");
  }
});
```

//should i keep checking if the user is Authorized or not in every Api call ? here Middleware comes into picture


++++++++++++++++++++++++++++++++++


# Handle Auth Middleware for all requests GET, POST, PUT, DELETE

```js
app.use("/admin", (req, res, next) => {
  //checking if user is Authorized
  console.log("Admin Auth is getting checked");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized Request");
  } else {
    next();
  }
});
app.get("/admin/getAllData", (req, res) => {
  res.send("All Data Sent!");
});
app.get("/admin/deleteUser", (req, res) => {
  res.send("User deleted Successfully!");
});
```

/admin will run whenever /admin/\* will be called

src > middlewares > auth.js

```js
const adminAuth = (req, res, next) => {
  //checking if user is Authorized
  console.log("Admin Auth is getting checked");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized Request");
  } else {
    next();
  }
};

module.exports = { adminAuth };
```

app.js

```js
const { adminAuth } = require("./middleware/auth");
app.use("/admin", adminAuth);
```


++++++++++++++++++++++++++++++++++


//if we have only 1 api, we call also do this or in every api
app.js

```js
const { userAuth } = require("./middleware/auth");

app.get("/user", userAuth, (req, res) => {
  res.send("Get All users");
});
```

++++++++++++++++++++++++++++++++++


# Error Handling

Always use tryCatch

```js
app.use("/", (err, req, res, next) => {}); //gets called only when err comes
```

```js
//try catch
app.get("/getUserData", (req, res) => {
  //Logic of DB call and user data
  try {
    throw new Error("bgdsfsafjkl");
  } catch (error) {
    res.status(500).send("User name is Required!");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong!");
  }
});
```
