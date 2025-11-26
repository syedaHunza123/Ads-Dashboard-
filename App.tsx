import React, { useState, useEffect } from 'react';
import { User, ViewState, Ad } from './types';
import * as StorageService from './services/storageService';
import { Login, Register } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { AdEditor } from './pages/AdEditor';
import { LayoutDashboard, LogOut, Plus, User as UserIcon, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  // Check auth on mount
  useEffect(() => {
    const currentUser = StorageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setView(ViewState.DASHBOARD);
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    StorageService.logoutUser();
    setUser(null);
    setView(ViewState.LOGIN);
  };

  const navigateToCreate = () => {
    setEditingAd(null);
    setView(ViewState.CREATE_AD);
  };

  const navigateToEdit = (ad: Ad) => {
    setEditingAd(ad);
    setView(ViewState.EDIT_AD);
  };

  const navigateToDashboard = () => {
    setEditingAd(null);
    setView(ViewState.DASHBOARD);
  };

  // --- Render Views ---

  if (!user) {
    // No wrapping div here, let the Auth components handle the layout
    return view === ViewState.REGISTER ? (
      <Register 
        onSuccess={handleLogin} 
        onSwitchToLogin={() => setView(ViewState.LOGIN)} 
      />
    ) : (
      <Login 
        onSuccess={handleLogin} 
        onSwitchToRegister={() => setView(ViewState.REGISTER)} 
      />
    );
  }

  // Authenticated Layout
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar / Navigation */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex-shrink-0 md:h-screen sticky top-0 z-30 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          {/* Professional Logo */}
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 transform transition-transform hover:scale-105">
             <Sparkles className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
             <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 leading-none">
               AdGenius
             </h1>
             <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase mt-0.5">Admin Console</span>
          </div>
        </div>
        
        <div className="p-4 flex flex-col h-[calc(100vh-88px)] justify-between">
          <nav className="space-y-2 mt-2">
            <button 
              onClick={navigateToDashboard}
              className={`group w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${view === ViewState.DASHBOARD ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <LayoutDashboard className={`w-5 h-5 transition-colors ${view === ViewState.DASHBOARD ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={navigateToCreate}
              className={`group w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${view === ViewState.CREATE_AD ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Plus className={`w-5 h-5 transition-colors ${view === ViewState.CREATE_AD ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
              <span>Create Campaign</span>
            </button>
          </nav>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center p-3 space-x-3 mb-3 bg-slate-50/80 rounded-xl border border-slate-100">
               {user.avatar ? (
                 <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-white ring-2 ring-white shadow-sm" />
               ) : (
                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                   <UserIcon className="w-5 h-5 text-slate-500" />
                 </div>
               )}
               <div className="overflow-hidden">
                 <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                 <p className="text-xs text-slate-500 truncate">{user.email}</p>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50/50 p-4 md:p-8 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          {view === ViewState.DASHBOARD && (
            <Dashboard onEditAd={navigateToEdit} onCreateAd={navigateToCreate} />
          )}
          {(view === ViewState.CREATE_AD || view === ViewState.EDIT_AD) && (
            <AdEditor 
              existingAd={editingAd} 
              onBack={navigateToDashboard} 
              onSaved={navigateToDashboard}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;