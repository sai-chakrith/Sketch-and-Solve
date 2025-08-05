==============================================================================================================
Sketch & Solve - Doodle-Based Learning Platform

==============================================================================================================
Overview

Sketch & Solve is a web-based educational platform where students draw responses to questions asked by teachers, and the system automatically evaluates the drawing using AI-powered image captioning. The platform supports different user roles: Teacher, Student, and Parent, each having their respective portals.

--------------------------------------------------------------------------------------------------------------

📁 Folder Structure

├── public (frontend - html + css + js)
│   ├── Student Webpage
│   ├── Teacher Webpage
│   ├── Parent Webpage
│   ├── Hangman.html (Game)
│   ├── index.html (Login Page)

├── models (Schema for mongoDB)
│   ├── User.js
│   ├── Question.js
│   ├── Result.js
│   └── Announcement.js

├── server.js (backend - Node.js + Express + MySQL)
├── README.md

--------------------------------------------------------------------------------------------------------------

📦 Dependencies & Setup

🔧 Backend (Node.js + Express + MongoDB)

Install these dependencies:

	npm install express mongoose body-parser bcrypt express-session cors multer axios

AI Captioning with Ollama (LLaVA model)

1. Install Ollama:

	curl -fsSL https://ollama.com/install.sh | sh

2. Pull the LLaVA model:

	ollama pull llava:7b

3.Start Ollama server:

	ollama serve

LLaVA runs locally and is used to caption student-drawn images.

--------------------------------------------------------------------------------------------------------------

🚀 How to Run the Server:

1. Start the server:

	node server.js

2.Visit the site:

	http://localhost:3000
---------------------------------------------------------------------------------------------------------------------

## 👨‍🏫 Teacher Portal Guide

### 1. Create an Account (Teacher)
- Click "Register"
- Use an email starting with `teacher` (e.g., `teacher_john@example.com`)
- Complete registration and login

### 2. Add Drawing Questions
- Navigate to **Add Questions**
- Fill the form with:
  - **Question**: e.g., Draw an Apple
  - **Category**: e.g., Fruit
  - **Expected Answer**: apple (used for AI comparison)

### 3. Post Announcements
- Go to **Announcements** tab
- Fill the form (title + message)
- Announcement will appear to students and parents

### 4. View Student Results
- Go to **View Student Results**
- See caption, image, and correctness

---------------------------------------------------------------------------------------------------------------------

## 👨‍🎓 Student Portal Guide

### 1. Create an Account (Student)
- Register using a unique email (not starting with teacher/parent)

### 2. Attempt Drawing
- Login
- Navigate to **Draw**
- A question appears (e.g., Draw a Bird)
- Use the canvas to draw with pen/eraser
- Click **Submit**
- System evaluates and stores the result

### 3. View Results
- Navigate to **Results**
- See caption, expected answer, correctness, image

### 4. View Announcements
- Navigate to **Announcements**
- See latest messages from teachers

---------------------------------------------------------------------------------------------------------------------

## 👨‍👩‍👦 Parent Portal Guide

### 1. Create an Account (Parent)
- Register with email starting with `parent` (e.g., `parent_sam@example.com`)
- After login, redirected to **Parent Portal**

### 2. View All Student Results
- Click **Results**
- See filtered student results for all users

### 3. View Announcements
- Navigate to **Announcements**
- View all updates from teachers

---------------------------------------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------------------------------------

## 📌 Notes
- MongoDB is required (runs at `mongodb://localhost:27017/teacherPage`)
- LLaVA model uses base64 PNG images
- Session management is handled via `express-session`
- Doodles are submitted and captioned in real time

---------------------------------------------------------------------------------------------------------------------

## 💬 Questions or Issues?
Feel free to contact the project maintainer .

=====================================================================================================================
Contact / Team Info
=====================================================================================================================
Developed by: \ ->  
SRI SOMESH S - CB.AI.U4AID23141, 
SRIASWATH - CB.AI.U4AID23142, 
SAI CHAKRITH - CB.AI.U4AID23143, 
SURIYA DARSAUN - CB.AI.U4AID23144

University: Amrita Vishwa Vidyapeetham  





