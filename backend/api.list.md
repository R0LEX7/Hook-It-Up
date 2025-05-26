# User Router

- GET: /user/connections
- GET: /user/requests
- GET: /user/feed

_______________________________________________________

# Auth

- POST: /auth/login
- POST: /auth/sign_up
- POST: /auth/logout

_______________________________________________________

# Profile

- GET: /profile/view
- PATCH: /profile/edit
- PATCH: /profile/password
_______________________________________________________

# Connection Request

- POST: /request/send/interest/:userId
- POST: /request/send/ignored/:userId
- POST: /request/review/accepted/:requestId
- POST: /request/review/rejected/:requestId
