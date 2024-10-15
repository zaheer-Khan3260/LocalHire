# Local Worker Hiring Platform

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

The Local Worker Hiring Platform is an innovative solution designed to connect local workers with potential employers, facilitating quick and efficient job matching within communities. Our platform streamlines the process of finding and hiring local talent for various short-term or on-demand work opportunities.

## Features

- User-friendly interfaces for both workers and employers
- Efficient job posting and application processes
- Real-time messaging system for direct communication
- Instant notifications for new opportunities and updates
- Robust search and filtering capabilities for job matching
- Secure user authentication and data protection

## Technologies Used

- Frontend: React
- Backend API: CosmoCloud
- Real-time Communication: Socket.IO
- Database: MongoDB
- Cloud Storage: Cloudinary

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (v4.0 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/zaheer-Khan3260/LocalHire.git
   ```

2. Navigate to the project directory:
   ```
   cd LocalHire
   ```

3. Install dependencies for both frontend and backend:
   ```
   npm install
   cd backend && npm install
   ```

### Environment Variables

#### Backend Configuration

Create a `.env` file in the backend directory and add the following variables:

```
PORT=                       # replace with your port
MONGODB_URI=                # replace with your mongodb_uri
DB_NAME=                    # replace with your db_name
CORS_ORIGIN=                # replace with your frontend url

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=      # replace with your cloudinary config
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### Frontend Configuration

Create a `.env` file in the frontend directory and add the following variables:

```
VITE_COSMOCLOUD_ENVIRONMENT_ID=  # replace with your cosmocloud config
VITE_COSMOCLOUD_PROJECT_ID=

VITE_MESSAGE_API_URL=            # replace with your backend url
```

4. Start the development servers:
   
  For the frontend:
   ```
   npm run dev
   ```
  For the backend:
   ```
   cd backend && npm run dev
   ```

## Contact

Zaheer khan - zaheer.khan199835@gmail.com
