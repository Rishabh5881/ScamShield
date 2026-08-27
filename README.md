# \# ScamShield AI 🛡️

# 

# > \*\*AI-assisted scam detection and risk analysis platform\*\*

# 

# ScamShield AI is a full-stack security application designed to help users identify potentially fraudulent messages, screenshots, and URLs. It combines deterministic security checks with AI-assisted analysis to produce an understandable risk assessment.

# 

# \### Detect → Explain → Protect

# 

# \*\*Detect\*\* suspicious patterns → \*\*Explain\*\* why content may be risky → \*\*Protect\*\* users by providing actionable risk information before they interact with potentially malicious content.

# 

# > \*\*Important:\*\* AI-assisted risk assessment is not an absolute guarantee. ScamShield AI is a decision-support tool and should not be treated as a definitive security verdict.

# 

# \---

# 

# \## 1. Problem

# 

# Online scams increasingly use convincing messages, fake verification requests, phishing links, payment-related fraud, and impersonation techniques.

# 

# Users may receive:

# 

# \* Fake banking or payment messages

# \* Phishing links

# \* Urgent account-verification requests

# \* Suspicious screenshots

# \* Fraudulent login or OTP requests

# \* Social-engineering messages

# 

# Traditional users often have difficulty determining whether content is legitimate.

# 

# ScamShield AI addresses this problem by providing a centralized interface for analyzing suspicious content and explaining the associated risk.

# 

# \---

# 

# \## 2. Solution

# 

# ScamShield AI provides a unified analysis workflow for suspicious content.

# 

# \### Core workflow

# 

# ```text

# User Input

# &#x20;   │

# &#x20;   ├── Message

# &#x20;   ├── Screenshot

# &#x20;   └── Static URL

# &#x20;         │

# &#x20;         ▼

# &#x20;  Input Validation

# &#x20;         │

# &#x20;         ▼

# &#x20;Deterministic Security Checks

# &#x20;         │

# &#x20;         ▼

# &#x20;   AI-Assisted Analysis

# &#x20;         │

# &#x20;         ▼

# &#x20;Risk Assessment

# &#x20;         │

# &#x20;         ▼

# &#x20;Explanation + Result

# &#x20;         │

# &#x20;         ▼

# &#x20;     Persistence

# &#x20;         │

# &#x20;         ▼

# &#x20;      History

# ```

# 

# The system combines deterministic logic with AI-assisted reasoning rather than relying exclusively on an AI response.

# 

# \---

# 

# \# 3. Detect → Explain → Protect

# 

# \## 🔎 Detect

# 

# ScamShield analyzes suspicious:

# 

# \* Text messages

# \* Uploaded screenshots

# \* Static URLs

# 

# The system looks for indicators such as suspicious wording, phishing characteristics, URLs, urgency, credential requests, and other risk signals.

# 

# \## 🧠 Explain

# 

# Instead of only returning a score, ScamShield provides:

# 

# \* Risk level

# \* Risk score

# \* Classification

# \* Confidence information

# \* Threat assessment / explanation

# 

# This makes the result easier for users to understand.

# 

# \## 🛡️ Protect

# 

# The objective is to help users recognize potentially dangerous content before clicking links, sharing information, or taking further action.

# 

# \---

# 

# \# 4. Features

# 

# \### Authentication

# 

# \* User signup

# \* User login

# \* JWT-based authentication

# \* Protected API routes

# \* Session persistence

# 

# \### Message Analysis

# 

# \* Analyze suspicious text messages

# \* Extract relevant URLs from messages

# \* Apply URL risk checks

# \* AI-assisted threat assessment

# \* Risk score and classification

# 

# \### Screenshot Analysis

# 

# \* Upload suspicious screenshots

# \* Supported image formats:

# 

# &#x20; \* PNG

# &#x20; \* JPEG/JPG

# &#x20; \* WEBP

# \* File-size validation

# \* AI-assisted screenshot analysis

# 

# \### Safe Static URL Analysis

# 

# ScamShield supports \*\*safe static URL analysis\*\*.

# 

# The URL is analyzed as data rather than being opened or visited by the application.

# 

# The system can inspect characteristics such as:

# 

# \* URL structure

# \* IP-address based URLs

# \* Suspicious paths

# \* Query parameters

# \* Phishing-related indicators

# \* Other deterministic risk signals

# 

# > ScamShield does \*\*not\*\* treat static URL analysis as proof that a website is malicious or safe.

