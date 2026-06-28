import { CheckCircle, TrendingUp, Users, BarChart2, BookOpen, Brain, Target } from 'lucide-react';


const FEATURES = [
  { icon: TrendingUp, title: 'Increase Student Engagement' },
  { icon: BarChart2, title: 'Improve Course Completion Rates' },
  { icon: Users, title: 'Reduce Student Dropout Rates' },
  { icon: BookOpen, title: 'Encourage Daily Study Consistency' },
  { icon: Brain, title: 'Monitor Real-Time Student Progress' },
  { icon: Target, title: 'Make Data-Driven Mentoring Decisions' },
];

export default function AboutUs() {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Hero */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="h-32 bg-gradient-to-br from-slate-800 to-blue-900 flex items-center justify-center">
          <TrendingUp size={48} className="text-blue-400 opacity-80" />
        </div>
        <div className="p-6 text-center">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-3 leading-tight">
            Transforming Student Engagement into Course Completion
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto">
            We help educators, mentors, coaching institutes, and course creators improve student engagement,
            increase course completion rates, and reduce dropouts through intelligent progress tracking and automation.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Many students purchase courses with good intentions but struggle to stay consistent throughout their preparation journey.
          As a result, course completion rates decline, engagement drops, and mentors have limited visibility into student progress.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Our platform bridges this gap by providing a complete student engagement and syllabus completion system designed to
          keep learners accountable, motivated, and on track every day.
        </p>
      </div>

      {/* What We Help Achieve */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-5">
          <CheckCircle size={18} className="text-blue-500" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">What We Help Educators Achieve</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map(({ icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center pb-4">
        <p className="text-xs text-slate-400 dark:text-slate-500">StudyFlow v1.0.0 · Built for SBI PO aspirants</p>
      </div>
    </div>
  );
}
