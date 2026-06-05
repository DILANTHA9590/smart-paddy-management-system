# API DOCUMENTATION

## Base URL

```text
/api/v1
```

---

# USER MODULE

## Entity

```text
id:string(unique)
firstName:string
lastName:string
userName:string(unique)
email:string(unique)
isVerified:boolean
password:string
userStatus:(enum:Pending,Active,Blocked)
tokenVersion:number
salt:string
assignRoleBy:string(FK -> User, nullable)
created_at:timestamp
updated_at:timestamp
```

### Relations

```text
User and Role      M:1
User and User      M:1 (assignRoleBy)
```

### Endpoints

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| POST   | /api/v1/user/register          | Register a new user             |
| POST   | /api/v1/auth/login             | Authenticate user               |
| POST   | /api/v1/auth/refresh-token     | Refresh access token            |
| POST   | /api/v1/verify/verify-otp      | Verify email using OTP          |
| GET    | /api/v1/user/all               | Retrieve all users              |
| GET    | /api/v1/user/:id               | Retrieve user by ID             |
| PATCH  | /api/v1/user/update/:id        | Update user                     |
| DELETE | /api/v1/user/delete/:id        | Delete user                     |
| DELETE | /api/v1/user/bulk-delete       | Delete multiple users           |
| PATCH  | /api/v1/user/assign-role       | Assign role to user             |
| PATCH  | /api/v1/user/status/:id        | Update user status              |
| POST   | /api/v1/user/revoke-tokens/:id | Revoke user tokens              |
| GET    | /api/v1/user/report/pdf        | Generate users PDF report       |
| GET    | /api/v1/user/:id/report/pdf    | Generate single user PDF report |

---

# ROLE MODULE

## Entity

```text
id:string(unique)
roleName:string(unique)
description:string(nullable)
created_at:timestamp
updated_at:timestamp
```

### Relations

```text
Role and User          1:M
Role and Permission    M:M
```

### Endpoints

| Method | Endpoint                         | Description               |
| ------ | -------------------------------- | ------------------------- |
| POST   | /api/v1/roles                    | Create role               |
| GET    | /api/v1/roles                    | Retrieve all roles        |
| GET    | /api/v1/roles/:id                | Retrieve role by ID       |
| PATCH  | /api/v1/roles/:id                | Update role               |
| DELETE | /api/v1/roles/:id                | Delete role               |
| DELETE | /api/v1/roles/bulk-delete        | Delete multiple roles     |
| PATCH  | /api/v1/roles/assign-permissions | Assign permissions        |
| GET    | /api/v1/roles/:id/permissions    | Get role permissions      |
| GET    | /api/v1/roles/report/pdf         | Generate roles PDF report |

---

# PERMISSION MODULE

## Entity

```text
id:string(unique)
permissionName:string(unique)
description:string(nullable)
created_at:timestamp
updated_at:timestamp
```

### Relations

```text
Permission and Role    M:M
```

### Endpoints

| Method | Endpoint                        | Description                     |
| ------ | ------------------------------- | ------------------------------- |
| POST   | /api/v1/permissions             | Create permission               |
| GET    | /api/v1/permissions             | Retrieve all permissions        |
| GET    | /api/v1/permissions/:id         | Retrieve permission by ID       |
| PATCH  | /api/v1/permissions/:id         | Update permission               |
| DELETE | /api/v1/permissions/:id         | Delete permission               |
| DELETE | /api/v1/permissions/bulk-delete | Delete multiple permissions     |
| GET    | /api/v1/permissions/report/pdf  | Generate permissions PDF report |

---

# FARMER MODULE

## Entity

```text
id:string(unique)
user_id:string(FK -> User)
nic:string(unique)
phoneNumber:string(unique)
address:string
district:string
province:string
village:string
dateOfBirth:date
gender:(enum:Male,Female,Other)
profileImage:string(nullable)
organization_id:string(FK -> Organization, nullable)
created_at:timestamp
updated_at:timestamp
```

### Relations

```text
Farmer and User            1:1
Farmer and Organization    M:1 (Optional)
```

### Endpoints

| Method | Endpoint                       | Description                       |
| ------ | ------------------------------ | --------------------------------- |
| POST   | /api/v1/farmers                | Create farmer                     |
| GET    | /api/v1/farmers                | Retrieve all farmers              |
| GET    | /api/v1/farmers/:id            | Retrieve farmer by ID             |
| PATCH  | /api/v1/farmers/:id            | Update farmer                     |
| DELETE | /api/v1/farmers/:id            | Delete farmer                     |
| DELETE | /api/v1/farmers/bulk-delete    | Delete multiple farmers           |
| GET    | /api/v1/farmers/report/pdf     | Generate farmers PDF report       |
| GET    | /api/v1/farmers/:id/report/pdf | Generate single farmer PDF report |
| GET    | /api/v1/farmers/search         | Search farmers                    |
| GET    | /api/v1/farmers/filter         | Filter farmers                    |

```
```