# 

# \### Analysis History

# 

# \* Persist analysis results

# \* View previous analyses

# \* Associate results with authenticated users

# 

# \### Dashboard \& Analytics

# 

# \* Analysis statistics

# \* Risk-related information

# \* User analysis history

# \* Dashboard overview

# 

# \### Security Controls

# 

# \* Request validation

# \* File validation

# \* Request size limits

# \* Rate limiting

# \* Helmet security headers

# \* CORS configuration

# \* Sanitized API errors

# \* Environment-based secrets

# \* Authentication and authorization

# 

# \---

# 

# \# 5. Architecture

# 

# ScamShield AI follows a layered full-stack architecture.

# 

# ```mermaid

# flowchart TB

# 

# &#x20;   U\[User / Browser]

# 

# &#x20;   F\[React Frontend<br/>Vite + Tailwind CSS]

# 

# &#x20;   B\[Node.js + Express Backend<br/>REST API]

# 

# &#x20;   DB\[(PostgreSQL<br/>Prisma ORM)]

# 

# &#x20;   AI\[AI Intelligence Service<br/>Node.js]

# 

# &#x20;   MODEL\[AI Provider]

# 

# &#x20;   U --> F

# &#x20;   F -->|HTTPS / REST API| B

# 

# &#x20;   B -->|Authentication<br/>Validation<br/>Business Logic| DB

# 

# &#x20;   B -->|Message Analysis| AI

# &#x20;   B -->|Screenshot Analysis| AI

# 

# &#x20;   AI -->|AI Request| MODEL

# &#x20;   MODEL -->|Structured AI Result| AI

# 

# &#x20;   AI -->|Analysis Result| B

# &#x20;   B -->|Persist Result| DB

# 

# &#x20;   DB --> B

# &#x20;   B --> F

# &#x20;   F --> U

# ```

# 

# \---

# 

# \# 6. Application Architecture

# 

# \## Frontend

# 

# The frontend is responsible for:

# 

# \* User interface

# \* Authentication screens

# \* Dashboard

# \* Analysis interface

# \* Screenshot upload

# \* URL analysis input

# \* Result presentation

# \* History

# \* User-facing error and loading states

# 

# Technology:

# 

# ```text

# React

# Vite

# Tailwind CSS

# React Router DOM

# Axios

# Recharts

# Framer Motion

# Lucide React

# ```

# 

# \---

# 

# \## Backend

# 

# The backend acts as the main application API.

# 

# Responsibilities include:

# 

# \* Authentication

# \* Authorization

# \* Request validation

# \* Analysis orchestration

# \* AI service communication

# \* Database persistence

# \* History retrieval

# \* Dashboard statistics

# \* Rate limiting

# \* Security middleware

# \* Error handling

# 

# Technology:

# 

# ```text

# Node.js

# Express

# JWT

# bcryptjs

# Prisma

# PostgreSQL

# Multer

# Helmet

# CORS

# express-rate-limit

# ```

# 

# \---

# 

# \## AI Intelligence Service

# 

# The AI service is separated from the main backend.

# 

# Responsibilities include:

# 

# \* AI request processing

# \* Prompt management

# \* Response validation

# \* Message analysis

# \* Screenshot analysis

# \* Risk-related intelligence

# 

# The service communicates with the configured AI provider through server-side credentials.

# 

# AI credentials are \*\*not exposed to the frontend\*\*.

# 

# \---

# 

# \# 7. AI Pipeline

# 

# The general analysis pipeline is:

# 

# ```text

# Input

# &#x20; │

# &#x20; ▼

# Validation

# &#x20; │

# &#x20; ▼

# Content Preparation

# &#x20; │

# &#x20; ├───────────────┐

# &#x20; ▼               ▼

# URL Risk       AI Analysis

# Checks         │

# &#x20; │            ▼

# &#x20; │        Structured Result

# &#x20; │               │

# &#x20; └───────┬───────┘

# &#x20;         ▼

# &#x20;    Risk Assessment

# &#x20;         │

# &#x20;         ▼

# &#x20;  Backend Validation

# &#x20;         │

# &#x20;         ▼

# &#x20;      Database

# &#x20;         │

# &#x20;         ▼

# &#x20;     Frontend

# ```

# 

# \### AI response handling

# 

# The application validates AI responses before using them.

# 

# This helps prevent malformed or unexpected AI output from directly becoming an application result.

