# Episode-05 - Keeping Our Credentials Safe Using dotenv Files

```js
//database.js
const mongoose = require("mongoose");
//connect to cluster
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dinesh:ustV3f0aw042V3HJ@cluster0.l8wsd6i.mongodb.net/DevTinder",
  );
};

module.exports = connectDB;
```

```js
//auth.js
const decodedMessage = await jwt.verify(token, "dev@Tinder$444");
```

i've uploaded this code to github and anyone can steal "mongodb+srv://dinesh:ustV3f0aw042V3HJ@cluster0.l8wsd6i.mongodb.net/DevTinder" and access ,my DB

npm i dotenv

```js
//app.js
require("dotenv").config();
```

```js
//.env
PORT = 4000;
DB_CONNECTION_SECRET =
  "mongodb+srv://dinesh:ustV3f0aw042V3HJ@cluster0.l8wsd6i.mongodb.net/DevTinder";
JWT_SECRET = "dev@Tinder$444";
```

update code based on env

Frontend

```js
//constants.js
export const BASE_URL =
  location.hostname === "localhost" ? "http://localhost:5173" : "/api";
```

for running on both server and local
check everything is working fine on local
add .env in gitIgnore
git push

===========================
Frontend deployment
ssh -i "devtinder-securekey.pem" ubuntu@ec2-3-238-131-227.compute-1.amazonaws.com
cd devTinderWeb
git pull
npm run build
sudo scp -r dist/\* /var/www/html/

===========================
Backend deployment
cd ../namasteNode
git pull
npm run build

remove "" from .env
npm i

pm2 restart "devtinder-backend"
will get error in the aws hosted app because there is no .env

sudo nano .env -> paste env