Episode-08 - Data Sanitization & Schema Validations ✅

Validations
models > user.js

- firstName, email, password : required
  user cannot signup without filling this

```js
//user.js
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
```

+++++++++++++++++++++++++++++++

//for non duplication
unique: true

```js
//user.js
email: {
    type: String,
    required: true,
    unique: true
},
```

+++++++++++++++++++++++++++++++

//for taking multiple values as input
unique: true

```js
//user.js
skills: {
    type: [String],
  },
```

+++++++++++++++++++++++++++++++

//for providing default Value
unique: true

```js
//user.js
about: {
    type: String,
    default: "About Me",
},
```

+++++++++++++++++++++++++++++++

" dsdsd " remove empty spaces
trim: true

```js
email: {
  type: String,
  required: true,
  unique: true,
  trim: true
},
```

+++++++++++++++++++++++++++++++

//firstName, LastName
minLength: 4
maxLength: 50

//age
for number: min:18 , max:100

+++++++++++++++++++++++++++++++

Custom Validation function
validate

```js
 gender: {
    type: String,
    validate(value) {
      if (!["male", "female"].includes(value)) {
        throw new Error("Gender is not valid!");
      }
    },
  },
```

- by Default Validated will be only called when a new Document is created (imp)
- In Update, it'll not work and takes any value when Updating

to make it run on Update also,

- options: runValidators
- runValidators: true,

```js
const user = await User.findByIdAndUpdate(
  {
    _id: userId,
  },
  updatedData,
  {
    returnDocument: "after",
    runValidators: true,
  },
);
```

++++++++++++++++++++++++++++++++

To store when the user got create and last update we use timestamps

```js
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
```

it gives us created at and updated at

++++++++++++++++++++++++++++++++

In Update we can change email id for the users, to prevent it we can defined Allowed to Update fields

```js
//update a user

// Allowed to Update fields
const ALLOWED_UPDATES = ["_id", "photoUrl", "about", "skills"];
const isAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
if (!isAllowed) {
  console.log("data: ", data);
  throw new Error("Update not Allowed!");
}
```

id should not be allowed to update, so we will pass it through url get through params

```js
// http://localhost:4000/user/69c112cbc569b7e5f708984d
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
});
```

++++++++++++++++++++++++++++

in Update api, user can send 1,000 of skills so we should always sanitize the data which we are getting from user
Fix this H.W

++++++++++++++++++++++++++++

Dropping collection to delete data and start from new

- validate email is correct or not at signup - for this we can use Schema & DB level validation
- validator library

`npm i validator`

```js
//user.js

//email validation
email: {
  validate(value) {
    if (!validator.isEmail(value)) {
      throw new Error("Invalid email address !");
    }
  },
},

//photo URL validation
photoUrl: {
  validate(value) {
    if (!validator.isURL(value)) {
      throw new Error("Invalid Photo URL!");
    }
  },
},

//password Validation
password: {
  validate(value) {
    if (!validator.isStrongPassword(value)) {
      throw new Error("Please Enter a Strong Password!");
    }
  },
},

```
nerver trust req.body