# 

# AI failures such as service errors, invalid responses, timeouts, or unavailable AI services are handled by the application rather than being silently treated as successful analysis.

# 

# \---

# 

# \# 8. Risk Scoring

# 

# ScamShield uses a risk-score-based presentation to communicate the severity of an analysis.

# 

# The result can include:

# 

# \* Risk score

# \* Risk level

# \* Classification

# \* Confidence

# \* Threat assessment

# 

# A simplified conceptual representation is:

# 

# ```text

# Low Risk

# &#x20;  │

# &#x20;  ├── Lower concern

# &#x20;  │

# &#x20;  ▼

# Moderate / Suspicious

# &#x20;  │

# &#x20;  ├── Indicators require attention

# &#x20;  │

# &#x20;  ▼

# High / Critical Risk

# &#x20;  │

# &#x20;  └── Stronger indicators of potential fraud

# ```

# 

# The score is an \*\*assessment\*\*, not a mathematical guarantee that content is malicious or legitimate.

# 

# For URL analysis, deterministic URL-risk indicators can contribute to the assessment.

# 

# \---

# 

# \# 9. Security

# 

# Security is treated as a core part of the application architecture.

# 

# \### Authentication

# 

# \* JWT-based authentication

# \* Protected routes

# \* Password hashing using bcrypt

# \* Authentication-aware API requests

# 

# \### Input Security

# 

# \* Request validation

# \* Input limits

# \* Structured validation

# \* File type validation

# \* File size restrictions

# 

# \### File Upload Security

# 

# Screenshot uploads are restricted to supported image formats and have a maximum upload size.

# 

# Current supported formats:

# 

# ```text

# PNG

# JPEG

# JPG

# WEBP

# ```

# 

# Maximum screenshot size:

# 

# ```text

# 10 MB

# ```

# 

# \### API Security

# 

# The backend uses security middleware including:

# 

# \* Helmet

# \* CORS

# \* Rate limiting

# \* Request validation

# \* Sanitized errors

# 

# \### Secret Management

# 

# Sensitive configuration is stored through environment variables.

# 

# Examples include:

# 

# \* Database credentials

# \* JWT secret

# \* AI provider credentials

# \* Service URLs

# 

# Secrets should never be committed to source control.

# 

# \---

# 

# \# 10. API Overview

# 

# The backend exposes REST APIs for authentication, analysis, history, and application functionality.

# 

# Representative API areas include:

# 

# | Area           | Purpose                                        |

# | -------------- | ---------------------------------------------- |

# | Authentication | Signup, login, current-user/session operations |

# | Analysis       | Message, screenshot, and URL analysis          |

# | History        | Retrieve previous user analyses                |

# | Dashboard      | Statistics and analysis information            |

# | AI Service     | Internal AI analysis communication             |

# | Health         | Service health verification                    |

# 

# \### Analysis flow

# 

# ```text

# Frontend

# &#x20;  │

# &#x20;  ▼

# Backend Analysis API

# &#x20;  │

# &#x20;  ├── Validate request

# &#x20;  │

# &#x20;  ├── Extract / inspect URLs

# &#x20;  │

# &#x20;  ├── Apply deterministic checks

# &#x20;  │

# &#x20;  ├── Call AI service

# &#x20;  │

# &#x20;  ├── Validate AI response

# &#x20;  │

# &#x20;  ├── Persist result

# &#x20;  │

# &#x20;  └── Return result

# ```

# 

# Internal service communication is kept separate from frontend-facing APIs.

# 

# \---

# 

# \# 11. Tech Stack

# 

# \## Frontend

# 

# | Technology       | Purpose                |

# | ---------------- | ---------------------- |

# | React            | UI framework           |

# | Vite             | Frontend build tooling |

# | Tailwind CSS     | Styling                |

# | React Router DOM | Routing                |

# | Axios            | HTTP communication     |

# | Recharts         | Dashboard charts       |

# | Framer Motion    | UI animations          |

# | Lucide React     | Icons                  |

# 

# \## Backend

# 

# | Technology         | Purpose                    |

# | ------------------ | -------------------------- |

# | Node.js            | Runtime                    |

# | Express            | REST API                   |

# | Prisma             | ORM                        |

# | PostgreSQL         | Database                   |

# | JWT                | Authentication             |

# | bcryptjs           | Password hashing           |

# | Multer             | File uploads               |

