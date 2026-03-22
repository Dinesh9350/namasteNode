##S2E4 - Routing and Request Handlers

# ⚡ Quick Revision (Very Important)

- app.use("/path") → prefix match (/path/\*)
- app.use("/") → matches everything
- Order matters (top → bottom execution)
- app.get/post/delete → exact route + method
- URL hit in browser → default GET request
- Query params → req.query
- Dynamic routes → req.params
- Regex routes → flexible matching


++++++++++++++++++++++++++++++++++


#git

```id="a1b2c3"
git init
add .gitignore
push code in git
```

++++++++++++++++++++++++++++++++++


#Routes

```js
app.use("/about", (req, res) => {
  res.send("about route");
});
```

in browser, if i go to http://localhost:4000/about, it will give "about route",
in case of http://localhost:4000/xyz, Cannot GET /xyz
in case of http://localhost:4000/about/xyz, it will again give "about route",
in case of http://localhost:4000/about/xyz/123, it will again give "about route",

so. app.use will handle everything which comes after /about


++++++++++++++++++++++++++++++++++


#Order Matters

"/" at top everything will match "/". "/about", "products", everything...
❌ Wrong

```js
app.use("/", (req, res) => {
  res.send("Hello World");
});
app.use("/about", (req, res) => {
  res.send("about route");
});
```

✅ Correct Way
"/" at bottom, so "/about" routes will be checked first and in the end it matches "/"
Ex: top to buttom:- /about/blogs -> /about -> /

```js id="j1k2l3"
app.use("/about", (req, res) => {
  res.send("about route");
});
app.use("/", (req, res) => {
  res.send("Hello World");
});
```

++++++++++++++++++++++++++++++++++


#HTTP methods:- Get, Post, Put, Patch, Delete

in case of http://localhost:4000/xyz, Cannot GET /xyz
whenever we hit any route in url it hits GET method

👉 app.use() is better for:

- Middleware
- Prefix-based routing

API Testing
Postman
create workspace -> add http method -> test api

For making different methods of api's:-
app.get, app.post, app.delete, app.post


++++++++++++++++++++++++++++++++++


#Query Params

http://localhost:4000/user?userId=111&&password="testing"

```js id="m4n5o6"
app.get(/user, (req, res) => {
    console.log(req.query);
    //{ userId: '111', password: 'testing'}
});
```

++++++++++++++++++++++++++++++++++


#Dynamic Rotues

http://localhost:4000/user/777

```js id="p7q8r9"
app.get(/user/:userId/:name, (req, res) => {
    console.log(req.params);
    //{ userId: '777', name: 'Dinesh'}
});
```

++++++++++++++++++++++++++++++++++


#Matching routes - Regex (Not Important)

/a/ - /cat
if anywhere btw a will come

```js id="s1t2u3"
app.get(/a/, (req, res) => {
  res.send("Matched a! ");
});
```

/ab?c/
makes b optional (?) - /ac, /abc both will work

```js id="v4w5x6"
app.get(/ab?c/, (req, res) => {
  res.send("Matched!");
});
```

/ab+c/
add as many b as we like - /abbbbbbbc

```js id="y7z8a9"
app.get(/ab+c/, (req, res) => {
  res.send("Matched /ab+c/ ");
});
```

/ab\*cd/
can write anything in between - /abDineshcd

```js id="b1c2d3"
app.get(/ab*cd/, (req, res) => {
  res.send("Matched /ab*cd/ ");
});
```

#Grouping
/a(bc)?d/
bc are optional

```js id="e4f5g6"
app.get(/a(bc)?d/, (req, res) => {
  res.send("Matched /ab*cd/ ");
});
```

/a(bc)+d/
add bc - abcbcbcbcd

```js id="h7i8j9"
app.get(/a(bc)+d/, (req, res) => {
  res.send("Matched /ab*cd/ ");
});
```

/.\*fly$/ - butterfly
starts with anything, ends with fly

```js id="k1l2m3"
app.get(/.*fly$/, (req, res) => {
  res.send("End with fly ");
});
```

++++++++++++++++++++++++++++++++++