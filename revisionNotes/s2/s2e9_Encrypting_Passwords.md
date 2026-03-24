## Episode-09 - Encrypting Passwords ✅

when the user sign up
in the sign up api validation should be done

1. Validation
2. Encrypt Password
3. store User into DB

src -> utils -> validation.js

```js
//src/utils/validation.js
const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is inValid");
  } else if (validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }
};
module.exports = {
  validateSignUpData,
};
```

```js
//app.js
const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is inValid");
  } else if (validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }
};
module.exports = {
  validateSignUpData,
};
```

```js
//app.js
const { validateSignUpData } = require("./utils/validation.js");
app.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSignUpData(req);

    //better way of creating a instance only provide specific fields required rather than whole req.body
    const { firstName, lastName, email, password } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

  }
});
```

+++++++++++++++++++++++++++++++++++

#Encrypting Passwords

For Encrypting Password we are using bcrypt
`npm i bcrypt`

//Encryption of Password
//Password: Dinesh@123
//Salt: $2b$10$eImiTXuWVxfM37uY4JANjO
//hash: $2b$10$eImiTXuWVxfM37uY4JANjO4o9Wq42HlH.TqF0F6N4X0qRk9J6Y2C
//10 salts are safe

hash is created and save in DB

```js
//app.js
const brcypt = require("bcrypt");
//Encryption of Password
const passwordHash = await brcypt.hash(password, 10);
//while creating user
password: passwordHash,
```

++++++++++++++++++++++++++++++++++++++=

Login API

```js
//app.js
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.status(200).send("Login Successfully!");
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(400).send("Login Failed:" + error.message);
  }
});
```

++++++++++++++++++++++++++++++++++++++=