# | Helmet             | HTTP security headers      |

# | CORS               | Cross-origin configuration |

# | express-rate-limit | Rate limiting              |

# 

# \## AI

# 

# | Technology             | Purpose               |

# | ---------------------- | --------------------- |

# | Node.js AI Service     | AI orchestration      |

# | Zod                    | Structured validation |

# | Configured AI Provider | AI-assisted analysis  |

# 

# \---

# 

# \# 12. Database

# 

# The application uses PostgreSQL with Prisma ORM.

# 

# The database stores application data required for:

# 

# \* Users

# \* Analysis records

# \* Analysis results

# 

# A simplified relationship is:

# 

# ```text

# User

# &#x20;│

# &#x20;└── Analysis

# &#x20;      │

# &#x20;      └── AnalysisResult

# ```

# 

# This allows completed analyses to be persisted and retrieved later through the authenticated history functionality.

# 

# \---

# 

# \# 13. Environment Variables

# 

# Environment variables are required for local and deployed environments.

# 

# \## Backend

# 

# Example:

# 

# ```env

# DATABASE\_URL="postgresql://USER:PASSWORD@HOST:5432/scamshield"

# JWT\_SECRET="your-secure-secret"

# JWT\_EXPIRES\_IN="7d"

# 

# PORT=5000

# FRONTEND\_URL="http://localhost:5173"

# 

# AI\_SERVICE\_URL="http://localhost:6100"

# ```

# 

# \## AI Intelligence Service

# 

# Example:

# 

# ```env

# PORT=6100

# 

# AI\_PROVIDER="your-provider"

# AI\_MODEL="your-model"

# AI\_TIMEOUT\_MS=30000

# 

# AI\_API\_KEY="your-secret-api-key"

# ```

# 

# > Use the exact variable names defined in the project's `.env.example` files. Never commit actual credentials.

# 

# \## Frontend

# 

# The frontend should contain only public/non-secret configuration.

# 

# Example:

# 

# ```env

# VITE\_BACKEND\_URL="http://localhost:5000"

# ```

# 

# > \*\*Never put database credentials, JWT secrets, or AI API keys in frontend environment variables.\*\*

# 

# \---

# 

# \# 14. Local Development

# 

# \## Prerequisites

# 

# Install:

# 

# \* Node.js

# \* npm

# \* PostgreSQL

# 

# Docker can also be used for the containerized setup.

# 

# \---

# 

# \## Clone the repository

# 

# ```bash

# git clone <repository-url>

# cd ScamShield

# ```

# 

# \---

# 

# \## Install dependencies

# 

# \### Frontend

# 

# ```bash

# cd frontend

# npm install

# ```

# 

# \### Backend

# 

# ```bash

# cd ../backend

# npm install

# ```

# 

# \### AI Intelligence Service

# 

# ```bash

# cd ../ai-intelligence

# npm install

# ```

# 

# \---

# 

# \## Configure environment variables

# 

# Create environment files from the provided examples:

# 

# ```text

# backend/.env

# ai-intelligence/.env

# ```

# 

# Configure the required database, authentication, AI, and service URLs.

# 

# \---

# 

# \## Database setup

# 

# From the backend/database project directory, configure PostgreSQL and run the Prisma migration workflow used by the project.

# 

# Typical Prisma commands include:

# 

# ```bash

# npx prisma generate

# npx prisma migrate dev

# ```

# 

# \---

# 

# \## Start the services

# 

# \### AI service

# 

# ```bash

# cd ai-intelligence

# npm run dev

# ```

# 

# Expected local port:

# 

# ```text

# 6100

# ```

# 

# \### Backend

# 

# ```bash

# cd backend

# npm run dev

# ```

# 

# Expected local port:

# 

# ```text

# 5000

# ```

# 

# \### Frontend

# 

# ```bash

# cd frontend

# npm run dev

# ```

# 

# The Vite development server typically runs on:

# 

# ```text

# http://localhost:5173

# ```

# 

# \---

# 

# \# 15. Docker

# 

# ScamShield is designed around separate application services.

# 

# Conceptually:

# 

# ```text

# ┌─────────────────────────────┐

# │          Frontend           │

# │       React + Nginx         │

# └──────────────┬──────────────┘

# &#x20;              │

# &#x20;              ▼

# ┌─────────────────────────────┐

# │          Backend            │

# │      Node.js + Express      │

