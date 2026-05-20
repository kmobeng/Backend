# Url Shortener API

A minimal URL shortener API built with Express, TypeScript, and MongoDB.

## Features

- Create short URLs
- Redirect to original URLs
- Update or delete short URLs
- Track access counts

## Tech Stack

- Node.js + TypeScript
- Express
- MongoDB + Mongoose
- Morgan

## Requirements

- Node.js 18+ (or newer)
- MongoDB (local or hosted)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/url-shortener
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

Base URL: `http://localhost:5000`

### Health Check

- `GET /api`

### Create Short URL

- `POST /api/shorten`
- Body:
  ```json
  {
    "url": "https://example.com",
    "short": "myshort"
  }
  ```

### Redirect to Original URL

- `GET /api/shorten/:shortUrl`

### Update Short URL

- `PATCH /api/shorten/:shortUrl`
- Body (provide one or both):
  ```json
  {
    "url": "https://example.com",
    "short": "newshort"
  }
  ```

### Delete Short URL

- `DELETE /api/shorten/:shortUrl`

### Get Stats

- `GET /api/:shortUrl/stats`

## Example Requests

See [rest.http](rest.http) for ready-to-run HTTP examples.

## Notes

- The `short` value must be unique.
- The API increments `accessCount` each time a short URL is resolved.
