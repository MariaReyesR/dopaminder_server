# Dopaminder Server

Dopaminder is a web application designed to help individuals, especially those with ADHD, manage impulsive spending by adding a layer of visual feedback, goal tracking, and mindful decision-making. It acts as a fun accountability tool that lets you save smarter and spend more intentionally.

The backend handles user authentication, wishlist item tracking, goal management, and image uploads to Cloudinary.

## Tech Stack

- Node.js
- Express
- Sequelize
- MySQL
- JWT
- bcrypt
- Multer
- Cloudinary

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/RepoLink.git
cd dopaminder-backend
npm install
```

### 2. Create MySQL database:

```sh
CREATE DATABASE dopaminder;
```

### 3. Create `.env` from example:

```sh
cp .env.example .env
```

### 4. Add your local database and Cloudinary values to `.env`.

### Cloudinary Setup (Required)

1. Go to [https://cloudinary.com] and create a free account.
2. Copy your **Cloud Name**, **API Key**, and **API Secret** from your Cloudinary Dashboard.
3. Add them to your `.env` as shown on the `.env.example` file:

```sh
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Run the server:

```sh
node src/server.js
```

Server will run at: [http://localhost:5001]
