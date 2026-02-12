# ZenSpace 🚀

A modern, minimal project management SaaS dashboard designed for seamless team collaboration, intelligent task tracking, and AI-assisted productivity.

![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2.0-purple?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 📊 Dashboard & Analytics
- **Real-time Dashboard**: Overview of projects, tasks, and team activity at a glance
- **Statistics Cards**: Track total projects, completed projects, and task progress
- **Activity Timeline**: Monitor team activity and project updates in real-time

### 📁 Project Management
- **Project Tracking**: Create, organize, and monitor projects with multiple status levels
  - Statuses: Active, Planning, Completed, On Hold, Cancelled
  - Priority levels: Low, Medium, High
  - Progress tracking with visual indicators
- **Project Details**: Deep-dive into individual projects with member assignments and timelines
- **File Assets**: Upload and manage project-related files
- **Comments & Collaboration**: Leave comments on projects and tasks for team discussion

### ✅ Task Management
- **Flexible Task Types**: Task, Bug, Feature, Improvement
- **Status Tracking**: Todo → In Progress → Done workflow
- **Task Assignment**: Assign tasks to specific team members
- **Priority Levels**: Organize tasks by urgency (Low, Medium, High)
- **Due Dates**: Track deadlines and identify overdue items
- **Activity Log**: Track when tasks are created and modified

### 👥 Team Collaboration
- **User Management**: Create and manage team members with different roles
- **User Roles**: Admin and Member roles with different permissions
- **Team View**: See all team members and their current workload
- **Workspace Management**: Switch between different workspaces
- **Member Profiles**: Avatars and email integration for quick identification

### 🌙 UI/UX Enhancements
- **Dark Mode**: Seamless dark/light mode toggle with system preference detection
- **Glass Morphism Design**: Modern UI with frosted glass effects
- **Responsive Layout**: Mobile-friendly design that works across all devices
- **Advanced Animations**: Smooth transitions powered by GSAP and Framer Motion
- **Custom Cursor**: Interactive blob cursor effect for enhanced user experience
- **Cinematic Background**: Animated background effects in dark mode

### 🤖 AI Integration
- **Google Generative AI**: Leverages Google Gemini API for intelligent features
- **AI-Assisted Productivity**: Smart suggestions and automations (infrastructure ready)

## 🛠️ Tech Stack

### Frontend
- **React 19.0.0**: Latest React with concurrent features
- **TypeScript 5.8.2**: Type-safe development
- **Vite 6.2.0**: Lightning-fast build tool and dev server
- **React Router DOM 7.0.0**: Client-side routing and navigation

### Styling & Animations
- **Tailwind CSS**: Utility-first CSS framework (via class names)
- **Framer Motion 11.13.1**: Production-ready animations
- **GSAP 3.12.5**: Professional animation library
- **Lucide React 0.471.0**: Beautiful and consistent icon library

### 3D Graphics & UI
- **OGL 1.0.11**: WebGL library for 3D graphics

### AI & APIs
- **@google/genai 1.40.0**: Google Generative AI integration

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/zenspace.git
cd zenspace
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
zenspace/
├── components/              # Reusable UI components
│   ├── ActivitySidebar.tsx    # Activity panel
│   ├── BlobCursor.tsx         # Custom cursor effect
│   ├── DarkVeil.tsx           # Animated background
│   ├── GlobalModals.tsx       # Global modal components
│   ├── Layout.tsx             # Main layout wrapper
│   ├── Navbar.tsx             # Top navigation bar
│   ├── Sidebar.tsx            # Left navigation sidebar
│   ├── StatsCard.tsx          # Statistics display card
│   └── ...
├── pages/                   # Page components
│   ├── Dashboard.tsx          # Main dashboard
│   ├── Landing.tsx            # Landing page
│   ├── Login.tsx              # Authentication
│   ├── Projects.tsx           # Projects listing
│   ├── ProjectDetails.tsx     # Project details view
│   ├── Tasks.tsx              # Tasks management
│   ├── Team.tsx               # Team management
│   └── Settings.tsx           # User settings
├── store/                   # State management
│   └── useStore.ts           # Global store hook with localStorage sync
├── types.ts                 # TypeScript type definitions
├── constants.tsx            # Mock data and constants
├── App.tsx                  # Main app component and routing
├── index.tsx                # React DOM entry point
└── vite.config.ts          # Vite configuration
```

## 📊 Data Types

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Member';
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Planning' | 'Completed' | 'On Hold' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High';
  progress: number;
  startDate: string;
  endDate: string;
  leadId: string;
  memberIds: string[];
}
```

### Task
```typescript
interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Done';
  type: 'Task' | 'Bug' | 'Feature' | 'Improvement';
  priority: 'Low' | 'Medium' | 'High';
  assigneeId: string;
  dueDate: string;
  createdAt: string;
}
```

## 🎨 Design Features

### Glass Morphism
The application uses modern glass morphism design patterns for a premium, modern look.

### Responsive Design
- Mobile-first approach for all pages
- Tablet and desktop optimized layouts
- Adaptive navigation and components

### Dark Mode
- System preference detection
- Smooth transitions between light and dark themes
- Custom dark mode optimizations throughout the app

### Performance Optimizations
- Lazy loading for routes
- Optimized animations with GSAP
- Efficient state management with localStorage
- Vite's optimized build process

## 🗄️ Storage

ZenSpace uses **localStorage** for persistent data storage:
- Authentication status
- User preferences (dark mode)
- Projects and tasks
- Team members
- Files and comments
- Workspace settings

Perfect for development and small-to-medium deployments. For production, integrate with a backend database.

## 🔐 Authentication

The application includes a basic authentication system:
- Login page for user authentication
- Protected routes (requires authentication)
- Session persistence via localStorage
- Role-based access control (Admin/Member)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev) for the UI framework
- [Vite](https://vitejs.dev) for the build tool
- [Tailwind CSS](https://tailwindcss.com) for styling
- [GSAP](https://gsap.com) for animations
- [Framer Motion](https://www.framer.com/motion) for React animations
- [Google Generative AI](https://ai.google.dev) for AI integration
- [Lucide Icons](https://lucide.dev) for the icon library

## 📧 Support

For support, email support@zenspace.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Backend database integration
- [ ] Real-time collaboration features
- [ ] Advanced AI-powered insights
- [ ] Mobile app (React Native)
- [ ] Integrations with popular tools (Slack, Jira, etc.)
- [ ] Advanced reporting and analytics
- [ ] SSO and enterprise authentication
- [ ] Custom workflows and automations

---

**Made with ❤️ by the ZenSpace Team**

demo@example.com / Demo@123