import React, { useEffect, useState, useMemo } from 'react';
import { Ad } from '../types';
import * as StorageService from '../services/storageService';
import { Button, Badge } from '../components/UIComponents';
import { Edit2, Trash2, Plus, Search, Image as ImageIcon, Filter, TrendingUp, FileText, PlayCircle, Clock, Check, X, Sparkles } from 'lucide-react';

interface DashboardProps {
  onCreateAd: () => void;
  onEditAd: (ad: Ad) => void;
}

const StatCard = ({ title, value, icon, colorClass }: { title: string, value: number, icon: React.ReactNode, colorClass: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 transform">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{value}</h4>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ onCreateAd, onEditAd }) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'paused'>('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    refreshAds();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const refreshAds = () => {
    const loadedAds = StorageService.getAds();
    setAds(loadedAds);
  };

  const handleInitialDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(null);
  };

  const handleConfirmDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 1. Delete from storage
    StorageService.deleteAd(id);
    
    // 2. Update UI
    setAds(prevAds => prevAds.filter(ad => ad.id !== id));
    setDeletingId(null);
  };

  const handleEditClick = (e: React.MouseEvent, ad: Ad) => {
    e.preventDefault();
    e.stopPropagation();
    onEditAd(ad);
  };

  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(search.toLowerCase()) || 
                            ad.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterStatus === 'all' || ad.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [ads, search, filterStatus]);

  const stats = useMemo(() => ({
    total: ads.length,
    active: ads.filter(a => a.status === 'active').length,
    drafts: ads.filter(a => a.status === 'draft').length,
  }), [ads]);

  return (
    <div className={`space-y-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Section - Redesigned */}
      <div className="relative bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm overflow-hidden group">
         {/* Decorative backgrounds */}
         <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
         <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>

         <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
               <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 transform transition-transform group-hover:rotate-3 duration-500">
                  <Sparkles className="w-7 h-7" strokeWidth={2.5} />
               </div>
               <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                     Campaign <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Dashboard</span>
                  </h1>
                  <p className="text-slate-500 font-medium mt-1 max-w-lg">
                     Manage your creative assets, track real-time performance, and optimize campaigns with AI.
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-center">
               <div className="flex flex-col items-end px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Last Updated</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-mono font-medium text-slate-700">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Campaigns" 
          value={stats.total} 
          icon={<FileText className="w-6 h-6" />} 
          colorClass="bg-indigo-50 text-indigo-600" 
        />
        <StatCard 
          title="Active Ads" 
          value={stats.active} 
          icon={<PlayCircle className="w-6 h-6" />} 
          colorClass="bg-emerald-50 text-emerald-600" 
        />
        <StatCard 
          title="Drafts" 
          value={stats.drafts} 
          icon={<Clock className="w-6 h-6" />} 
          colorClass="bg-amber-50 text-amber-600" 
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search campaigns..." 
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Filter Dropdown */}
            <div className="relative hidden md:block">
                <select 
                    className="appearance-none pl-9 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer hover:bg-slate-50 transition-colors font-medium"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
        </div>

        <div className="w-full md:w-auto">
            <Button onClick={onCreateAd} icon={<Plus className="w-4 h-4" />} className="w-full md:w-auto shadow-lg shadow-indigo-200">
                Create Campaign
            </Button>
        </div>
      </div>

      {/* Content Grid */}
      {filteredAds.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ImageIcon className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No campaigns found</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            {search || filterStatus !== 'all' 
              ? 'Try adjusting your search filters to find what you are looking for.' 
              : 'Launch your first AI-powered advertisement campaign today.'}
          </p>
          {(!search && filterStatus === 'all') && (
            <Button onClick={onCreateAd} variant="primary" icon={<Plus className="w-4 h-4" />}>
              Start New Campaign
            </Button>
          )}
          {(search || filterStatus !== 'all') && (
             <Button onClick={() => {setSearch(''); setFilterStatus('all')}} variant="secondary">
                Clear Filters
             </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {filteredAds.map((ad, index) => (
            <div 
              key={ad.id} 
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden animate-fade-in-up relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Clickable Content Area - Separated for easier event handling */}
              <div 
                className="flex-1 flex flex-col cursor-pointer relative z-0"
                onClick={() => onEditAd(ad)}
              >
                {/* Card Header / Image */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  {ad.imageUrl ? (
                    <>
                      <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-slate-50 border-b border-slate-100 text-slate-300 group-hover:bg-slate-100 transition-colors">
                      <ImageIcon className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 shadow-sm z-10">
                    <Badge status={ad.status} />
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-5 pb-2 flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-slate-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                      {ad.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      {new Date(ad.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                      {ad.description}
                  </p>
                </div>
              </div>
              
              {/* Card Actions - High Z-Index to prevent click conflicts */}
              <div className="p-5 pt-2 mt-auto relative z-20 bg-white">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center text-xs text-slate-500 space-x-1.5 font-medium">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span>High Performance</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center h-9">
                      {deletingId === ad.id ? (
                         <div className="flex items-center bg-red-50 rounded-lg p-1 space-x-1 animate-in fade-in zoom-in duration-200">
                            <span className="text-[10px] font-bold text-red-600 px-2 uppercase">Delete?</span>
                            <button
                                onClick={(e) => handleConfirmDelete(e, ad.id)}
                                className="p-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm"
                                title="Confirm Delete"
                            >
                                <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="p-1 bg-white text-slate-600 rounded-md hover:bg-slate-100 transition-colors border border-slate-200"
                                title="Cancel"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                         </div>
                      ) : (
                        <div className="flex space-x-2">
                            <button 
                                type="button"
                                onClick={(e) => handleEditClick(e, ad)}
                                className="p-2 text-slate-500 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-slate-200 hover:border-indigo-200"
                                title="Edit Campaign"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                                type="button"
                                onClick={(e) => handleInitialDeleteClick(e, ad.id)}
                                className="p-2 text-slate-500 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all active:scale-90 focus:outline-none focus:ring-2 focus:ring-red-500/20 border border-slate-200 hover:border-red-200"
                                title="Delete Campaign"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                      )}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
            opacity: 0;
        }
      `}</style>
    </div>
  );
};
