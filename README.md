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
    **Content:** `[
        {
            "id": 1,
            "sales_number": "Sales Number",
            "invoice": "Invoice Number",
            "dollar_amount": "$23.00",
            "commission_percentage_fraction": "0.0900",
            "commission_amount": 24,
            "po_number": "PO number 243",
            "customer": "Customer 23",
            "territory": "Canada-RH",
            "vendor": "Vendor",
            "date_paid": null,
            "paid": false,
            "first_name": "John",
            "last_name": "Doe",
            "sales_person_id": 1
        }
    ]`
 
* **Error Response:**

  <_Most endpoints will have many ways they can fail. From unauthorized access, to wrongful parameters etc. All of those should be liste d here. It might seem repetitive, but it helps prevent assumptions from being made where they should be._>

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Unauthorized request" }`
  


