# Rayeva AI Backend System

## Overview
This is a production-ready backend for Rayeva - AI Systems, designed to integrate AI capabilities into sustainable commerce workflows.
It strictly adheres to clean architecture principles, separating AI prompt engineering from business logic and data persistence.

## Architecture
**Pattern:** Controller → Service → AI Service → Business Logic → Database

- **Controllers**: Handle HTTP requests, input validation, and send responses.
- **Services**: Orchestrate complex workflows (e.g., fetch data -> calculate metrics -> call AI -> save to DB).
- **AI Layer**: `src/ai/` contains the AI provider wrapper (OpenAI/Gemini) and prompt logic. This layer is responsible for ensuring structured JSON output.
- **Models**: Mongoose schemas for MongoDB.
- **Utils**: Pure functions for business logic (math calculations, validation lists).

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **AI**: OpenAI API (Configurable to Gemini)
- **Validation**: Strict JSON schema enforcement on AI outputs

## Setup
1. Clone the repo.
2. `npm install`
3. Create `.env` from `.env.example`.
4. `npm start` (or `npm run dev`)

## Modules Implemented

### Module 1: AI Auto-Category & Tag Generator
**Objective**: Automatically categorize products and check sustainability compliance.
- **Endpoint**: `POST /api/categories/create-product`
- **Logic**:
  1. Receives product `title` & `description`.
  2. Calls AI with strict JSON requirements.
  3. Validates that the primary category exists in our allowed list (`src/utils/categories.js`).
  4. Saves product with generated metadata.
- **Files**:
  - `src/controllers/productController.js`
  - `src/services/categoryService.js`

### Module 3: AI Impact Reporting Generator
**Objective**: Calculate environmental impact and generate a user-facing summary.
- **Endpoint**: `POST /api/impact/orders`
- **Logic**:
  1. Receives order items.
  2. Fetches product impact factors (e.g., `plasticSavedFactor`) from DB.
  3. **Calculates totals using deterministic math** in `src/utils/impactCalculator.js` (No AI math!).
  4. Sends totals to AI to generate a narrative ("You saved 2kg of plastic!").
  5. Saves Order with the structured Impact Report.
- **Files**:
  - `src/controllers/orderController.js`
  - `src/services/impactService.js`

### AI Structured Outputs & Logging

This system strictly enforces structured JSON outputs from LLMs to ensure reliable downstream processing. We do not accept raw text.

**1. JSON Schema Enforcement:**
*   **Prompt Engineering**: All prompts explicitly instruct the model to return valid JSON.
*   **Gemini/OpenAI Config**: We leverage `responseMimeType: "application/json"` (Gemini) to guarantee structure.
*   **Service Layer Validation**: `categoryService.js` validates that generated categories match our allowed list (`src/utils/categories.js`) before saving.

**Example AI Response (Module 1 - Auto Category):**
```json
{
  "primary_category": "Kitchenware",
  "sub_category": "Reusable Cups",
  "seo_tags": ["bamboo cup", "eco mug", "travel coffee cup"],
  "sustainability_filters": ["plastic-free", "reusable", "biodegradable"]
}
```

**2. AI Request Logging:**
Every interaction with the LLM is logged to MongoDB for auditing, debugging, and cost tracking.

**Log Model Structure (`src/models/AIRequestLog.js`):**
```json
{
  "endpoint": "category-generation",
  "provider": "gemini",
  "prompt": "Analyze the following product...",
  "responseRaw": "{ \"primary_category\": \"Kitchenware\" ... }",
  "responseParsed": {
    "primary_category": "Kitchenware",
    "sub_category": "Reusable Cups"
    // ...
  },
  "status": "success",
  "tokensUsed": 150,
  "createdAt": "2023-10-27T10:00:00Z"
}
```

### AI Prompt Design Strategy

We treat prompts as code functions with strict input/output contracts.

**1. Deterministic JSON Instructions:**
All system prompts include the directive: `"Return ONLY valid JSON. No markdown formatting."` and in the case of Gemini, we use the `responseMimeType: "application/json"` configuration.

**2. Constrained Classification (Module 1):**
We do not let the AI "guess" categories. We pass the allowed enum list directly in the prompt:
> *"Assign a 'primary_category' strictly from this allowed list: [Kitchenware, Bedding & Bath...]"*
Use `categoryService.js` to validate the returned value against the internal constant.