# └───────┬──────────────┬──────┘

# &#x20;       │              │

# &#x20;       ▼              ▼

# ┌───────────────┐  ┌─────────────────┐

# │  PostgreSQL   │  │  AI Intelligence│

# │               │  │     Service     │

# └───────────────┘  └────────┬────────┘

# &#x20;                           │

# &#x20;                           ▼

# &#x20;                      AI Provider

# ```

# 

# Docker configuration should:

# 

# \* Keep secrets outside images

# \* Use environment variables

# \* Use service-to-service networking

# \* Include production-oriented Dockerfiles

# \* Keep unnecessary files out of images

# \* Provide appropriate health checks

# 

# Build and startup commands depend on the repository's Docker Compose configuration.

# 

# \---

# 

# \# 16. Deployment

# 

# The production architecture separates:

# 

# ```text

# Frontend

# &#x20;  │

# &#x20;  ▼

# Backend API

# &#x20;  │

# &#x20;  ├── PostgreSQL

# &#x20;  │

# &#x20;  └── AI Intelligence Service

# &#x20;             │

# &#x20;             ▼

# &#x20;        AI Provider

# ```

# 

# Production deployment requires:

# 

# \* HTTPS

# \* Correct frontend/backend URLs

# \* Production environment variables

# \* Database connectivity

# \* AI service connectivity

# \* CORS configuration

# \* Secure secrets

# \* Service health verification

# 

# After deployment, the complete production flow should be smoke-tested.

# 

# \---

# 

# \# 17. Testing

# 

# Testing covers application functionality and production behavior.

# 

# Important test areas include:

# 

# \### Authentication

# 

# \* Signup

# \* Login

# \* Protected routes

# \* Session/authentication behavior

# 

# \### Message Analysis

# 

# \* Valid message

# \* Invalid input

# \* AI response handling

# \* URL extraction

# \* Risk assessment

# 

# \### Screenshot Analysis

# 

# \* Valid image

# \* Unsupported file type

# \* Oversized file

# \* AI analysis

# \* Error handling

# 

# \### URL Analysis

# 

# \* Valid URL

# \* Suspicious URL

# \* Invalid URL

# \* Static URL risk analysis

# 

# \### History

# 

# \* Analysis persistence

# \* History retrieval

# \* User-specific records

# 

# \### Dashboard

# 

# \* Statistics

# \* Analysis counts

# \* Result presentation

# 

# \### Failure Scenarios

# 

# \* AI timeout

# \* AI unavailable

# \* Invalid AI response

# \* Database failure

# \* Unauthorized requests

# \* Invalid requests

# 

# \### Frontend

# 

# Automated frontend tests cover important UI behavior such as routing and authentication-related flows.

# 

# \---

# 

# \# 18. Production Smoke Test

# 

# The deployed application should be verified end-to-end:

# 

# ```text

# 1\. Open frontend

# 2\. Signup / Login

# 3\. Dashboard

# 4\. Message analysis

# 5\. Screenshot analysis

# 6\. Static URL analysis

# 7\. Result

# 8\. History

# 9\. Dashboard statistics

# 10\. Logout

# ```

# 

# Production infrastructure should also be checked for:

# 

# ```text

# ✓ HTTPS

# ✓ API connectivity

# ✓ CORS

# ✓ AI service

# ✓ Database persistence

# ✓ Error handling

# ```

# 

# \---

# 

# \# 19. Screenshots

# 

# Add project screenshots here before the final hackathon/placement submission.

# 

# Recommended screenshots:

# 

# \### Landing Page

# 

# ```text

# screenshots/home.png

# ```

# 

# \### Dashboard

# 

# ```text

# screenshots/dashboard.png

# ```

# 

# \### Message Analysis

# 

# ```text

# screenshots/message-analysis.png

# ```

# 

# \### Screenshot Analysis

# 

# ```text

# screenshots/screenshot-analysis.png

# ```

# 

# \### URL Analysis

# 

# ```text

# screenshots/url-analysis.png

# ```

# 

# \### Analysis Result

# 

# ```text

# screenshots/result.png

# ```

# 

# \### History

# 

# ```text

# screenshots/history.png

# ```

# 

# > Replace the paths above with the actual screenshots committed to the repository.

# 

# \---

# 

# \# 20. Project Structure

# 

# ```text

# ScamShield/

# │

# ├── frontend/

# │   ├── src/

# │   ├── public/

