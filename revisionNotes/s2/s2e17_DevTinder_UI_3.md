## Episode-17 - DevTinder UI - Part 3 ✅

- you should not be able to access other routes without login
- if token is not present, redirect user to login page
- logout
- profile
- login validation

========================

Token (Cookies)
Problem:
After log in and going to feed page if i refresh, user just get logout
i've Token, so i should stay logged in (still i am logging out)
if not logout

i've Token, so i should stay logged in, to achieve this
Basically after loggin in i am calling another api to get the Profile of the user which i'm setting it in the Redux

```js
//body.js
const dispatch = useDispatch();
const fetchUser = async () => {
  try {
    const res = await axios.get(BASE_URL + "/profile/view", {
      withCredentials: true,
    });
    //adding user to the store which is used all over the app
    dispatch(addUser(res.data));
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  fetchUser();
}, []);
```

so now user info will be showed in whole app

```js
//(backend)
// middleware/auth.js
if (!token) {
  res.status(401).send("Please Login...");
}
```

```js
//body.js
const userData = useSelector((store) => store.user);
const fetchUser = async () => {
  //if there is user in redux, do not make api call => savig api calls on switching to different pages
  if (userData) return;
  try {
    const res = await axios.get(BASE_URL + "/profile/view", {
      withCredentials: true,
    });
    dispatch(addUser(res.data));
  } catch (error) {
    //if there is not token go back to login
    //401 means Unauthorized
    if (error.status === 401) {
      navigate("/login");
    }
    console.log(error);
  }
};
useEffect(() => {
  if (!user) {
    fetchUser();
  }
}, []);
```

========================

Logout

```js
//navbar..jsx
const handleLogOut = async () => {
  try {
    const res = await axios.post(
      BASE_URL + "/logout",
      {},
      { withCredentials: true },
    );
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
```

it clear out token but my app still doest gets logout without refresh because data stays in the Redux, so clear it before logout

```js
//navbar.jsx
const handleLogOut = async () => {
  try {
    axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    dispatch(removeUser());
    naviagte("/login");
  } catch (error) {
    console.log(error);
  }
};
```

========================

login validation
show err caught -> error.response

========================

feed
fetch feed and store in redux
build user card on the feed

Edit Profile
editprofile card


```js
// Error: Cannot read properties of undefined (reading 'length') why this is coming hwo to fix
// (backend validateProfileEditData)
else if (skills && Array.isArray(skills) && skills.length > 5) {
  throw new Error("skills, only 5 skills are allowed");
}
```


show toast on profile update 
