import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TestTube,
  FileText,
  Download,
  Library,
  Sparkles,
} from 'lucide-react';
import { BuilderActionsRefProvider } from '@/contexts/BuilderActionsRefContext';
import { BuilderTamboToolRegistration } from '@/components/builder/BuilderTamboToolRegistration';

const navigation = [
  { name: 'Builder', href: '/builder', icon: LayoutDashboard },
  { name: 'Component Lab', href: '/component-lab', icon: TestTube },
  { name: 'Templates', href: '/template-studio', icon: FileText },
  { name: 'Export', href: '/export-center', icon: Download },
  { name: 'Library', href: '/library-manager', icon: Library },
  { name: 'Analyzer', href: '/design-analyzer', icon: Sparkles },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <BuilderActionsRefProvider>
      <BuilderTamboToolRegistration />
      <div className="h-screen flex bg-slate-950">
        <div className="w-20 bg-slate-900 flex flex-col items-center py-4 space-y-4 border-r border-slate-800 shrink-0">
          <Link
            to="/builder"
            className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center shrink-0"
          >
            <span className="text-white font-bold text-xl">F</span>
          </Link>
          <nav className="flex-1 flex flex-col space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    w-14 h-14 rounded-lg flex items-center justify-center shrink-0
                    transition-colors relative group
                    ${
                      isActive
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                  title={item.name}
                >
                  <Icon className="w-6 h-6" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-1 overflow-hidden min-w-0">
          <Outlet />
        </div>
      </div>
    </BuilderActionsRefProvider>
  );
}
