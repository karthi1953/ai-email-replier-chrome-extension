#  AI Email Replier — Chrome Extension

**AI Email Replier** is a free Chrome Extension that helps you generate quick, intelligent email replies using AI — directly inside Gmail.  
Built with **React (Vite)** for the frontend and **Spring Boot** for the backend.

---

## 🚀 Features
- ✨ AI-powered email reply generator  
- 📩 Works directly on **Gmail**  
- ⚡ Lightweight and privacy-friendly  
- ☁️ Backend hosted on Render  
- 🧠 100% free and open-source  

---
## 🛠️ Installation (Manual Setup — Free)

Follow these steps to install and use the extension **without paying the Chrome Web Store fee**.

### 1️⃣ Download the Extension
- Click the **Code → Download ZIP** button on this GitHub repository.  
- Extract the ZIP file somewhere on your computer (e.g. Desktop).  

### 2️⃣ Load It into Chrome
1. Open Google Chrome and visit:
chrome://extensions/
2. Enable **Developer Mode** (top-right corner toggle).  
3. Click **“Load unpacked”**.  
4. Select your extracted project folder (`ai-email-replier/`).  

✅ You’ll now see the **AI Email Replier** icon appear in your Chrome toolbar!

---

## ✉️ How to Use
1. Go to **[Gmail](https://mail.google.com)**.  
2. Open or compose an email.  
3. Click the **AI Email Replier** icon or in-mail button (depending on your setup).  
4. Wait a few seconds — your smart AI-generated reply will appear!  

---
## 🧠 How It Works
1. The extension injects a “Generate Reply” button inside Gmail.  
2. When clicked, it sends the current email text to the backend AI API.  
3. The backend processes the content and sends back a smart reply suggestion.  

---

## ⚙️ Backend Setup
https://email-replier-backend.onrender.com/

---

## 🧩 Technical Stack
| Layer | Technology |
|--------|-------------|
| Frontend | React (Vite) |
| Backend | Spring Boot (Java) |
| Hosting | Render (Backend), GitHub (Frontend) |
| Chrome Manifest | Version 3 |

---

## 🧠 Folder Structure

This extension communicates with the following backend API:
ai-email-replier/
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── content.css
├── icon.png
└── README.md


---

## 📸 Icon
The project includes a modern AI mail icon (`icon.png`) for the extension toolbar.

---

## 🤝 Contributing
Pull requests are welcome!  
For any major updates or suggestions, open an **Issue** first to discuss your idea.

---

## 📜 License
This project is licensed under the **MIT License**.  
You’re free to use, modify, and share it with attribution.

---

## 🧑‍💻 Author
**Karthik G**  
