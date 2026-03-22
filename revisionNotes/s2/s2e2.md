##S2E2 - Features, HLD, LLD & Planning

# ⚡ Quick Revision (Very Important)

- HLD → high level features
- LLD → detailed structure (models, APIs)
- User → basic info (name, email, password, etc.)
- Connection Request → from, to, status
- Status flow → Pending → (Ignored / Interested / Accepted / Rejected)
- Collections → User, Connection Request
- REST APIs → Get, Post, Put, Patch, Delete

++++++++++++++++++++++++++++++++++

#DevTinder

1. create and account
2. Login
3. update your profile
4. Feed page
5. Send Connection Request
6. see our matches
7. see the request we've sent/receieved

#User

1. FirstName
2. Lastname
3. Email id
4. Password
5. Age
6. Gender

#Connection Request

- from User id
- to User id
- status: PENDING

Status: Pending, Ignored, Interested Accepted, Rejected,
from:
Pending -> Ignored, Interested
to:
Pending -> Accepted, Rejected

#Collections:

1. User
2. Connection Request

#API Design:- (REST Api)
Get, Post, Put, Patch, Delete

Post /signup
Post /login
Get /profile
Post /profile
Patch /profile
Delete /profile
Post /sendRequest - Interested/ignore
Post /reviewRequest - accept/reject
Get /requests
Get /connections
