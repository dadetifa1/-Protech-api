# Protech-api
A backend express api server app to the Protech-app

## summary 

API server that manages sales data for the front end app (Protect-app)

## Live front end app

[Protech](https://protech-app.vercel.app/collection).

## Front Repo
[Git](https://github.com/dadetifa1/Protech-app).

## Screen Shots
Capture a sale:

![Landing Page](screen_shots/sales_entry.jpg)

Sales collection(s):

![sample results](screen_shots/sales_collections.jpg)

## Tech used 
NodeJS - Express - postgres - Git - Relationship DB

## API documentation

Posting - requests

* **URL**

  /api/postings

* **Method:**
  
  `GET`
* **Header:**
  Authorization
  
* **Success Response:**
  
  <_What should the status code be on success and is there any returned data? This is useful when people need to to know what their callbacks should expect!_>

  * **Code:** 200 <br />
    **Content:** `{ id : 12 }`
 
* **Error Response:**

  <_Most endpoints will have many ways they can fail. From unauthorized access, to wrongful parameters etc. All of those should be liste d here. It might seem repetitive, but it helps prevent assumptions from being made where they should be._>

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Log in" }`
  


