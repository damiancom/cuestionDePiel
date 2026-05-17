# API Documentation

## 1. Authentication and User

### POST /api/auth/login
```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json
{
  "email": "string",
  "password": "string"
}

Response 200:
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "admin|user"
  }
}

Response 401:
{
  "error": "Invalid credentials"
}
```

### GET /api/auth/me
```http
GET /api/auth/me HTTP/1.1
Authorization: Bearer <token>

Response 200:
{
  "id": "string",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "role": "admin|user",
  "createdAt": "timestamp"
}
```

## 2. Patients

### GET /api/patients
```http
GET /api/patients HTTP/1.1
Authorization: Bearer <token>
Page: 1
Limit: 10
Search: string
Sort: field
Order: asc|desc

Response 200:
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "lastName": "string",
      "dni": "string",
      "birthDate": "date",
      "phone": "string",
      "email": "string",
      "address": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### POST /api/patients
```http
POST /api/patients HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "name": "string",
  "lastName": "string",
  "dni": "string",
  "birthDate": "date",
  "phone": "string",
  "email": "string",
  "address": "string",
  "photo": "string" // base64 o URL
}

Response 201:
{
  "id": "string",
  "name": "string",
  "lastName": "string",
  "dni": "string",
  "birthDate": "date",
  "phone": "string",
  "email": "string",
  "address": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### GET /api/patients/:id
```http
GET /api/patients/:id HTTP/1.1
Authorization: Bearer <token>

Response 200:
{
  "id": "string",
  "name": "string",
  "lastName": "string",
  "dni": "string",
  "birthDate": "date",
  "phone": "string",
  "email": "string",
  "address": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### PUT /api/patients/:id
```http
PUT /api/patients/:id HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "name": "string",
  "lastName": "string",
  "dni": "string",
  "birthDate": "date",
  "phone": "string",
  "email": "string",
  "address": "string",
  "photo": "string" // base64 o URL
}

Response 200:
{
  "id": "string",
  "name": "string",
  "lastName": "string",
  "dni": "string",
  "birthDate": "date",
  "phone": "string",
  "email": "string",
  "address": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### DELETE /api/patients/:id
```http
DELETE /api/patients/:id HTTP/1.1
Authorization: Bearer <token>
```

## 3. Patient Sessions

### GET /api/patients/:patientId/sessions
```http
GET /api/patients/:patientId/sessions HTTP/1.1
Authorization: Bearer <token>
Page: 1
Limit: 10

Response 200:
{
  "data": [
    {
      "id": "string",
      "patientId": "string",
      "date": "timestamp",
      "title": "string",
      "detail": "string",
      "treatment": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### POST /api/patients/:patientId/sessions
```http
POST /api/patients/:patientId/sessions HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "date": "timestamp",
  "title": "string",
  "detail": "string",
  "treatment": "string"
}

Response 201:
{
  "id": "string",
  "patientId": "string",
  "date": "timestamp",
  "title": "string",
  "detail": "string",
  "treatment": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### GET /api/patients/:patientId/sessions/:sessionId
```http
GET /api/patients/:patientId/sessions/:sessionId HTTP/1.1
Authorization: Bearer <token>

Response 200:
{
  "id": "string",
  "patientId": "string",
  "date": "timestamp",
  "title": "string",
  "detail": "string",
  "treatment": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### PUT /api/patients/:patientId/sessions/:sessionId
```http
PUT /api/patients/:patientId/sessions/:sessionId HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "date": "timestamp",
  "title": "string",
  "detail": "string",
  "treatment": "string"
}

Response 200:
{
  "id": "string",
  "patientId": "string",
  "date": "timestamp",
  "title": "string",
  "detail": "string",
  "treatment": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### DELETE /api/patients/:patientId/sessions/:sessionId
```http
DELETE /api/patients/:patientId/sessions/:sessionId HTTP/1.1
Authorization: Bearer <token>
```

## 4. Patient Observations

### GET /api/patients/:patientId/observations
```http
GET /api/patients/:patientId/observations HTTP/1.1
Authorization: Bearer <token>
Page: 1
Limit: 10

Response 200:
{
  "data": [
    {
      "id": "string",
      "patientId": "string",
      "date": "timestamp",
      "observation": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### POST /api/patients/:patientId/observations
```http
POST /api/patients/:patientId/observations HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "observation": "string",
  "date": "timestamp"
}

Response 201:
{
  "id": "string",
  "patientId": "string",
  "observation": "string",
  "date": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### GET /api/patients/:patientId/observations/:id
```http
GET /api/patients/:patientId/observations/:id HTTP/1.1
Authorization: Bearer <token>

Response 200:
{
  "id": "string",
  "patientId": "string",
  "observation": "string",
  "date": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### PUT /api/patients/:patientId/observations/:id
```http
PUT /api/patients/:patientId/observations/:id HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "observation": "string",
  "date": "timestamp"
}

