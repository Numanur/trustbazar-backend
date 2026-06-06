# TrustBazar Backend API

TrustBazar Backend is a Node.js and Express-based API server for product authentication, barcode-based verification, product management, image upload, and mobile/web verification support.

This backend powers the TrustBazar web frontend and Flutter mobile app. It manages product records, generates barcode data, stores product information in MongoDB, uploads product images to Cloudinary, and verifies scanned product serial numbers.

---

## Overview

TrustBazar is designed to help users verify whether a product is original, registered, and trusted.

The backend provides APIs for:

- Adding new products
- Uploading product images
- Generating and storing barcode information
- Fetching product records
- Updating product selling status
- Verifying products from the web app
- Verifying products from the Flutter mobile app
- Checking backend and database health

---

## Core Workflow

```text
Admin adds product
→ Backend stores product record in MongoDB
→ Backend generates barcode from serial number
→ Product image is uploaded to Cloudinary
→ Consumer scans barcode
→ Backend checks serial number in database
→ API returns verified or not verified result
```

---

## Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| Runtime            | Node.js                             |
| Framework          | Express.js                          |
| Database           | MongoDB Atlas                       |
| ODM                | Mongoose                            |
| Image Storage      | Cloudinary                          |
| File Upload        | Multer                              |
| Barcode Generation | bwip-js                             |
| API Client Support | Web frontend and Flutter mobile app |
| Deployment         | Render                              |

---

## Project Structure

```text
trustbazar-backend/
├── config/
│   ├── dbConn.js
│   └── cloudinary.js
│
├── controllers/
│   ├── productController.js
│   └── mobileProductController.js
│
├── models/
│   └── BlockchainProduct.js
│
├── routers/
│   ├── productRoute.js
│   └── mobileProductRoute.js
│
├── utils/
│   └── barcodeGenerator.js
│
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Main Features

- Product registration API
- Product image upload through Cloudinary
- Product barcode generation
- Product authenticity verification
- Web verification API
- Mobile verification API
- Product selling status update
- Product status undo support
- Product deletion API
- Empty database response handling
- Backend health check API
- MongoDB connection guard
- Structured API response codes

---

## Environment Variables

Create a `.env` file in the backend root directory.

```env
PORT=5000

MONGODB_URL=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Example structure:

```env
PORT=5000
MONGODB_URL=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Do not commit `.env` to GitHub.

Recommended `.gitignore`:

```gitignore
node_modules
.env
```

---

## Installation

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm start
```

For development with automatic restart, install and use `nodemon` if needed:

```bash
npm install --save-dev nodemon
```

---

## Server Health Check

The backend provides a health check endpoint:

```http
GET /api/health
```

Expected response when backend and database are ready:

```json
{
  "success": true,
  "code": "BACKEND_READY"
}
```

If the database is disconnected:

```json
{
  "success": false,
  "code": "DATABASE_DISCONNECTED"
}
```

---

## API Base URL

Local backend:

```text
http://localhost:5000/api
```

Production backend:

```text
https://trustbazar-backend.onrender.com/api
```

---

## Product APIs

### Get All Products

```http
GET /api/products/all
```

Successful response:

```json
{
  "success": true,
  "code": "PRODUCTS_FOUND",
  "isEmpty": false,
  "message": "Products fetched successfully.",
  "count": 1,
  "products": []
}
```

Empty database response:

```json
{
  "success": true,
  "code": "EMPTY_PRODUCTS",
  "isEmpty": true,
  "message": "No products are available in the database.",
  "count": 0,
  "products": []
}
```

---

### Create Product

```http
POST /api/products/create
```

Request body:

```json
{
  "productName": "Product Name",
  "description": "Product description",
  "category": "Product category",
  "brand": "Product brand",
  "price": "Product price",
  "weight": "Product weight",
  "origin": "Product origin",
  "productImg": "Cloudinary image URL",
  "serialNumber": "Unique serial number",
  "manufacturingDate": "01/01/2026",
  "expirationDate": "01/01/2027"
}
```

The backend stores product information and generates barcode data from the provided serial number.

---

### Upload Product Image

```http
POST /api/products/upload-image
```

Request type:

```text
multipart/form-data
```

Form field:

```text
image
```

