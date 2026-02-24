# Task Manager Server

A robust backend for the Task Manager application, built with Node.js, Express, and MongoDB. This server provides a RESTful API to manage tasks, including creation, retrieval, filtering, updating, and deletion.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Environment Management**: Dotenv
- **Cross-Origin Resource Sharing**: CORS

## 🛠️ Prerequisites

Before running the server, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## ⚙️ Setup & Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd task-manager/server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT_NO=3000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```
   *Note: The `package.json` presently uses `npm run server.js` for start. You can also run `node server.js` directly.*

## 📂 Project Structure

```text
server/
├── config/             # Database configuration
│   └── db.js           # Mongoose connection setup
├── models/             # Mongoose schemas & models
│   └── task.model.js   # Task data structure
├── src/                # Application logic
│   └── app.js          # Express app and routes
├── .env                # Environment variables (gitignored)
├── package.json        # Dependencies and scripts
└── server.js           # Entry point
```

## 🔌 API Endpoints

### Tasks

#### ➕ Create Task
- **URL**: `/create-post`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "String",
    "category": "Study" | "Work" | "Personal",
    "priority": "Low" | "Medium" | "High"
  }
  ```
- **Response**: `201 Created`

#### 📋 Get All Tasks
- **URL**: `/tasks`
- **Method**: `GET`
- **Query Parameters**:
    - `category` (optional): Filter by category
    - `status` (optional): Filter by status (`Pending` | `Completed`)
- **Response**: `200 OK`

#### ✅ Mark Task as Completed
- **URL**: `/tasks/:id`
- **Method**: `PATCH`
- **Description**: Updates the status of a specific task to "Completed".
- **Response**: `200 OK`

#### 🗑️ Delete Task
- **URL**: `/tasks/:id`
- **Method**: `DELETE`
- **Response**: `200 OK`

## 📊 Data Schema

### Task Model
| Field | Type | Options / Enum | Default |
| :--- | :--- | :--- | :--- |
| `title` | `String` | - | - |
| `category` | `String` | `Study`, `Work`, `Personal` | - |
| `status` | `String` | `Pending`, `Completed` | `Pending` |
| `priority` | `String` | `Low`, `Medium`, `High` | - |

