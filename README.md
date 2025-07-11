# 🎬 YouTube Trimmer — Chrome Extension

**YouTube Trimmer** is a lightweight Chrome extension that allows you to trim YouTube videos between a custom start and end time — with optional looping. Perfect for repeating specific segments of a video like music, tutorials, or lectures.

---

## ✅ Features

- ⏱️ Play video from a specific `start` to `end` timestamp
- 🔁 Optional looping (enabled via checkbox)
- 💾 Remembers your last input when you reopen the popup
- 🔒 Doesn't collect or send any user data
- 📦 Lightweight and runs only on YouTube video pages

---

## 🧩 Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer Mode** (top right)
4. Click **"Load unpacked"** and select the folder where this extension is located.

---

## 🛠️ How to Use

1. Go to a YouTube video (e.g., `https://www.youtube.com/watch?v=...`)
2. Click the **YouTube Trimmer** extension icon.
3. Enter:
   - **Start Time**: in `hh:mm:ss` format (e.g., `1:01:30`)
   - **End Time**: in `hh:mm:ss` format (e.g., `1:03:00`)
4. (Optional) Check **"Enable Looping"** if you want the video to repeat between the times.
5. Click **Apply Trimmer**.
6. To stop trimming and looping, click **Stop Trimmer**.

> ⏸️ You can close the popup — the trimming will continue to work in the background.

---

## 🧠 Notes

- Works only on individual YouTube video pages (`youtube.com/watch?v=...`)
- The extension uses `chrome.storage.local` to remember your last input.
- Audio is buffered with a short delay after seeking to ensure smoother playback on loop.

---

## ❤️ Attribution & Donation

Made with ♥ by [Afarisphi](https://www.instagram.com/afarisphi/)

If you found this useful and want to support development, you can [💰 Pay What You Like on Trakteer](https://trakteer.id/qbvt)
