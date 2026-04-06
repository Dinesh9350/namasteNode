## Episode-16 - DevTinder UI - Part 2 ✅

create a login page

- Install axios
- CORS - install cors in backend => add middleware to with configurations: origin, credentials: true
- whenever making Api call so pass { withCredentials: true }
  install react-redux + redux toolkit
  configureStore => Provider => createSlice => add reducer to store
  add redux devtools in chrome
  Login and see if your data is coming properly in the store
  Navbar should update as soon as user logs in
  refactor our code to add constants file + create a components folder

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

# Cors Error

- Install axios
- CORS - install cors in backend => add middleware to with configurations: origin, credentials: true
- whenever making Api call so pass { withCredentials: true }

- create Login page
- make email and password states
- handleLogin on Login button and do a post api send data
- cors error will come because localhost:3000 cannot call to localhost:7000 in the brower because both has different origin,
  to resolve this in the backend we have to use express cors middleware
  ```js
  //app.js
  npm i cors
  const cors = require("cors");
  app.use(cors());
  ```
- sending user in response

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

# Cookies

- Cookies are getting set in Postman but doesnt get set in Chrome and Axios because if you're getting cookie from different origin, Chromes and Axios doesn't allow it to be set in the chrome
  Fix: whitelist that domain in cors
  ```js
  //app.js (Backend)
  app.use(
    cors({
      origin: "http://localhost:5173/", //frontend hosted url
      credentials: true,
    }),
  );
  ```
  ```js
  //login.js (Frontend)
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/login",
        {
          email: emailId,
          password,
        },
        { withCredentials: true },
      );
    } catch (error) {
      console.log("error: ", error);
    }
  };
  ```
  only after this cookie will set in the browser -> console (Applications)

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

# Redux

after getting user data from login api
we are storing user data to Redux Toolkit

- Install Redux-Toolkit - https://redux-toolkit.js.org/tutorials/quick-start
- create a Store

```js
//store.js
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
  },
});
export default store;
```

- provider to wrap store to the app

```js
//app.js
<Provider store={appStore}>app</Provider>
```

- create a slice

```js
//userSlice.js
import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: (state, action) => {
      return null;
    },
  },
});
export const { addUser, reducer } = userSlice.actions;
export default userSlice.reducer;
```

- add slice in the Store in the reducers

Extension : Redux DevTools to track

```js
//login.jsx
const dispatch = useDispatch();
dispatch(addUser(res.data));
```

```js
//navbar.jsx
const userData = useSelector((store) => store.user);
```

show user profile photo and name in the navbar, show only when there is a user
once user it logged in navigate it to "/" - feed page

```js
//login.jsx
const navigate = useNavigate();
//after login api call and user dispatched to store
navigate("/");
dispatch(addUser(res.data));
```

```js
<Route path="/" element={<Body />}>
  //feed page
  <Route path="/" element={<Feed />} />
</Route>
```


