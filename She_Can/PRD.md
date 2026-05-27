# Product Requirements Document (PRD): She Can Foundation Contact Page

## 1. Project Overview
A modern, responsive contact page for the **She Can Foundation** that allows users to submit their inquiries. The system will validate user input, store submissions in a MongoDB database, and provide immediate feedback upon success.

## 2. Goals & Objectives
* Capture user interest through a simple, professional form.
* Ensure data integrity through client-side and server-side validation.
* Provide a seamless user experience using Ant Design components.
* Store all interactions for future reference in a cloud database.

## 3. Tech Stack
* **Framework**: Next.js 14+ (App Router)
* **Language**: TypeScript
* **UI Library**: Ant Design (AntD)
* **Styling**: Tailwind CSS (for layout)
* **Database**: MongoDB (via Mongoose)
* **Validation**: Zod (backend) & AntD Form rules (frontend)
* **Deployment**: Vercel

## 4. User Stories
* **As a visitor**, I want to provide my name, email, and a message so that the foundation can contact me.
* **As a visitor**, I want to see clear error messages if I enter an invalid email or leave fields empty.
* **As a visitor**, I want to see a clear success message after I click submit so I know my request was received.

## 5. Functional Requirements

### 5.1 Frontend (UI)
* **Hero Section**: Brief introduction to "She Can Foundation".
* **Contact Form**:
    * **Name Field**: Text input, required.
    * **Email Field**: Email input, required, must be a valid email format.
    * **Message Field**: Textarea, required, minimum 10 characters.
    * **Submit Button**: Primary AntD button with loading state during submission.
* **Success State**: Replace the form or show a modal with the text: *"Form Submitted Successfully"*.

### 5.2 Backend (API)
* **Endpoint**: `POST /api/contact`
* **Logic**:
    * Connect to MongoDB via Mongoose.
    * Validate request body using Zod.
    * Save a new document in the `submissions` collection.
    * Return 201 Success or 400/500 Error codes.

### 5.3 Database Schema (Mongoose)
| Field | Type | Validation |
| :--- | :--- | :--- |
| `name` | String | Required |
| `email` | String | Required, Valid Email |
| `message` | String | Required, Min length 10 |
| `createdAt` | Date | Auto-generated timestamp |

## 6. Non-Functional Requirements
* **Responsive Design**: The form must be centered and readable on mobile, tablet, and desktop (using AntD Grid/Tailwind).
* **Security**: Implement basic sanitization to prevent XSS in the message field.
* **Environment Variables**: Securely handle `MONGODB_URI` via Vercel environment settings.

## 7. Deployment Plan
1. **Repository**: Push code to GitHub.
2. **Database**: Set up a free cluster on MongoDB Atlas.
3. **Vercel Connection**:
    * Import repository to Vercel.
    * Configure `MONGODB_URI` in Vercel Dashboard -> Settings -> Environment Variables.
    * Deploy.
