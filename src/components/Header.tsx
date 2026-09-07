import React from 'react';
import { Sparkles, Bell, Settings as SettingsIcon, CloudCheck, CloudOff, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { InflationMirrorLogo } from './InflationMirrorLogo';

export const Header: React.FC = () => {
  const { 
    profile, 
    settings, 
    unreadAlertsCount, 
    setIsSettingsOpen, 
    setIsAlertsOpen,
    currentUser,
    isFirestoreSynced
  } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <InflationMirrorLogo 
            size="md" 
            onClick={() => setIsSettingsOpen(true)} 
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight text-white truncate">
                Inflation Mirror
              </h1>
              {settings.isDemoData && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono-num font-bold tracking-wider uppercase text-amber-300 bg-amber-500/15 border border-amber-500/30 rounded-md shrink-0">
                  DEMO DATA
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {profile.name ? `Hey ${profile.name.split(' ')[0]} 🎓` : 'Track. Understand. Plan.'}
            </p>
          </div>
        </div>

        {/* Action icons & PWA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Firebase Cloud Status Pill */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title={
              currentUser?.email 
                ? `Firebase Firestore Synced (${currentUser.email})` 
                : isFirestoreSynced 
                  ? 'Firebase Firestore Connected' 
                  : 'Click to connect Firebase Cloud Sync'
            }
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-medium transition"
          >
            {isFirestoreSynced ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span className="text-teal-300 flex items-center gap-1 text-[10px]">
                  <Flame className="w-3 h-3 text-orange-400" />
                  {currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Cloud Synced'}
                </span>
              </>
            ) : (
              <>
                <Flame className="w-3 h-3 text-amber-400" />
                <span className="text-slate-300 text-[10px]">Connect Cloud</span>
              </>
            )}
          </button>

          <PWAInstallButton />

          {/* Alerts Notification Bell */}
          <button
            onClick={() => setIsAlertsOpen(true)}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition"
            aria-label="Alerts and Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-slate-950">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Profile & Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition"
            aria-label="Profile and Settings"
          >
            {currentUser?.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="User Avatar" 
                className="w-4 h-4 rounded-full object-cover" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <SettingsIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
