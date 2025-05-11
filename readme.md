# Census Application – Server Deployment Course Assignment

Course: Backend Development – Server Deployment

## 📌 Project Description

This application is a backend API built using Node.js and Express.js, developed as a course assignment for the Server Deployment module. It allows for the secure registration, retrieval, updating, and deletion of participants in a fictional census system.  
<br/>The application uses a MySQL database hosted on Aiven and is deployed live using Render. All data is handled securely, with sensitive configurations managed via environment variables.

## 🛠 Technologies Used

\- Node.js

\- Express.js

\- MySQL (Aiven)

\- Render (for live deployment)

\- dotenv (for environment variable management)

\- Validator (for input validation)

\- Postman (for API testing)

## 🚀 Deployment

The application is deployed and live on Render:

👉 Live URL: https://census-backend-vdhz.onrender.com

## 🔐 Authentication

All API endpoints are protected using Basic Authentication.  
\- Username: admin  
\- Password: P4ssword  
<br/>In Postman, this can be set under the Authorization tab using Basic Auth.

## 📡 API Endpoints

Base URL: https://census-backend-vdhz.onrender.com/participants

**POST** https://census-backend-vdhz.onrender.com/participants/add  
Adds a new participant. Requires a JSON body with:

```json
{
  "email": "freddie.mercury@queen.com",
  "firstname": "Freddie",
  "lastname": "Mercury",
  "dob": "1946-09-05",
  "work": {
    "companyname": "Queen Records",
    "salary": 150000,
    "currency": "GBP"
  },
  "home": {
    "country": "UK",
    "city": "Zanzibar"
  }
}

```
**GET** https://census-backend-vdhz.onrender.com/participants  
Returns all participants.

**GET** https://census-backend-vdhz.onrender.com/participants/details  
Returns only the firstname, lastname, and email of all participants.

**GET** https://census-backend-vdhz.onrender.com/participants/details/:email  
Example: https://census-backend-vdhz.onrender.com/participants/details/freddie.mercury@queen.com  
Returns the details of a specific participant by email.

**GET** https://census-backend-vdhz.onrender.com/participants/work/:email  
Examle: https://census-backend-vdhz.onrender.com/participants/work/freddie.mercury@queen.com  
Returns work details for a participant.

**GET** https://census-backend-vdhz.onrender.com/participants/home/:email  
Example: https://census-backend-vdhz.onrender.com/participants/home/freddie.mercury@queen.com  
Returns home details for a participant.  

**PUT** https://census-backend-vdhz.onrender.com/participants/:email  
Example: https://census-backend-vdhz.onrender.com/participants/freddie.mercury@queen.com  
Updates a participant’s full data.  
Requires a full JSON body in the same format as used in the POST endpoint.  

**DELETE** https://census-backend-vdhz.onrender.com/participants/:email  
Example: https://census-backend-vdhz.onrender.com/participants/freddie.mercury@queen.com  
Deletes a participant by their email.  

## ✅ Input Validation

\- All fields are required.  
\- Email must be in valid format.  
\- DOB must be in YYYY-MM-DD format.

## 💾 Environment Variables (.env)

PORT=3000  
DB_HOST=<your-database-host>  
DB_PORT=<your-database-port>  
DB_NAME=<your-database-name>  
DB_USER=<your-database-username>  
DB_PASSWORD=<your-database-password>  

ADMIN_USERNAME=admin  
ADMIN_PASSWORD=P4ssword  


## 📎 How to Run Locally

1\. Clone the repository.  
2\. Run \`npm install\`.  
3\. Create a \`.env\` file with the correct database credentials.  
4\. Run \`node app.js\` or \`npm start\`.
