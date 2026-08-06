# API Specification

## Base URL

```
Development
http://localhost:8000/api/v1

---

# Authentication

Menggunakan JWT Bearer Token.

```
Authorization: Bearer <access_token>
```

---

# Standard Response

## Success

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

## Error

```json
{
  "success": false,
  "message": "Error",
  "errors": []
}
```

---

# Authentication

## Register

**POST**

```
/auth/register
```

### Access

Public

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "consumer"
}
```

---

## Login

**POST**

```
/auth/login
```

### Access

Public

### Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

# Jobs

## Create Job

**POST**

```
/jobs
```

### Access

Consumer

### Request

```json
{
  "title": "Bantu Angkat Galon",
  "description": "Butuh bantuan mengangkat 2 galon",
  "category_id": 1,
  "latitude": -6.2,
  "longitude": 106.8,
  "address": "Jl. Contoh",
  "reward_type": "fixed",
  "reward": 50000
}
```

---

## Get Jobs

**GET**

```
/jobs
```

### Access

Consumer, Partner

### Query

```
keyword
category
radius
lat
lng
```

---

## Get Job Detail

**GET**

```
/jobs/{id}
```

### Access

Consumer, Partner

---

## Accept Job

**POST**

```
/jobs/{id}/accept
```

### Access

Partner

---

## Update Job Status

**POST**

```
/jobs/{id}/status
```

### Access

Partner

### Request

```json
{
  "status": "ON_THE_WAY"
}
```

### Status

```
PUBLISHED
ACCEPTED
ON_THE_WAY
ARRIVED
WORKING
WAITING_CONFIRMATION
COMPLETED
```

---

# Payment

## Create Payment

**POST**

```
/payments
```

### Access

Consumer

### Request

```json
{
  "job_id": 1,
  "method": "midtrans"
}
```

---

# Business Rules

- Satu akun hanya memiliki satu role.
- Consumer hanya dapat membuat Job.
- Partner hanya dapat menerima Job.
- Satu Job hanya dapat diterima satu Partner.
- Job yang sudah diterima tidak dapat diterima Partner lain.
- Reward tidak dapat diubah setelah Job diterima.
- Hanya Consumer yang dapat melakukan pembayaran.
- Hanya Consumer yang dapat mengonfirmasi pekerjaan selesai.

---

# HTTP Status Code

| Code | Description |
|------|-------------|
|200|OK|
|201|Created|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|500|Internal Server Error|