# │   ├── package.json

# │   └── ...

# │

# ├── backend/

# │   ├── src/

# │   │   ├── controllers/

# │   │   ├── middleware/

# │   │   ├── routes/

# │   │   └── services/

# │   ├── prisma/

# │   ├── package.json

# │   └── ...

# │

# ├── ai-intelligence/

# │   ├── src/

# │   │   ├── config/

# │   │   ├── providers/

# │   │   ├── prompts/

# │   │   ├── risk/

# │   │   ├── schemas/

# │   │   └── services/

# │   ├── package.json

# │   └── ...

# │

# ├── docker-compose.yml

# ├── .gitignore

# └── README.md

# ```

# 

# \---

# 

# \# 21. Design Principles

# 

# ScamShield follows several important engineering principles:

# 

# \### Separation of concerns

# 

# Frontend, backend, database, and AI intelligence are separated into dedicated layers/services.

# 

# \### Defense in depth

# 

# Risk assessment is not dependent on a single signal. Deterministic checks and AI-assisted analysis can work together.

# 

# \### Fail safely

# 

# AI failures and invalid responses should result in controlled application errors rather than silently producing misleading results.

# 

# \### Privacy and security

# 

# Sensitive credentials remain server-side and should be supplied through secure environment configuration.

# 

# \### Explainability

# 

# Results should provide context and reasoning rather than only exposing a numerical score.

# 

# \---

# 

# \# 22. Limitations

# 

# ScamShield AI has important limitations.

# 

# \* AI analysis can produce incorrect results.

# \* A high-risk result does not prove that content is malicious.

# \* A low-risk result does not prove that content is completely safe.

# \* Static URL analysis does not guarantee the safety or maliciousness of a destination.

# \* Scam techniques evolve continuously.

# \* AI-provider availability can affect analysis.

# \* External services may introduce latency or availability constraints.

# 

# Therefore, users should independently verify sensitive requests and avoid sharing credentials, OTPs, passwords, or financial information based solely on an automated result.

# 

# \---

# 

# \# 23. Future Improvements

# 

# Potential future improvements include:

# 

# \* More advanced URL intelligence

# \* Domain reputation integration

# \* Additional scam-category detection

# \* Improved multilingual analysis

# \* More robust OCR pipelines

# \* Expanded threat-intelligence sources

# \* More detailed explainability

# \* Improved analytics

# \* Additional automated security testing

# \* Continuous monitoring and observability

# \* More comprehensive production alerting

# 

# These are future improvements and are \*\*not represented as currently implemented features\*\*.

# 

# \---

# 

# \# 24. Team

# 

# \### ScamShield AI — CodeStorm 2026: FutureForge

# 

# \*\*Team Size:\*\* 4 developers

# 

# Add the final team member information here:

# 

# | Member        | Role                        |

# | ------------- | --------------------------- |

# | Team Member 1 | Full-Stack / Backend        |

# | Team Member 2 | Frontend                    |

# | Team Member 3 | AI / Intelligence           |

# | Team Member 4 | Database / DevOps / Testing |

# 

# Replace the placeholders with the actual team members and roles before submission.

# 

# \---

# 

# \# 25. Project Status

# 

# ScamShield AI includes an end-to-end application architecture covering:

# 

# ```text

# Authentication

# &#x20;     ↓

# Message Analysis

# &#x20;     ↓

# Screenshot Analysis

# &#x20;     ↓

# Static URL Analysis

# &#x20;     ↓

# AI-Assisted Risk Assessment

# &#x20;     ↓

# Result

# &#x20;     ↓

# Database Persistence

# &#x20;     ↓

# History

# &#x20;     ↓

# Dashboard Analytics

# ```

# 

# The project is intended as a \*\*security-assistance and risk-assessment platform\*\*, not as a replacement for professional cybersecurity investigation or human judgment.

# 

# \---

# 

# \# 26. Disclaimer

# 

# > \*\*ScamShield AI provides AI-assisted risk assessment and deterministic security analysis. Results are not an absolute guarantee of safety or maliciousness. Always independently verify suspicious communications and never share passwords, OTPs, payment credentials, or other sensitive information solely because an automated system reports low risk.\*\*

# 

# \---

# 

# \## Built for

# 

# \*\*CodeStorm 2026 — FutureForge\*\*

# 

# \### ScamShield AI 🛡️

# 

# \*\*Detect → Explain → Protect\*\*



