# Sentiment Analyzer

## Description
Sentiment Analyzer is a NestJS application that integrates with MongoDB and Google Cloud's Natural Language API to analyze text sentiment.

---

## Prerequisites
- [Docker](https://www.docker.com/) installed on your system
- A valid Google Cloud API key for the Natural Language API

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sentiment-analyzer
```

### 2. Create a `.env` File
Create a `.env` file based on the provided `.env-example` file:
```bash
cp .env-example .env
```

Update the `GOOGLE_API_KEY` in the `.env` file with your valid Google Cloud API key.

### 3. Update the `docker-compose.yml` File
Add your `GOOGLE_API_KEY` to the environment section of the `app` service in `docker-compose.yml`:
```yaml
    environment:
      - MONGO_URI=mongodb://mongodb:27017/AnalyzeSentiment
      - GOOGLE_API_KEY=<your-google-api-key>
```

---

## Build and Run the Application

### 1. Build the Docker Containers
Run the following command to build the Docker containers:
```bash
docker-compose build
```

### 2. Start the Application
Start the application and its dependencies:
```bash
docker-compose up
```

The NestJS application will be accessible on `http://localhost:4200`.

The MongoDB database will be accessible on `localhost:28000`.

---

## Testing the Application
### Access the Application
- API Base URL: `http://localhost:4200`
- SwaggerUI URL `http://localhost:4200/api`

### Connect to MongoDB
You can connect to the MongoDB database using tools like MongoDB Compass or the Mongo shell. Use the following connection details:
- Host: `localhost`
- Port: `28000`
- Database: `AnalyzeSentiment`

---

## Development Notes
### Build Commands
- To build the application manually:
```bash
docker-compose exec app npm run build
```

### Running Tests
- To run tests:
```bash
docker-compose exec app npm run test
```

---

## Troubleshooting

### Error: `MongooseServerSelectionError: connect ECONNREFUSED`
Ensure that the `MONGO_URI` is correctly configured in both the `.env` file and the `docker-compose.yml` file. Use the service name `mongodb` instead of `localhost` in the `MONGO_URI`.

### Error: `Google API Key Missing`
Ensure you have updated the `.env` file with a valid `GOOGLE_API_KEY` and added it to the `docker-compose.yml` file.

---

## License
This project is licensed under the UNLICENSED license.

