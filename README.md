# Task Management API

This project is a backend test for Task management API, built with Azure Functions and TypeScript.

## Getting Started

Follow these steps to get the project up and running locally.

### Prerequisites

- Node.js (LTS version recommended)
- Azure Functions Core Tools (v4.x)
- Azure Cosmos DB Emulator (for local development). Download from https://learn.microsoft.com/en-us/azure/cosmos-db/emulator

### How to Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd task-management-api
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Copy `.env.example` to `.env` and fill in the required values for Cosmos DB connection.
    ```bash
    cp .env.example .env
    ```
    Ensure your `.env` file contains:
    ```
    COSMOS_DB_ENDPOINT=YOUR_COSMOS_DB_ENDPOINT
    COSMOS_DB_KEY=YOUR_COSMOS_DB_KEY
    COSMOS_DB_DATABASE=YOUR_COSMOS_DB_DATABASE
    COSMOS_DB_CONTAINER_TASKS=YOUR_TASKS_CONTAINER_NAME
    COSMOS_DB_CONTAINER_FORM_SETTINGS=YOUR_FORM_SETTINGS_CONTAINER_NAME
    ```

### How to Run the Unit Tests

To execute the unit tests for the project, run the following command:

```bash
npm test
```

### How to Run the Server (Azure Functions Host)

1.  **Start the Azure Functions Host:**
    ```bash
    npm run start
    ```
    -   When prompted, select Node as the worker runtime.
    -   Wait for the console to show that the host is running and note the port (default is 7071).
2.  **Find Your Function Endpoints:**
    The console will list available HTTP functions and their URLs, e.g.:
    ```
    Functions:
        BulkDeleteTasks: [DELETE] http://localhost:7071/api/Tasks/BulkDelete
        DeleteFormSetting: [DELETE] http://localhost:7071/api/FormSettings/Delete
        DeleteTask: [DELETE] http://localhost:7071/api/Tasks/Delete
        GetFormSettings: [GET] http://localhost:7071/api/FormSettings/Get
        GetTask: [GET] http://localhost:7071/api/Tasks/Find
        GetTasks: [POST] http://localhost:7071/api/Tasks/Get
        GetTaskSummary: [POST] http://localhost:7071/api/Tasks/Summary
        InsertFormSetting: [POST] http://localhost:7071/api/FormSettings/Insert
        InsertTask: [POST] http://localhost:7071/api/Tasks/Insert
        UpdateFormSetting: [PUT] http://localhost:7071/api/FormSettings/Update
        UpdateTask: [PUT] http://localhost:7071/api/Tasks/Update
    ```

### CORS Configuration in `local.settings.json`

For local development, you might need to configure CORS in your `local.settings.json` file to allow requests from your frontend application. Add or modify the `Host` section as follows:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node"
  },
  "Host": {
    "CORS": "*",
    "CORSEnabled": true
  }
}
```

### Postman Collection

A Postman collection is provided in the `postman` directory to help you test the API endpoints.

1.  **Locate the collection:**
    The file is named `TaskManagementAPI.postman_collection` inside the `postman/` directory.
2.  **Import into Postman:**
    Open Postman, click on `File > Import`, and select the `TaskManagementAPI.postman_collection` file to import it.