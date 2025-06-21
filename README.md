# GATE CS Tracker 🎯

A personalized GATE (Computer Science) preparation tracker built using **React** and **Firebase**. This app helps students efficiently manage their study routine, track topic-wise progress, and stay consistent with mock tests — all in one modern, dashboard-style interface.

---

## 📌 Features

- ✅ **Subject-Wise Progress Tracking**
  - Visual pie charts for each subject based on subtopic completion
  - Interactive checkboxes for each topic and subtopic

- ⏱️ **Study Session Timer**
  - Start/Stop timer to track actual study time
  - Time logs stored and visualized

- 📅 **LeetCode-Style Study Calendar**
  - Highlights days with study sessions
  - Hover to see how much time was spent each day

- 🧪 **Mock Test Tracker**
  - Mark completed tests
  - See completion percentage, last test date, and next scheduled test
  - Line graph for test score trends (Firebase integration ready)

- 🧠 **(Coming Soon)**: AI-based suggestions using OpenAI
  - Weekly study goals based on progress
  - Smart mock test recommendations

---

## 🔧 Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Firebase Realtime Database, Firebase Auth
- **Charts & UI**:
  - `Recharts` for Pie and Line charts
  - `lucide-react`, `shadcn/ui` for UI components
- **Auth**: Firebase Email/Password

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/MansviPunekar/gate-cs-tracker.git
cd gate-cs-tracker
