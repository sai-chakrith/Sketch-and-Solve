document.addEventListener("DOMContentLoaded", () => {
    // Get elements
    const canvas = document.getElementById("draw-area");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const clearBtn = document.getElementById("clear-btn");
    const submitBtn = document.getElementById("submit-btn");
    const questionElement = document.getElementById("question");
    const questionBox = document.getElementById("question-box");
    const userNameDisplay = document.getElementById("user-name");
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    const penBtn = document.getElementById("pen-btn");
    const eraserBtn = document.getElementById("eraser-btn");
    const sizeSlider = document.getElementById("size-slider");

    let isDrawing = false;
    let currentTool = "pen";
    let currentSize = 5;
    let lastX = 0;
    let lastY = 0;
    let questions = [];
    let currentQuestion = "";

    async function fetchQuestions() {
        try {
            const response = await fetch('/api/questions');
            const data = await response.json();
            if (data.success && data.questions.length > 0) {
                const random = data.questions[Math.floor(Math.random() * data.questions.length)];
                currentQuestion = random.question;
                questionElement.textContent = random.question;
                questionBox.dataset.id = random._id; // ✅ Store the ID here
            } else {
                questionElement.textContent = "No questions available.";
            }
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            questionElement.textContent = "Error loading question.";
        }
    }

    const storedName = localStorage.getItem("username") || prompt("Please enter your name:", "Guest");
    localStorage.setItem("username", storedName || "Guest");
    userNameDisplay.textContent = `Hello, ${storedName || "Guest"}!`;

    function initCanvas() {
        resizeCanvas();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        updateBrush();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        const container = canvas.parentElement;
        const containerStyle = getComputedStyle(container);
        const paddingX = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
        const paddingY = parseFloat(containerStyle.paddingTop) + parseFloat(containerStyle.paddingBottom);
        const toolsHeight = document.querySelector('.tools').offsetHeight;
        const availableWidth = container.clientWidth - paddingX;
        const availableHeight = container.clientHeight - paddingY - toolsHeight - 10;
        const size = Math.min(availableWidth, availableHeight);
        canvas.width = size;
        canvas.height = size;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        updateBrush();
    }

    function updateBrush() {
        ctx.lineWidth = currentSize;
        if (currentTool === "pen") {
            ctx.strokeStyle = "#000000";
            ctx.globalCompositeOperation = "source-over";
        } else {
            ctx.strokeStyle = "white";
            ctx.globalCompositeOperation = "destination-out";
        }
    }

    function startDrawing(e) {
        isDrawing = true;
        const { offsetX, offsetY } = getCoordinates(e);
        lastX = offsetX;
        lastY = offsetY;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        ctx.arc(offsetX, offsetY, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function draw(e) {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        lastX = offsetX;
        lastY = offsetY;
    }

    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            ctx.closePath();
        }
    }

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.type.includes('touch')) {
            const touch = e.touches[0] || e.changedTouches[0];
            return {
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top
            };
        } else {
            return {
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top
            };
        }
    }

    penBtn.addEventListener("click", () => {
        currentTool = "pen";
        penBtn.classList.add("active");
        eraserBtn.classList.remove("active");
        updateBrush();
    });

    eraserBtn.addEventListener("click", () => {
        currentTool = "eraser";
        eraserBtn.classList.add("active");
        penBtn.classList.remove("active");
        updateBrush();
    });

    sizeSlider.addEventListener("input", (e) => {
        currentSize = e.target.value;
        updateBrush();
    });

    clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your drawing?")) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    });

    submitBtn.addEventListener("click", async () => {
        const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const isCanvasBlank = !pixelData.some(channel => channel !== 255);

        if (isCanvasBlank) {
            showNotification("Please draw something before submitting!", "error");
            return;
        }

        const base64Image = canvas.toDataURL("image/png", 0.5).split(',')[1]; // 50% compression

        const username = localStorage.getItem("username") || "Guest";
        const questionId = questionBox.dataset.id; // ✅ get the ID from HTML

        try {
            const response = await fetch('http://localhost:3000/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageData: base64Image,
                    questionId,
                    username
                })
            });

            const result = await response.json();

            if (result.success) {
                showNotification(`You drew: ${result.caption} (${result.correct ? "✅ Correct" : "❌ Incorrect"})`);

                setTimeout(() => {
                    fetchQuestions(); // reload question
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }, 2000);
            } else {
                showNotification("Prediction failed. Try again!", "error");
            }
        } catch (error) {
            console.error("Prediction error:", error);
            showNotification("Error connecting to prediction service", "error");
        }
    });

    function showNotification(message, type = "success") {
        notificationMessage.textContent = message;
        notification.style.backgroundColor = type === "error" ? "#f44336" : "#03dac6";
        notification.classList.add("show");
        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        draw(e);
    });
    canvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        stopDrawing();
    });

    initCanvas();
    fetchQuestions();
});
