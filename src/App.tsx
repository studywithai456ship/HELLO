import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Achievements from './pages/Achievements';
import SubjectProgress from './pages/SubjectProgress';
import CoursePlan from './pages/CoursePlan';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import AboutUs from './pages/AboutUs';

function PageTitle({ title }: { title: string }) {
  if (title === 'Home') return null;
  return (
    <div className="mb-5">
      <h1 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h1>
    </div>
  );
}

function AppContent() {
  const { page } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PAGE_TITLES: Record<string, string> = {
    home: 'Home',
    achievements: 'Achievements',
    'subject-progress': 'Subject Progress',
    'course-plan': 'Course Plan',
    leaderboard: 'Leaderboard',
    settings: 'Settings',
    about: 'About Us',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AuthModal />

      <main className="flex-1 pt-14">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <PageTitle title={PAGE_TITLES[page] || ''} />
          {page === 'home' && <Home />}
          {page === 'achievements' && <Achievements />}
          {page === 'subject-progress' && <SubjectProgress />}
          {page === 'course-plan' && <CoursePlan />}
          {page === 'leaderboard' && <Leaderboard />}
          {page === 'settings' && <Settings />}
          {page === 'about' && <AboutUs />}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
