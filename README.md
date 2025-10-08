# Modern Resume Builder

An interactive and feature-rich resume builder that empowers users to craft professional resumes with ease. Offers a variety of templates, customizable sections, drag-and-drop functionality, and real-time editing.

<!-- ![Resume Builder Screenshot](https://placeholder.svg?height=400&width=800) -->

---

## ✨ Features

- **Multiple Templates** – Choose from elegant, double-column, timeline, and other modern templates
- **Drag-and-Drop Interface** – Intuitively rearrange resume sections
- **Real-Time Editing** – Instantly preview changes as you type
- **Customizable Sections** – Add, remove, or tweak sections such as:

  - Education
  - Work Experience
  - Skills
  - Languages
  - Achievements
  - Custom Sections

- **PDF Export** – Download your resume as a polished PDF
- **Responsive Design** – Fully functional on desktop and tablet
- **Undo/Redo** – Maintain full edit history with undo/redo support
- **Photo Upload** – Option to add a professional headshot

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16.x or higher
- npm or Yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/r00tmebaby/Enhance-CV-Builder.git
cd Enhance-CV-Builder

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` in your browser to get started.

---

## 🧑‍💻 Usage Guide

### Creating a New Resume

1. A sample resume is preloaded when you open the app
2. Click on any section to begin editing
3. Use the sidebar to add sections, switch templates, or download your resume

### Editing Content

- Click directly on text to edit
- Use the floating toolbar to add entries or tweak settings
- Right-click entries for additional options like visibility controls

### Rearranging Sections

1. Click **"Rearrange"** in the sidebar
2. Drag and drop to reorder
3. Click **"Continue Editing"** to apply changes

### Changing Templates

1. Open the **"Templates"** tab in the sidebar
2. Preview available templates
3. Click **"Apply Template"** to use the selected one

### Exporting Your Resume

1. Click **"Download"** in the sidebar
2. The resume will be exported as a PDF
3. Filename is auto-generated using your name (e.g., `john_doe_resume.pdf`)

---

## ⚙️ Architecture Overview

Built with a modern React architecture powered by Next.js and Redux.

### 🧩 Core Components

- **ResumeBuilder** – Central app logic and layout
- **Sidebar** – Tools for resume management and actions
- **ResumeTemplates** – Elegant, double-column, and timeline template components
- **ResumeSection** – Dynamically renders different resume sections
- **EditableText** – Inline content editor for seamless text updates

### 🗂 State Management (Redux)

- `resumeSlice` – Manages resume data and sections
- `settingsSlice` – Handles template choice and UI settings
- `uiSlice` – Controls modals, loading, and general UI state

### 📄 PDF Export Flow

A dedicated module:

1. Captures the resume DOM
2. Processes it for accurate rendering
3. Generates a downloadable PDF

---

## 🛠 Tech Stack

- **Next.js** – Fullstack React framework
- **TypeScript** – Type-safe development
- **Redux Toolkit** – Scalable state management
- **Tailwind CSS** – Utility-first CSS styling
- **shadcn/ui** – Beautiful component library
- **hello-pangea/dnd** – For drag-and-drop functionality
- **html2canvas** & **jsPDF** – For PDF generation
- **Framer Motion** – Smooth animations and transitions

---

## 📁 Project Structure

```
Enhance-CV-Builder/
├── app/                  # Next.js app directory
├── components/           # React components
│   ├── ui/               # shadcn UI components
│   ├── resume-*.tsx      # Resume-specific components
│   └── ...
├── lib/                  # Utilities and Redux store
│   ├── features/         # Redux slices
│   ├── pdf-export.ts     # PDF generation module
│   ├── store.ts          # Redux store config
│   └── types.ts          # Type definitions
├── public/               # Static assets
│   └── templates/        # Template thumbnails
└── ...
```

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create your feature branch

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. Commit your changes

   ```bash
   git commit -m "Add amazing feature"
   ```

4. Push your branch

   ```bash
   git push origin feature/amazing-feature
   ```

5. Open a Pull Request

---

## 📄 License

Licensed under the [MIT License](./LICENSE).

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for components
- [hello-pangea/dnd](https://github.com/hello-pangea/dnd) for drag-and-drop
- [html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://parall.ax/products/jspdf) for PDF export

---

Built with ❤️ by **r00tmebaby**

---