Response 200:
{
  "id": "string",
  "patientId": "string",
  "observation": "string",
  "date": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### DELETE /api/patients/:patientId/observations/:id
```http
DELETE /api/patients/:patientId/observations/:id HTTP/1.1
Authorization: Bearer <token>
```

## 5. Patient Injuries

### GET /api/patients/:patientId/injuries
```http
GET /api/patients/:patientId/injuries HTTP/1.1
Authorization: Bearer <token>
Page: 1
Limit: 10

Response 200:
{
  "data": [
    {
      "id": "string",
      "patientId": "string",
      "date": "timestamp",
      "description": "string",
      "location": "string",
      "treatment": "string",
      "status": "active|resolved",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### POST /api/patients/:patientId/injuries
```http
POST /api/patients/:patientId/injuries HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "description": "string",
  "location": "string",
  "treatment": "string",
  "status": "active|resolved",
  "date": "timestamp"
}

Response 201:
{
  "id": "string",
  "patientId": "string",
  "description": "string",
  "location": "string",
  "treatment": "string",
  "status": "active|resolved",
  "date": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### GET /api/patients/:patientId/injuries/:id
```http
GET /api/patients/:patientId/injuries/:id HTTP/1.1
Authorization: Bearer <token>

Response 200:
{
  "id": "string",
  "patientId": "string",
  "description": "string",
  "location": "string",
  "treatment": "string",
  "status": "active|resolved",
  "date": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### PUT /api/patients/:patientId/injuries/:id
```http
PUT /api/patients/:patientId/injuries/:id HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "description": "string",
  "location": "string",
  "treatment": "string",
  "status": "active|resolved",
  "date": "timestamp"
}

Response 200:
{
  "id": "string",
  "patientId": "string",
  "description": "string",
  "location": "string",
  "treatment": "string",
  "status": "active|resolved",
  "date": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### DELETE /api/patients/:patientId/injuries/:id
```http
DELETE /api/patients/:patientId/injuries/:id HTTP/1.1
Authorization: Bearer <token>
```

## 6. Patient Treatments

### GET /api/patients/:patientId/treatments
```http
GET /api/patients/:patientId/treatments HTTP/1.1
Authorization: Bearer <token>
Page: 1
Limit: 10

Response 200:
{
  "data": [
    {
      "id": "string",
      "patientId": "string",
      "startDate": "timestamp",
      "endDate": "timestamp",
      "description": "string",
      "status": "active|completed|suspended",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### POST /api/patients/:patientId/treatments
```http
POST /api/patients/:patientId/treatments HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "description": "string",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "status": "active|completed|suspended"
}

Response 201:
{
  "id": "string",
  "patientId": "string",
  "description": "string",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "status": "active|completed|suspended",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### GET /api/patients/:patientId/treatments/:id
```http
GET /api/patients/:patientId/treatments/:id HTTP/1.1
Authorization: Bearer <token>

Response 200:
{
  "id": "string",
  "patientId": "string",
  "description": "string",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "status": "active|completed|suspended",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### PUT /api/patients/:patientId/treatments/:id
```http
PUT /api/patients/:patientId/treatments/:id HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "description": "string",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "status": "active|completed|suspended"
}

Response 200:
{
  "id": "string",
  "patientId": "string",
  "description": "string",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "status": "active|completed|suspended",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### DELETE /api/patients/:patientId/treatments/:id
```http
DELETE /api/patients/:patientId/treatments/:id HTTP/1.1
Authorization: Bearer <token>
```

## 7. Products

### GET /api/products
```http
GET /api/products HTTP/1.1
Authorization: Bearer <token>
Page: 1
Limit: 10
Search: string
Sort: field
Order: asc|desc

Response 200:
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "size": "string",
      "stock": number,
      "link": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### POST /api/products
```http
POST /api/products HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "name": "string",
  "size": "string",
  "stock": number,
  "link": "string"
}

Response 201:
{
  "id": "string",
  "name": "string",
  "size": "string",
  "stock": number,
  "link": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### GET /api/products/:id
```http
GET /api/products/:id HTTP/1.1
Authorization: Bearer <token>

Response 200:
{
  "id": "string",
  "name": "string",
  "size": "string",
  "stock": number,
  "link": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### PUT /api/products/:id
```http
PUT /api/products/:id HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "name": "string",
  "size": "string",
  "stock": number,
  "link": "string"
}

