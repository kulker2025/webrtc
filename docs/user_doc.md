# User documentation

## Install dependencies

```cmd
npm install
```

## Copy config file

Copy **config/default.json.example** to **config/default.json** file.

## App key generation

```cmd
node op key:generate
```

## Database setup

Edit the config/default.json file.

## Endpoints

All endpoint have a /api prefix.

| Endpoint | Method | Auth | Description |
|-|-|-|-|
| /register | POST  | no |  create user |
| /login    | POST  | no |  login  |
| /users    | GET   | yes |  read users |

## The register endpoint

```json
{
    "name": "joe",
    "email": "joe@green.lan",
    "password": "secret",
    "password_confirmation": "secret"
}
```

## The login endpoint

```json
{
    "name": "joe",
    "password": "secret"
}
```

You receive the bearear token with accessToken key.

## The users endpoint

Send the bearer token.

## Model and controller generation

```cmd
node op create model thing
node op create controller thing
```
