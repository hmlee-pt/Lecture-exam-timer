
import React, { useState } from 'react';
import { TimerMode } from '../App';

interface SetupScreenProps {
  precautions: string;
  setPrecautions: (value: string) => void;
  reminders: string;
  setReminders: (value: string) => void;
  onStart: (mode: TimerMode, value: number | string) => void;
  initialMode: TimerMode;
  initialDuration: number;
  initialEndTime: string;
}

const SetupScreen: React.FC<SetupScreenProps> = ({
  precautions,
  setPrecautions,
  reminders,
  setReminders,
  onStart,
  initialMode,
  initialDuration,
  initialEndTime,
}) => {
  const [mode, setMode] = useState<TimerMode>(initialMode);
  const [minutes, setMinutes] = useState(String(Math.floor(initialDuration / 60)));
  const [seconds, setSeconds] = useState(String(initialDuration % 60));
  const [endTime, setEndTime] = useState(initialEndTime);

  const handleStartClick = () => {
    if (mode === 'duration') {
      const totalSeconds = (parseInt(minutes, 10) || 0) * 60 + (parseInt(seconds, 10) || 0);
      onStart('duration', totalSeconds);
    } else {
      onStart('endTime', endTime);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 space-y-8 animate-in fade-in zoom-in duration-300">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          物治系筆試倒計時
        </h1>
        <p className="text-gray-400 mt-2 font-medium">by HM Lee</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800/50 p-1 rounded-xl flex">
          <button
            onClick={() => setMode('duration')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              mode === 'duration' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            設定時長 (倒數)
          </button>
          <button
            onClick={() => setMode('endTime')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
              mode === 'endTime' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            設定結束時間 (至何時)
          </button>
        </div>

        <div>
          {mode === 'duration' ? (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-left-2">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">分鐘</label>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="w-full p-4 bg-gray-800 border-2 border-transparent focus:border-cyan-500 rounded-xl text-2xl font-mono text-center outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">秒鐘</label>
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  className="w-full p-4 bg-gray-800 border-2 border-transparent focus:border-cyan-500 rounded-xl text-2xl font-mono text-center outline-none transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">結束時刻</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-4 bg-gray-800 border-2 border-transparent focus:border-cyan-500 rounded-xl text-3xl font-mono text-center outline-none transition-all cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">注意事項</label>
            <textarea
              rows={3}
              className="w-full p-4 bg-gray-800 border-2 border-transparent focus:border-cyan-500 rounded-xl text-gray-100 outline-none transition-all resize-none"
              placeholder="輸入考試規則..."
              value={precautions}
              onChange={(e) => setPrecautions(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">提醒事項</label>
            <textarea
              rows={3}
              className="w-full p-4 bg-gray-800 border-2 border-transparent focus:border-cyan-500 rounded-xl text-gray-100 outline-none transition-all resize-none"
              placeholder="輸入提醒內容..."
              value={reminders}
              onChange={(e) => setReminders(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleStartClick}
        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xl rounded-xl shadow-xl transition-transform active:scale-95"
      >
        開始計時
      </button>
    </div>
  );
};

export default SetupScreen;
