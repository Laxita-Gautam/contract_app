# Contract Management Assistant

An AI-powered web application for analyzing contracts, extracting key contractual information, reviewing extracted sections, and generating contract summaries.

**Repository:** [Laxita-Gautam/contract_app](https://github.com/Laxita-Gautam/contract_app)

**Live Website:** [Contract Management Assistant](https://contract-app-roan.vercel.app/)

## Table of Contents

- Project Overview
- Features
- Technology Stack
- Architecture
- Repository Structure
- Prerequisites
- Local Installation
- Environment Configuration
- API Endpoints
- Testing
- Completed and Excluded Scope
- Limitations
- Deployment
- Security

## 1. Project Overview

Contract Management Assistant helps users review important information contained in contracts. It uses AI-assisted text analysis to identify key contractual sections, including parties, effective dates, expiry terms, renewals, termination clauses, notice periods, obligations, deadlines, and responsible parties.

Users can review extracted information, make corrections, and view a summary of the contract.

The application combines a React frontend, an Express backend, MongoDB persistence, and the OpenRouter API for AI-assisted extraction.

## 2. Features

- Upload contracts in PDF, DOCX, and TXT formats.
- Extract text from supported documents.
- Analyze contract content using an AI model through OpenRouter.
- Identify important contract sections and obligations.
- Display extracted information on a review and edit page.
- Edit extracted contract information.
- Approve or reject extracted items where implemented.
- Store contract data in MongoDB.
- Retrieve previously stored contract information.
- Display a reviewed contract summary.
- Deploy the frontend and backend independently.

## 3. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, JavaScript |
| Frontend tooling | Vite |
| Styling | Tailwind CSS |
| Navigation | React Router |
| Backend | Node.js, Express.js |
| File uploads | Multer |
| PDF extraction | `pdf-parse` |
| DOCX extraction | Mammoth |
| Database | MongoDB Atlas |
| Database integration | Mongoose |
| AI integration | OpenAI JavaScript SDK with OpenRouter |
| Source control | Git and GitHub |
| Frontend hosting | Vercel |
| Backend hosting | Render |

## 4. Architecture

The application uses a client-server architecture.

1. A user uploads a contract through the React frontend.
2. The frontend sends the document to the Express API.
3. Multer processes the uploaded file.
4. The backend extracts the contract text.
5. The extracted text is sent to OpenRouter for AI-assisted analysis.
6. The backend processes the extracted sections and saves the contract data in MongoDB.
7. The frontend retrieves the saved information for review, editing, and summary display.

```text
User
 |
 v
React Frontend (Vercel)
 |
 v
Express Backend (Render)
 |                  |
 v                  v
MongoDB Atlas     OpenRouter API
```

## 5. Repository Structure

```text
contract_app/
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── README.md
├── AGENT_USAGE.md
├── .env.example
└── .gitignore
```

The exact contents may vary as the project develops.

## 6. Prerequisites

Before running the project locally, install:

- Node.js and npm
- Git
- A MongoDB Atlas account or an accessible MongoDB instance
- An OpenRouter API key

## 7. Local Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/Laxita-Gautam/contract_app.git
cd contract_app
```

### Step 2: Install and configure the backend

Open a terminal and run:

```bash
cd server
npm install
```

Create a local `.env` file in the `server/` directory using `server/.env.example` as a template.

Fill in the required configuration locally. Keep credentials private.

Start the backend:

```bash
npm run dev
```

For a production-style start, use:

```bash
npm start
```

The backend uses the port configured by the application or the hosting environment.

### Step 3: Install and configure the frontend

Open a second terminal from the repository root:

```bash
cd client
npm install
```

Create `client/.env` using `client/.env.example` as a template.

Configure the frontend API base URL for your local backend.

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 8. Environment Configuration

The application uses environment variables to keep configuration separate from source code.

| Variable | Used by | Purpose |
|---|---|---|
| `PORT` | Server | Backend listening port |
| `MONGODB_URI` | Server | MongoDB connection string |
| `OPENROUTER_API_KEY` | Server | OpenRouter API authentication |
| `CLIENT_URL` | Server | Frontend origin permitted by CORS |
| `VITE_API_URL` | Client | Backend API base URL |

### Example configuration files

Create a root `.env.example` containing variable names only:

```env
PORT=
MONGODB_URI=
OPENROUTER_API_KEY=
CLIENT_URL=
VITE_API_URL=
```

Create `server/.env.example`:

```env
PORT=
MONGODB_URI=
OPENROUTER_API_KEY=
CLIENT_URL=
```

Create `client/.env.example`:

```env
VITE_API_URL=
```

Keep the actual values in local `.env` files or the hosting provider's private environment settings.

**Never commit real API keys, database passwords, access tokens, or other secrets.**

## 9. API Endpoints

The following endpoints describe the current API design. Confirm the route definitions in `server/routes/` if they change.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Check backend availability |
| `POST` | `/api/contract/analyze` | Upload and analyze a contract |
| `GET` | `/api/contract/:id` | Retrieve a stored contract |
| `PUT` | `/api/contract/:id/sections/:sectionId` | Update a contract section |

The upload endpoint expects a multipart form field named `contract`.

## 10. Testing and Verification

### Frontend checks

From the `client/` directory, run:

```bash
npm run lint
npm run build
```

These commands check frontend linting and create a production build.

### Backend and integration checks

Verify the following manually:

1. The backend starts successfully.
2. The frontend loads without errors.
3. A valid PDF contract can be uploaded and analyzed.
4. DOCX and TXT uploads work as expected.
5. Unsupported file types are rejected.
6. Empty or unreadable documents are handled appropriately.
7. AI extraction failures return useful error messages.
8. Contract information is saved to MongoDB.
9. Saved contracts can be retrieved.
10. Edited sections persist after reloading.
11. Approval and rejection work if implemented.
12. The summary page displays the expected information.
13. The deployed frontend communicates with the deployed backend.

These are verification steps, not claims that every test has passed. Record the actual outcomes before submitting the project.

## 11. Completed and Excluded Scope

### Core project scope

The application is designed to support:

- Contract upload and text extraction.
- AI-assisted identification of key contract information.
- Storage and retrieval of extracted contract data.
- Review and editing of extracted sections.
- Display of a contract summary.

Confirm each feature against the current implementation before describing it as complete.

### Excluded or unverified features

Unless separately implemented and tested, the following are outside the confirmed core scope:

- OCR for scanned or image-only documents.
- Automated email or push notifications.
- Authentication and role-based access control.
- Advanced audit trails and multi-user workflows.

## 12. Limitations

- Users should compare extracted information with the original contract.
- Large documents may require additional processing or chunking.
- Temporary uploaded files should not be treated as permanent storage.
- Hosting environments may remove temporary files during restarts or deployments.
- The application does not replace professional legal advice.

## 13. Deployment

### Backend deployment on Render

1. Connect the GitHub repository to Render.
2. Configure `server` as the service root directory.
3. Configure the build command to install server dependencies.
4. Configure the start command to run the server's `start` script.
5. Add the required backend environment variables in Render's environment settings.
6. Confirm the server listens on the assigned port.
7. Deploy and inspect the logs.
8. Verify that the API responds successfully.

### Frontend deployment on Vercel

1. Import the GitHub repository into Vercel.
2. Configure `client` as the project root directory.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Configure `VITE_API_URL` to point to the deployed backend.
6. Deploy the frontend.
7. Set `CLIENT_URL` in Render to the deployed frontend origin.
8. Redeploy when environment configuration changes require it.

If React Router client-side routes are used, configure a Vercel rewrite to serve the frontend application for those routes.

### MongoDB Atlas

1. Configure a database and database user.
2. Set appropriate network access rules for the deployed backend.
3. Add the database connection string to the backend environment settings.
4. Verify that the deployed backend can connect to MongoDB.

## 14. Security

- Keep real `.env` files out of source control.
- Commit example configuration files with no real credentials.
- Store backend secrets only in trusted server-side environments.
- Never expose `OPENROUTER_API_KEY` or MongoDB credentials to the frontend.
- Validate uploaded files and configure suitable file-size limits.
- Avoid logging sensitive contract content or credentials.
- Restrict production CORS to trusted frontend origins.
- Rotate credentials if they are accidentally exposed.

## 15. Future Improvements

Potential future enhancements include:

- Authentication and access control.
- Automated backend and frontend tests.
- Improved support for large contracts.
- More detailed review history.

## 16. Disclaimer

Contract Management Assistant provides AI-assisted contract information extraction and organization. AI results may contain errors or omissions. Users should verify all important information against the original contract and consult a qualified legal professional when necessary.
