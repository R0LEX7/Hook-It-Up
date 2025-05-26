# User Routes
| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| GET    | `/user/connections` | List of user's connections   |
| GET    | `/user/requests`    | Incoming connection requests |
| GET    | `/user/feed`        | Suggested profiles (feed)    |

______________________________________________________________________________

# Auth Routes
| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/auth/login`   | User login        |
| POST   | `/auth/sign_up` | User registration |
| POST   | `/auth/logout`  | Logout user       |

______________________________________________________________________________

# Profile
| Method | Endpoint            | Description         |
| ------ | ------------------- | ------------------- |
| GET    | `/profile/view`     | View user profile   |
| PATCH  | `/profile/edit`     | Edit profile info   |
| PATCH  | `/profile/password` | Change password     |
| DELETE | `/delete`           | Delete user account |

______________________________________________________________________________

# Connection Request
| Method | Endpoint                             | Description                 |
| ------ | ------------------------------------ | --------------------------- |
| POST   | `/connection/send/interest/:userId`  | Express interest in a user  |
| POST   | `/connection/send/ignored/:userId`   | Ignore a user               |
| POST   | `/connection/review/accepted/:reqId` | Accept a connection request |
| POST   | `/connection/review/rejected/:reqId` | Reject a connection request |
| GET    | `/connection/requests`               | View all pending requests   |
| GET    | `/connection/all_connections`        | Get all established matches |
