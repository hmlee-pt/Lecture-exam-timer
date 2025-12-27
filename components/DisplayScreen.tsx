
import React, { useState, useEffect, useRef } from 'react';
import { TimerMode } from '../App';

interface DisplayScreenProps {
  precautions: string;
  reminders: string;
  mode: TimerMode;
  durationSeconds: number;
  targetEndTime: string;
  onBack: () => void;
}

const DisplayScreen: React.FC<DisplayScreenProps> = ({
  precautions,
  reminders,
  mode,
  durationSeconds,
  targetEndTime,
  onBack,
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize remaining time based on mode
  useEffect(() => {
    if (mode === 'duration') {
      setRemainingTime(durationSeconds);
    } else {
      const calculateInitialRemaining = () => {
        const now = new Date();
        const [hours, minutes] = targetEndTime.split(':').map(Number);
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);
        
        // If target is earlier than now, assume it's tomorrow (or just handle as expired)
        if (target.getTime() < now.getTime()) {
           // For simple exam usage, we might just show 0 or handle next-day
           // Let's assume same day and just calculate the diff
        }
        return Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
      };
      setRemainingTime(calculateInitialRemaining());
    }
  }, [mode, durationSeconds, targetEndTime]);

  // Main Timer Tick
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
      
      if (mode === 'duration') {
        setRemainingTime((prev) => Math.max(0, prev - 1));
      } else {
        const now = new Date();
        const [hours, minutes] = targetEndTime.split(':').map(Number);
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);
        const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
        setRemainingTime(Math.max(0, diff));
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [mode, targetEndTime]);

  // Wake Lock Logic
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
          console.log('Wake Lock is active');
        }
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    };

    requestWakeLock();

    // Re-request wake lock when visibility changes
    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock !== null) wakeLock.release();
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hrs > 0) parts.push(String(hrs).padStart(2, '0'));
    parts.push(String(mins).padStart(2, '0'));
    parts.push(String(secs).padStart(2, '0'));
    
    return parts.join(':');
  };

  const formatCurrentTime = (date: Date) => {
    return date.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  const getTimeColor = () => {
    if (remainingTime <= 0) return 'text-red-500';
    if (remainingTime <= 60) return 'text-red-400';
    if (remainingTime <= 300) return 'text-orange-400';
    return 'text-white';
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen flex flex-col items-center justify-between bg-black p-8 md:p-12 transition-colors duration-1000 overflow-hidden relative"
    >
      {/* Header Info */}
      <div className="w-full flex justify-between items-start z-10">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-500 tracking-wider">物治系筆試倒計時 by HM Lee</h2>
          <div className="flex gap-4 mt-1">
             <span className="text-sm bg-gray-800 px-3 py-1 rounded-full text-gray-400 font-mono">
               模式: {mode === 'duration' ? '倒數計時' : `至 ${targetEndTime}`}
             </span>
             <span className="text-sm bg-gray-800 px-3 py-1 rounded-full text-gray-400 font-mono flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               螢幕長亮已開啟
             </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-lg md:text-xl font-medium uppercase tracking-widest">現在時間</p>
          <p className="text-3xl md:text-4xl font-mono font-bold text-gray-300">{formatCurrentTime(currentTime)}</p>
        </div>
      </div>

      {/* Main Big Timer */}
      <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 ${getTimeColor()}`}>
        {remainingTime > 0 ? (
          <div className="text-center">
            <h3 className="text-[14vw] md:text-[16vw] font-black font-mono leading-none tracking-tighter drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              {formatDuration(remainingTime)}
            </h3>
            <p className="text-2xl md:text-3xl mt-4 font-semibold uppercase tracking-[1em] opacity-60">
               Remaining
            </p>
          </div>
        ) : (
          <div className="text-center animate-bounce">
            <h3 className="text-[12vw] font-black leading-none text-red-600">考試結束</h3>
            <p className="text-3xl mt-8 font-bold text-red-400">Time Is Up</p>
          </div>
        )}
      </div>

      {/* Notices & Reminders */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
          <h4 className="text-gray-500 font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500/20 rounded flex items-center justify-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span></span>
            注意事項
          </h4>
          <p className="text-2xl md:text-3xl text-gray-100 leading-relaxed whitespace-pre-wrap font-medium">
            {precautions}
          </p>
        </div>
        <div className="bg-yellow-400/5 backdrop-blur-md p-8 rounded-3xl border border-yellow-400/20 shadow-2xl">
          <h4 className="text-yellow-500 font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-500/20 rounded flex items-center justify-center"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span></span>
            提醒事項
          </h4>
          <p className="text-2xl md:text-3xl text-yellow-300 leading-relaxed whitespace-pre-wrap font-medium">
            {reminders}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4 opacity-20 hover:opacity-100 transition-opacity">
        <button
          onClick={toggleFullscreen}
          className="p-3 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full transition-all"
          title="切換全螢幕"
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          )}
        </button>
        <button
          onClick={onBack}
          className="py-3 px-8 bg-gray-800/80 hover:bg-gray-700 text-gray-200 font-bold rounded-full transition-all border border-gray-700"
        >
          返回編輯
        </button>
      </div>
    </div>
  );
};

export default DisplayScreen;
