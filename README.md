# Image Measurement Extraction API and Supply Control

This project is a backend system built with Fastify and Node.js 22, integrated with Google's AI to read measurement values from base64-encoded images (e.g., analog water or gas meters). The system processes the image, extracts the value, and returns the result along with a temporary image URL. If necessary, the value can be manually corrected via a dedicated endpoint.

---

## Getting Started

### ✅ Requirements

- Node.js v22+
- npm (or pnpm/yarn)

### Installation

obs: use `` npm ci `` to restaure all dependecy listed in package-lock.json
```bash
git clone https://github.com/GibsonCS/gibson_shopper.git
cd gibson_shopper
npm ci
```

### Running the server

```bash
npm run dev
```

---

## 🧪 Testing

### Run unit tests

```bash
npm test
```

### View test coverage report

```bash
npm run test:cov
```

After running this command, a detailed code coverage report will be shown in the terminal, and an HTML version will be available inside the `/coverage` folder for visual inspection.

---

## API Overview

### **POST `/measurements`**

Processes an image and returns the extracted measurement.

#### Request Body
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...",
  "customer_code": "CUST123",
  "measure_datetime": "2025-05-05T14:30:00Z",
  "measure_type": "WATER"
}
```

#### Response Body
```json
{
  "image_url": "https://yourdomain.com/temp-images/CUST123_20250505.jpg",
  "measure_value": 157,
  "measure_uuid": "1a2b3c4d-5678-90ef-ghij-klmnopqrstuv"
}
```

**obs: URL expires in 1 minute**

---

### **PATCH `/confirm`**

Corrects a previously recorded measurement value.

#### Request Body
```json
{
  "measure_uuid": "1a2b3c4d-5678-90ef-ghij-klmnopqrstuv",
  "corrected_value": 160
}
```

#### Response Body
```json
{
  "success": "true."
}
```

---

## 👹 DEMO 
https://github.com/user-attachments/assets/356accf5-c9e5-4690-b62f-c1c708f1c342

***


## 🖥️ Technologies Used

This backend project leverages a modern and efficient tech stack:

- **Node.js (v22)** – Modern JavaScript runtime built on Google’s V8 engine.
- **Fastify** – Lightweight and high-performance web framework for Node.js.
- **SQLite (native)** – Embedded relational database used directly with Node.js’s native `sqlite` support.
- **Zod** – TypeScript-first schema declaration and validation library.
- **Day.js** – Lightweight and performant date manipulation library.
- **TypeScript** – Strongly typed superset of JavaScript for scalable development.
- **TSX** – Modern runtime for executing TypeScript/ESM scripts easily.
- **Chai** – Assertion library for unit testing.
- **Sinon** – Standalone test spies, stubs, and mocks for JavaScript.
- **C8** – Code coverage tool powered by Node's V8 engine.
