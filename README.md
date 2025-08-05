# Sketch & Solve - Doodle-Based Learning Platform

## Overview

**Sketch & Solve** is a web-based educational platform where students draw responses to teacher-posed questions. The system automatically evaluates drawings using AI-powered image captioning. It supports three user roles:

- **Teacher**
- **Student**
- **Parent**

Each role has its own portal with customized functionality.

---

## 📁 Folder Structure

```
SketchAndSolve/
├── public/ (Frontend - HTML, CSS, JS)
│   ├── Student Webpage
│   ├── Teacher Webpage
│   ├── Parent Webpage
│   ├── Hangman.html (Game)
│   └── index.html (Login Page)
│
├── models/ (MongoDB Schemas)
│   ├── User.js
│   ├── Question.js
│   ├── Result.js
│   └── Announcement.js
│
├── server.js (Backend - Node.js + Express + MongoDB)
├── README.md
```

---

## 📦 Dependencies & Setup

### 🔧 Backend (Node.js + Express + MongoDB)

Install dependencies:

```bash
npm install express mongoose body-parser bcrypt express-session cors multer axios
```

### 🧠 AI Captioning with Ollama (LLaVA model)

1. **Install Ollama**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

2. **Pull LLaVA Model**

```bash
ollama pull llava:7b
```

3. **Start Ollama Server**

```bash
ollama serve
```

> LLaVA runs locally and is used to caption student drawings (base64 PNG images).

---

## 🚀 How to Run the Server

```bash
node server.js
```

Then, visit: [http://localhost:3000](http://localhost:3000)

---

## 👨‍🏫 Teacher Portal Guide

### 1. Create an Account

- Click **Register**
- Use an email starting with `teacher` (e.g., `teacher_john@example.com`)

### 2. Add Drawing Questions

- Go to **Add Questions**
- Fill in:
  - **Question** (e.g., Draw an Apple)
  - **Category** (e.g., Fruit)
  - **Expected Answer** (used for AI comparison)

### 3. Post Announcements

- Go to **Announcements**
- Fill in the form (title and message)
- Announcements are visible to students and parents

### 4. View Student Results

- Go to **View Student Results**
- See image, generated caption, expected answer, and correctness

---

## 👨‍🎓 Student Portal Guide

### 1. Create an Account

- Register with any unique email (except teacher/parent prefixes)

### 2. Attempt Drawing

- Login
- Navigate to **Draw**
- A drawing prompt is shown (e.g., Draw a Bird)
- Use the canvas tools (pen/eraser)
- Submit the drawing
- The system evaluates it via AI and stores the result

### 3. View Results

- Navigate to **Results**
- View your drawing, generated caption, expected answer, and correctness

### 4. View Announcements

- Navigate to **Announcements**
- View messages posted by teachers

---

## 👨‍👩‍👦 Parent Portal Guide

### 1. Create an Account

- Register using an email starting with `parent` (e.g., `parent_sam@example.com`)

### 2. View All Student Results

- Go to **Results**
- View all student results, including drawing, caption, and evaluation

### 3. View Announcements

- Go to **Announcements**
- Read all updates from teachers

---

## 📌 Notes

- MongoDB URL: `mongodb://localhost:27017/teacherPage`
- Images submitted are base64 PNG
- Captions are generated in real-time using Ollama + LLaVA
- Session management via `express-session`

---

## 💬 Questions or Issues?

Feel free to contact the project maintainer.

---

## 👤 Contact / Team Info

**Developed By:**

- SRI SOMESH S - CB.AI.U4AID23141
- SRIASWATH - CB.AI.U4AID23142
- SAI CHAKRITH - CB.AI.U4AID23143
- SURIYA DARSAUN - CB.AI.U4AID23144

**University:** Amrita Vishwa Vidyapeetham

