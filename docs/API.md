# API Documentation

## Authentication

All API endpoints require authentication using Bearer tokens:

```http
Authorization: Bearer <token>
```

## Endpoints

### Companies

#### Get All Companies
```http
GET /companies
```

Response:
```json
[
  {
    "id": "uuid",
    "name": "Company Name",
    "tax_id": "123456789",
    "status": "active",
    ...
  }
]
```

#### Create Company
```http
POST /companies
```

Request Body:
```json
{
  "name": "Company Name",
  "tax_id": "123456789",
  "address": "Company Address",
  "phone": "1234567890",
  "email": "company@example.com",
  "type": "headquarters",
  "industry": "Technology"
}
```

### Company Modules

#### Get Company Modules
```http
GET /companies/:companyId/modules
```

Response:
```json
[
  {
    "id": "uuid",
    "company_id": "company_uuid",
    "module_name": "billing",
    "is_enabled": true,
    "settings": {}
  }
]
```

### Company Metrics

#### Get Current Metrics
```http
GET /companies/:companyId/metrics/current
```

Response:
```json
{
  "id": "uuid",
  "company_id": "company_uuid",
  "monthly_revenue": 50000,
  "active_customers": 100,
  "total_orders": 500,
  "inventory_value": 75000
}
```

## Error Handling

API errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error