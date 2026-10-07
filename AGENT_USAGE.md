# Agent Usage Report

## 1. Overview

The Contract Management Assistant was developed primarily through manual coding and integration. ChatGPT was used as a supporting tool for occasional technical guidance, troubleshooting, and clarification during development.

The main implementation work, including integrating the frontend and backend, testing the application, and deploying the project, remained the developer's responsibility.

AI assistance was used selectively rather than as the primary method of developing the entire application.

## 2. Tools Used

### ChatGPT

ChatGPT was consulted for:
- Providing occasional guidance on Express routes and backend controllers.
- Troubleshooting document upload and text extraction errors.
- Understanding OpenRouter integration and AI-generated JSON responses.

ChatGPT suggestions were reviewed and adapted to the existing codebase when relevant.

### Development and Deployment Tools

The project also used development tools and services such as:
- Visual Studio Code or another code editor for writing and modifying code.
- Git and GitHub for source control.
- MongoDB Atlas for database hosting.
- OpenRouter for AI-assisted contract analysis.
- Render for backend deployment.
- Vercel for frontend deployment.
- Browser developer tools and deployment logs for troubleshooting.

These tools served different purposes and were not all AI agents.

## 3. Representative Prompts

ChatGPT was consulted using questions and prompts such as:

- "How do I extract text from DOCX contracts?"
- "How do I resolve an ENOENT error when reading an uploaded file on Render?"

These are representative examples of the assistance requested, rather than a complete record of every interaction.

## 4. Delegated Work and Developer Responsibility

ChatGPT provided limited supporting assistance through explanations, suggestions, and troubleshooting guidance.

The developer remained responsible for:

- Writing and integrating the main application code.
- Implementing the frontend pages and backend functionality.
- Configuring routes, controllers, and database connectivity.
- Integrating document extraction and AI analysis.
- Adapting suggested fixes to the existing project structure.
- Running the application and investigating errors.
- Managing deployment configuration.
- Reviewing the correctness and usefulness of suggested changes.

No independent AI agent was delegated ownership of a complete project module. ChatGPT functioned as a supplementary development assistant.

## 5. Important Mistakes and Corrections

### 5.1 Contract upload and file-path error

During deployment, the backend returned an error similar to:

`ENOENT: no such file or directory, open 'uploads/<filename>.pdf'`

This indicated that the backend could not find the uploaded file at the path it was attempting to read.

ChatGPT helped identify the file-path handling and Multer configuration as areas to investigate. The proposed approach was to use the path supplied by Multer consistently and inspect backend logs to verify the actual uploaded-file path.

The proposed correction still needed to be verified against the deployed application before it could be considered a confirmed fix.

### 5.3 AI response parsing

The AI integration could return output that was not directly parseable as JSON, for example, JSON surrounded by Markdown code fences.

ChatGPT provided guidance on validating and parsing AI responses and handling errors gracefully. Any parsing changes needed to be checked against actual API responses.


## 6. How AI Suggestions Were Evaluated

AI-generated suggestions were treated as assistance, not as automatically correct solutions.

The evaluation process included:

1. Comparing suggestions with the existing code and folder structure.
2. Checking whether proposed imports, paths, and endpoints matched the project.
3. Making changes incrementally instead of rewriting unrelated components.
4. Inspecting browser errors and backend logs when problems occurred.
5. Testing the affected functionality where possible.
6. Avoiding claims that a suggested fix worked until its behavior was checked.

Suggestions that did not fit the existing implementation were not required to be adopted.

## 7. Verification

Verification was the developer's responsibility. Relevant checks included reviewing the code, running the frontend and backend, uploading supported document formats, inspecting API responses, checking database persistence, and testing deployment behavior.

The following table should be updated to reflect the checks actually completed.

| Verification activity | Status |
|---|---|
| Review of AI-generated suggestions | Performed during development |
| Frontend routing and rendering | Investigated during development |
| PDF/DOCX extraction workflow | Implemented |
| OpenRouter integration | Implemented |
| MongoDB integration | Implemented |
| Frontend and backend deployment | Deployment configured |

## 8. Limitations of AI Assistance

- AI-generated suggestions may not match the project's exact library versions or folder structure.
- Suggested fixes may address a visible error without resolving every underlying issue.
- AI-generated contract analysis can be inaccurate and must be reviewed by a human.
- ChatGPT did not independently verify every feature or deployment change.
- No automated test coverage or successful test results are claimed without supporting evidence.

## 9. Conclusion

ChatGPT was used as an occasional support tool during development of the Contract Management Assistant. Its primary contribution was helping clarify implementation choices, investigate errors, and prepare documentation.

The developer retained responsibility for implementation decisions, code integration, testing, deployment, and the final behavior of the application.
