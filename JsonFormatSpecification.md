# JSON Format Specification

## JSON for Acount Login

### Request
```json
{
  "response_type": "account_login", 
  "username": "admin",
  "password": "12345678",
}
```

### Response

#### Success

```json
{
  "response_type": "account_login", 
  "username": "admin",
  "ok": true,
}
```

#### Failure

```json
{
  "response_type": "account_login",
  "username": "admin",
  "ok": false,
  "message": "Password Incorrect",
}
```

## JSON for Account Register

### Request

```json
{
  "request_type": "account_register",
  "username": "admin",
  "password": "12345678",
  "mail": "abcd@pku.edu.cn",
}
```
### Response

## JSON for Lab Information

### Request for Lab Information
```json
{
  "message": "lab",
  "labId": 123,
}
```

### Server Response 
```json
{
    "labId": 0,
    "labName": "Unified Theory and Artifical Intelligence Lab",
    "labOwner": "admin",
    "labSupervisors": [
      {
        "name": "Alan Turing",
        "title": "Professor",
        "email": "turing@404.org",
        "photoUrl":
          "https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg"
      },
      {
        "name": "Albert Einstein",
        "title": "Professor",
        "email": "einstein@404.org",
        "photoUrl":   "https://upload.wikimedia.org/wikipedia/commons/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg"
      }
    ],
    "infoString":
      "## About this Lab\n Unified Theory and Artifical Intelligence Lab is a lab that focuses on developing a unified theory for both the universe and human intelligence. \n## For Perspective Students\nWe are looking for perspective students who have passed away and will be in heaven since 2020. Applicants should meet the following requirements:\n1. Expertise in theortical physics, computational theory and algorithm design. \n2. Solid mathematical background and programming skills. \n3. Contiguous enthusiasm in research.\n"
}
```

### Request Editing Lab Information
```
​```json
{
    "labId": 0,
    "labName": "Unified Theory and Artifical Intelligence Lab",
    "labOwner": "admin",
    "labSupervisors": [
      {
        "name": "Alan Turing",
        "title": "Professor",
        "email": "turing@404.org",
        "photoUrl":
          "https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg"
      },
      {
        "name": "Albert Einstein",
        "title": "Professor",
        "email": "einstein@404.org",
        "photoUrl":
          "https://upload.wikimedia.org/wikipedia/commons/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg"
      }
    ],
    "infoString":
      "## About this Lab\n Unified Theory and Artifical Intelligence Lab is a lab that focuses on developing a unified theory for both the universe and human intelligence. \n## For Perspective Students\nWe are looking for perspective students who have passed away and will be in heaven since 2020. Applicants should meet the following requirements:\n1. Expertise in theortical physics, computational theory and algorithm design. \n2. Solid mathematical background and programming skills. \n3. Contiguous enthusiasm in research.\n"
}
```