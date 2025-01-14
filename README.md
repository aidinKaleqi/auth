<div dir="rtl">

# سرویس احراز هویت

این سرویس احراز هویت (Auth) با استفاده از فریمورک NestJS توسعه یافته است. این سرویس شامل قابلیت‌های ثبت‌نام، ورود به سیستم و اعتبار سنجی ورود است.

## پیش‌نیازها

برای راه‌اندازی این سرویس، باید موارد زیر نصب شده باشند:
- [Node.js](https://nodejs.org/)
- [NestJS CLI](https://nestjs.com/)

## نصب

1. مخزن پروژه را کلون کنید:
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```
2. وابستگی‌ها را نصب کنید:

```bash
npm install
```
## راه‌اندازی
برای اجرا میتوانید با توجه به محیط مورد نظر هر یک دستورات زیر را اجرا کنید: 
```bash
npm run start
npm run start:dev
npm run start:debug
npm run start:prod
```
## API‌ها

<details>
<summary>ثبت ‌نام</summary>
این API برای ثبت نام یک کاربر جدید استفاده می شود.
<br>

<div dir="ltr">

###  API URL
```
URL: api/auth/signup
Method: POST
```
### Request Body
</div>
تعریف ورودی درخواست بصورت صحیح زیر بایستی انجام شود:

<div dir="ltr">

``` json
{
   "fullName": "string",
   "username": "string",
   "password": "string"
}
```
### Response
</div>

خروجی بصورت های زیر می باشد: 

در حالت صحیح
<div dir="ltr">

```json
{
   "data": {
      "message": "string",
      "status": "string"
   },
   "meta": {
      "requestId": "string"
   }
}
```
</div>

در حالت خطا

<div dir="ltr">

```json
{
   "data": {
      "message": "string",
      "path": "string",
      "statusCode": "integer"
   },
   "meta": {
      "requestId": "string"
   }
}
```
### Example

```js
// input
{
   "fullName": "full name",
   "username": "username",
   "password": "password"
}
// output: correct
{
   "data": 
   {
     "status": "success",
     "message": "User created successfully"
   },
   "meta": 
   {
     "requestId": "bb54fb5a-0bee-4081-a323-02407253a805"
   }
}
// output: wrong
{
   'data': 
   {
     'statusCode': 400,
     'message': 'User Already Exists',
     'path': '/api/auth/signup';
   },
   'meta':
   {
     'requestId': '5ef04555-4168-45c2-9bbb-2e7645e6006e';
   }
}
```
</div>

</details>

<details>
<summary>ورود</summary>
این API برای ورود یک کاربر ثبت نام شده استفاده می شود.
<br>

<div dir="ltr">

###  API URL
```
URL: api/auth/login
Method: POST
```
### Request Body
</div>

<div dir="ltr">

``` json
{
   "username": "string",
   "password": "string"
}
```
### Response
</div>


خروجی بصورت های زیر می باشد:

در حالت صحیح
<div dir="ltr">

```json
{
   "data": {
      "token": "string"
   },
   "meta": {
      "requestId": "string"
   }
}
```
</div>

در حالت خطا

<div dir="ltr">

```json
{
   "data": {
      "message": "string",
      "path": "string",
      "statusCode": "integer"
   },
   "meta": {
      "requestId": "string"
   }
}
```
### Example

```js
// input
{
   "fullName": "full name",
   "username": "username",
   "password": "password"
}
// output: correct
{
   "data": 
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   },
   "meta": 
   {
     "requestId": "bb54fb5a-0bee-4081-a323-02407253a805"
   }
}
// output: wrong
{
   'data': 
   {
     'statusCode': 401,
     'message': 'username or password is incorrect.',
     'path': '/api/auth/login';
   },
   'meta':
   {
     'requestId': '5ef04555-4168-45c2-9bbb-2e7645e6006e';
   }
}
```
</div>
</details>

<details>
<summary>اعتبار سنجی</summary>
این API برای اعتبار سنجی توکن دریافتی از کاربر استفاده می شود.
<br>

<div dir="ltr">

###  API URL
```
URL: api/auth/verify
Method: POST
```
### Request Body
</div>

<div dir="ltr">

``` json
{
   "token": "string"
}
```
### Response
</div>


خروجی بصورت های زیر می باشد:

در حالت صحیح
<div dir="ltr">

```json
{
   "data": {
      "status": "string",
      "message": "string",
      "id": "string",
      "username": "string"
   },
   "meta": {
      "requestId": "string"
   }
}
```
</div>

در حالت خطا

<div dir="ltr">

```json
{
   "data": {
      "status": false,
      "message": "login failed!",
      "id": null,
      "username": null
   },
   "meta": {
      "requestId": "string"
   }
}
```
### Example

```js
// input
{
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
// output: correct
{
   "data": 
   {
      "status": true,
      "message": "user logged in successfully",
      "id": "e8806898-d6a3-4799-890a-1d854624c3ca",
      "username": "aidin"
   },
   "meta": 
   {
     "requestId": "bb54fb5a-0bee-4081-a323-02407253a805"
   }
}
// output: wrong
{
   'data': 
   {
      "status": false,
      "message": "login failed!",
      "id": null,
      "username": null
   },
   'meta':
   {
     'requestId': '5ef04555-4168-45c2-9bbb-2e7645e6006e';
   }
}
```
</div>
</details>

<div dir="rtl">

## ساختار پروژه

- <span dir="ltr">auth.controller.ts</span>: شامل کنترلر‌های ثبت‌نام، ورود و تأیید اعتبار.

- <span dir="ltr">auth.service.ts</span>: شامل منطق کسب‌و‌کار برای مدیریت کاربران و توکن‌ها.

- <span dir="ltr">dto</span>: شامل DTO‌های استفاده شده برای درخواست‌ها.

- <span dir="ltr">interceptor</span>: شامل اینترسپتور برای تغییر پاسخ‌ها.

</div>

</div>