Successful response:

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/...",
  "publicId": "trustbazar/products/..."
}
```

Image upload flow:

```text
Frontend selects image
→ Sends image to backend
→ Backend uploads image to Cloudinary
→ Cloudinary returns image URL
→ Backend sends image URL to frontend
→ Frontend saves product using productImg URL
```

---

### Get Single Product

```http
GET /api/products/single/:serialNumber
```

Example:

```http
GET /api/products/single/TBZ-001
```

The backend searches the product by:

```text
tracking.serialNumber
```

---

### Verify Product for Web App

```http
POST /api/products/verify
```

Request body:

```json
{
  "serialNumber": "SCANNED_BARCODE_VALUE"
}
```

Verified response:

```json
{
  "success": true,
  "code": "PRODUCT_VERIFIED",
  "product": {}
}
```

Not verified response:

```json
{
  "success": false,
  "code": "PRODUCT_NOT_VERIFIED"
}
```

Missing serial response:

```json
{
  "success": false,
  "code": "SERIAL_REQUIRED"
}
```

The frontend controls the visible success or error banner based on the returned code.

---

### Update Product Selling Status

```http
PUT /api/products/:serialNumber
```

Example:

```http
PUT /api/products/TBZ-001
```

This endpoint updates the product selling status, usually from `available` to `sold`.

---

### Undo Product Selling Status

```http
PUT /api/products/undo/:serialNumber
```

Example:

```http
PUT /api/products/undo/TBZ-001
```

This endpoint can restore the product selling status if needed.

---

### Delete Product

```http
DELETE /api/products/:serialNumber
```

Example:

```http
DELETE /api/products/TBZ-001
```

Deletes a product using its serial number.

---

## Mobile App API

The backend provides a separate lightweight endpoint for the Flutter mobile app.

### Verify Product for Mobile App

```http
POST /api/mobile/products/verify
```

Request body:

```json
{
  "serialNumber": "SCANNED_BARCODE_VALUE"
}
```

Verified product response:

```json
{
  "success": true,
  "verified": true,
  "code": "PRODUCT_VERIFIED",
  "product": {
    "id": "PRODUCT_ID",
    "productName": "Product Name",
    "description": "Product Description",
    "category": "Product Category",
    "brand": "Product Brand",
    "price": "Product Price",
    "weight": "Product Weight",
    "origin": "Product Origin",
    "productImg": "Product Image URL",
    "manufacturingDate": "Manufacturing Date",
    "expirationDate": "Expiration Date",
    "serialNumber": "Product Serial Number",
    "sellStatus": "available",
    "createdAt": "Timestamp",
    "updatedAt": "Timestamp"
  }
}
```

Product not verified response:

```json
{
  "success": true,
  "verified": false,
  "code": "PRODUCT_NOT_VERIFIED"
}
```

Missing serial number response:

```json
{
  "success": false,
  "verified": false,
  "code": "SERIAL_REQUIRED"
}
```

The mobile endpoint returns a cleaner and lighter response for Flutter app usage.

---

## Product Data Model

The product document follows this conceptual structure:

```json
{
  "basicDetails": {
    "productName": "Product Name",
    "description": "Product Description",
    "category": "Product Category",
    "brand": "Product Brand",
    "price": "Product Price",
    "weight": "Product Weight",
    "origin": "Product Origin",
    "productImg": "Cloudinary Image URL"
  },
  "expiration": {
    "manufacturingDate": "Manufacturing Date",
    "expirationDate": "Expiration Date"
  },
  "tracking": {
    "barcode": "Base64 barcode image",
    "serialNumber": "Unique serial number"
  },
  "sellStatus": "available"
}
```

---

## Barcode Handling

The backend generates barcode data from the product serial number.

Barcode storage logic:

```text
Serial number
→ Barcode image generated
→ Barcode converted to Base64
→ Base64 barcode stored in MongoDB
```

The barcode image is stored inside the product document under:

```text
tracking.barcode
```

The value encoded inside the barcode is stored under:

```text
tracking.serialNumber
```

Verification is performed using the serial number, not the barcode image itself.

---

## Cloudinary Image Storage

Product images are not stored directly in MongoDB.

Instead:

```text
Image file
→ Uploaded to Cloudinary
→ Cloudinary returns secure image URL
→ MongoDB stores the image URL
```

MongoDB stores the Cloudinary URL under:

```text
basicDetails.productImg
```

This keeps the database lightweight and improves image delivery performance.

---

## Response Codes

| Code                    | Meaning                                               |
| ----------------------- | ----------------------------------------------------- |
| `BACKEND_READY`         | Backend and database are available                    |
| `DATABASE_DISCONNECTED` | MongoDB connection is not active                      |
| `PRODUCTS_FOUND`        | Product list returned successfully                    |
| `EMPTY_PRODUCTS`        | No products exist in the database                     |
| `PRODUCT_VERIFIED`      | Barcode or serial number matched a registered product |
| `PRODUCT_NOT_VERIFIED`  | Barcode or serial number did not match any product    |
| `SERIAL_REQUIRED`       | Serial number was not provided                        |

---

## Error Handling

The backend uses centralized error handling for API errors.

Common failure cases:

| Situation                     | Expected Handling                  |
| ----------------------------- | ---------------------------------- |
| MongoDB unavailable           | Server stops or health check fails |
| Missing environment variable  | Server startup fails               |
| Invalid product serial number | Returns `PRODUCT_NOT_VERIFIED`     |
| Empty database                | Returns `EMPTY_PRODUCTS`           |
| Missing image file            | Returns image upload error         |
| Cloudinary upload failure     | Returns upload error               |
| Server route not found        | Returns `Route not found`          |

---

## Deployment

The backend is designed to be deployed on Render.

Required Render environment variables:

```env
MONGODB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Render start command:

```bash
npm start
```

After deployment, test:

```http
GET https://trustbazar-backend.onrender.com/api/health
```

---

## Security Notes

- Do not expose MongoDB credentials in frontend or mobile app.
- Do not expose Cloudinary API secret in frontend or mobile app.
- Store all secrets in backend environment variables.
- Do not commit `.env` to GitHub.
- Product verification must be performed server-side.
- Image upload should be routed through backend.
- Admin-side routes should be protected with authentication in production.
- Rotate credentials if they are exposed in public logs or shared locations.

---

## Current Scope

The current backend supports:

- Product creation
- Product listing
- Product details fetching
- Product image upload
- Barcode generation
- Barcode-based product verification
- Mobile app product verification
- Product selling status update
- Product deletion
- Backend health check
- Empty database handling

---

## Future Improvements

- Admin authentication
- Role-based access control
- JWT-based protected admin routes
- QR code support
- Product verification history
- Fake product report endpoint
- Blockchain smart contract integration
- Blockchain transaction hash storage
- Product recall and safety alert system
- Pagination and search support
- Request rate limiting
- API documentation with Swagger or Postman collection
- Automated tests

---

## License

This project is developed for academic and prototype purposes. Update this section with the appropriate license before public release.

---

## Author

TrustBazar Product Authentication System
Backend API Server