Response 200:
{
  "id": "string",
  "name": "string",
  "size": "string",
  "stock": number,
  "link": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### DELETE /api/products/:id
```http
DELETE /api/products/:id HTTP/1.1
Authorization: Bearer <token>
```

### PATCH /api/products/:id/stock
```http
PATCH /api/products/:id/stock HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "operation": "add|subtract",
  "quantity": number
}

Response 200:
{
  "id": "string",
  "name": "string",
  "size": "string",
  "stock": number,
  "link": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 8. Sales

### GET /api/sales
```http
GET /api/sales HTTP/1.1
Authorization: Bearer <token>
Month: number
Year: number
Search: string
Page: 1
Limit: 10

Response 200:
{
  "data": [
    {
      "id": "string",
      "number": number,
      "date": "timestamp",
      "products": [
        {
          "productId": "string",
          "name": "string",
          "quantity": number,
          "price": number
        }
      ],
      "total": number,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### POST /api/sales
```http
POST /api/sales HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "number": number,
  "date": "timestamp",
  "products": [
    {
      "productId": "string",
      "quantity": number
    }
  ]
}

Response 201:
{
  "id": "string",
  "number": number,
  "date": "timestamp",
  "products": [
    {
      "productId": "string",
      "name": "string",
      "quantity": number,
      "price": number
    }
  ],
  "total": number,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### GET /api/sales/:id
```http
GET /api/sales/:id HTTP/1.1
Authorization: Bearer <token>

Response 200:
{
  "id": "string",
  "number": number,
  "date": "timestamp",
  "products": [
    {
      "productId": "string",
      "name": "string",
      "quantity": number,
      "price": number
    }
  ],
  "total": number,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### PUT /api/sales/:id
```http
PUT /api/sales/:id HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "number": number,
  "date": "timestamp",
  "products": [
    {
      "productId": "string",
      "quantity": number
    }
  ]
}

Response 200:
{
  "id": "string",
  "number": number,
  "date": "timestamp",
  "products": [
    {
      "productId": "string",
      "name": "string",
      "quantity": number,
      "price": number
    }
  ],
  "total": number,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### DELETE /api/sales/:id
```http
DELETE /api/sales/:id HTTP/1.1
Authorization: Bearer <token>
```

### GET /api/sales/export
```http
GET /api/sales/export HTTP/1.1
Authorization: Bearer <token>
Month: number
Year: number

Response 200:
Content-Type: text/csv

# CSV Format:
N° Venta,Fecha,Productos,Valor
1001,2025-06-01,"Ácido Hialurónico (x2) | Vitamina C (x1)",15000
1002,2025-06-02,"Retinol (x3)",12000
```

## 9. Appointments

### GET /api/appointments
```http
GET /api/appointments HTTP/1.1
Authorization: Bearer <token>
Page: 1
Limit: 10
Date: timestamp
PatientId: string

Response 200:
{
  "data": [
    {
      "id": "string",
      "patientId": "string",
      "date": "timestamp",
      "time": "string",
      "status": "pending|confirmed|completed|cancelled",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### POST /api/appointments
```http
POST /api/appointments HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "patientId": "string",
  "date": "timestamp",
  "time": "string",
  "status": "pending|confirmed|completed|cancelled"
}

Response 201:
{
  "id": "string",
  "patientId": "string",
  "date": "timestamp",
  "time": "string",
  "status": "pending|confirmed|completed|cancelled",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### GET /api/appointments/:id
```http
GET /api/appointments/:id HTTP/1.1
Authorization: Bearer <token>

Response 200:
{
  "id": "string",
  "patientId": "string",
  "date": "timestamp",
  "time": "string",
  "status": "pending|confirmed|completed|cancelled",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### PUT /api/appointments/:id
```http
PUT /api/appointments/:id HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "date": "timestamp",
  "time": "string",
  "status": "pending|confirmed|completed|cancelled"
}

Response 200:
{
  "id": "string",
  "patientId": "string",
  "date": "timestamp",
  "time": "string",
  "status": "pending|confirmed|completed|cancelled",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### DELETE /api/appointments/:id
```http
DELETE /api/appointments/:id HTTP/1.1
Authorization: Bearer <token>
```

## 10. Home Support

### GET /api/patients/:patientId/home-support
```http
GET /api/patients/:patientId/home-support HTTP/1.1
Authorization: Bearer <token>
Page: 1
Limit: 10

Response 200:
{
  "data": [
    {
      "id": "string",
      "patientId": "string",
      "startDate": "timestamp",
      "endDate": "timestamp",
      "description": "string",
      "status": "active|completed|suspended",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "total": number,
  "page": number,
  "limit": number
}
```

### POST /api/patients/:patientId/home-support
```http
POST /api/patients/:patientId/home-support HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "description": "string",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "status": "active|completed|suspended"
}

Response 201:
{
  "id": "string",
  "patientId": "string",
  "description": "string",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "status": "active|completed|suspended",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### GET /api/patients/:patientId/home-support/:id
```http
GET /api/patients/:patientId/home-support/:id HTTP/1.1
Authorization: Bearer <token>

Response 200:
{
  "id": "string",
  "patientId": "string",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "description": "string",
  "status": "active|completed|suspended",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### PUT /api/patients/:patientId/home-support/:id
```http
PUT /api/patients/:patientId/home-support/:id HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json
{
  "startDate": "timestamp",
  "endDate": "timestamp",
  "description": "string",
  "status": "active|completed|suspended"
}

Response 200:
{
  "id": "string",
  "patientId": "string",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "description": "string",
  "status": "active|completed|suspended",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### DELETE /api/patients/:patientId/home-support/:id
```http
DELETE /api/patients/:patientId/home-support/:id HTTP/1.1
Authorization: Bearer <token>
```