**3. Anti-Hallucination for Math (Module 3):**
AI is bad at math. We solve this by performing all calculations (Plastic Saved = Qty * Factor) in Node.js first.
The prompt explicitly says:
> *"Do not recalculate the numbers. Use the provided totals."*
This ensures the AI is only used for **formatting** and **tone**, not for business logic.

### AI Logging System

Every interaction with the LLM is captured for transparency and optimization.

*   **Collection**: `AIRequestLog`
*   **Purpose**: 
    1.  **Debugging**: Trace exactly what was sent and received if an error occurs.
    2.  **Monitoring**: Detect hallucinations or schema violations.
    3.  **Future Fine-Tuning**: Build a dataset of successful prompt-response pairs.

**Log Model Structure:**
See `src/models/AIRequestLog.js` for the exact Mongoose schema involving:
- `endpoint`: Tracks which module made the request.
- `prompt`: The full prompt sent to the AI.
- `responseRaw`: The original string returned.
- `tokensUsed`: (Future) For cost analysis.

### Error Handling & Validation
Robust error handling ensures production readiness.

*   **AI Timeout & Failure**: If the AI API fails or times out, we catch the error, log the incident with `status: "failed"` in `AIRequestLog`, and throw a graceful error to the client.
*   **Invalid JSON Handling**: Our `aiProvider.js` attempts to parse JSON. If it fails (even after regex cleaning), we throw a specific "Invalid JSON" error. The system does not save corrupted data.
*   **Category Validation**: Even if AI returns a category, `categoryService.js` strictly checks it against `src/utils/categories.js`. Invalid categories trigger an error, preventing database pollution.
*   **Missing Impact Factors**: In Module 3, if a product lacks impact data (e.g. `plasticSavedFactor`), the calculator defaults to 0 safely, ensuring the order can still be processed without crashing.

---

## Future Modules (Outlined)

### Module 2: AI B2B Proposal Generator
**Concept**: Generate custom wholesale proposals for potential B2B clients.

**Architecture**:
1. **Input**: Company Name, Industry (e.g., "Hospitality"), Request Details.
2. **Retrieval**: Service layer queries DB for products matching the "Industry" tag.
3. **Calculation**: `pricingService` calculates bulk discounts (Tier 1: 10%, Tier 2: 15%).
4. **AI Generation**: 
   - Takes the product list + calculated prices.
   - Generates a professional email body and proposal summary.
   - **Constraint**: Cannot change prices, only format the text.
5. **Output**: JSON payload used by frontend to generate a PDF.

**Schema Extension**:
- `Proposal` model: `{ clientId, industry, products: [{id, customPrice}], status, aiSummary }`

### Module 4: AI WhatsApp Support Bot
**Concept**: Automated customer support for order tracking and product FAQs.

**Architecture**:
1. **Webhook Controller**: Receives WhatsApp webhook events (Twilio/Meta API).
2. **Intent Classification**:
   - AI determines intent: `TRACK_ORDER`, `PRODUCT_question`, `HUMAN_HANDOFF`.
3. **Service Routing**:
   - `TRACK_ORDER`: Queries `Order` model by phone number. Returns status directly (Deterministic).
   - `PRODUCT_question`: Uses **RAG (Retrieval Augmented Generation)**.
     - Search valid product descriptions in DB.
     - AI interprets user question + product context -> Answers.
   - `HUMAN_HANDOFF`: Flags conversation in DB.
4. **Safety**:
   - Rate limiting to prevent abuse.
   - Validated responses to avoid "jailbreaks".

## Demo Flow

For a quick verification of the core functionality:

1.  **Create Product (Module 1)**:
    *   POST to `/api/categories/create-product` with a title and description.
    *   AI will categorize it (e.g., "Kitchenware") and generate tags.
    *   Verify the product is stored in MongoDB with the `category` field filled correctly.

2.  **Create Order (Module 3)**:
    *   POST to `/api/impact/orders` with the productId from step 1.
    *   The backend calculates plastic saved (Quantity * Factor).
    *   AI will enhance this with a narrative statement ("You saved 0.5kg of plastic!").
    *   Verify the order is stored with the structured `impactReport`.

3.  **View AI Logs**:
    *   Check the `AIRequestLog` collection in MongoDB.
    *   You will see the exact prompts sent and the structured JSON responses received.

