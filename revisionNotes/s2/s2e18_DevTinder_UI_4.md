## Episode-18 - DevTinder UI - Part 4 ✅

Feature: Accept/reject connections
- see all my connections

```js
//App.jsx
<Route path="/connections" element={<Connections />} />
```

```js
//Connections.jsx
show all connections in that and store in redux connectionsSlice
```
Accept , Reject requests
- see all my Requests -> accept, reject button functional

```js
//Requests.jsx
show all Requests in that and store in redux requestsSlice
```

========================

Accepted or Rejected user should be removed from Request Page
remove data of that specific user from redux
