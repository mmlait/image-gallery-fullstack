

                              Image Gallery
                          _______________________


The backend is built using express. It provides JWT authentication and user management
as well as connection to the MongoDB database through the use of the mongoose library.

The front is a Bootstrap and jQuery project. Users can browse images after signing in.




                              Documentation
                          _______________________

The backend server is set to listen to port 2000 by default. The config.json file
in the root folder of the project may be used to alter this and the database URI.
The documentation includes the paths exposed by the backend for managing users
from a frontend application.

The following paths specify which actions are invoked by the backend:


Public:

POST    /api/users/register             |   register new user
POST    /api/users/authenticate         |   authenticate existing user


Requires login:

GET      /api/users/current              |   get current user details
GET      /api/users/readAll              |   get details of all users
GET      /api/users/read                 |   get details of a single user
PUT      /api/users/update               |   update details of a single user
DELETE   /api/users/remove               |   remove a single user



REGISTRATION EXAMPLE REQUEST
-------------------------------------

POST  localhost:2000/api/users/register

HEADER:
Content-type: application/json

BODY:
{
  "username": "Anna123",
  "password": "top-Secret",
  "firstName": "Anna",
  "lastName": "Andersson",
  "email": "anna@anna.com"
}



MONGOOSE SCHEMA
-------------------------------------
const schema = new Schema({
  username: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  email: { type: String, required: true },
  isAdmin: { type: String, required: true, default: false },
});
