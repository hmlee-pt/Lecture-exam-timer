
import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import DisplayScreen from './components/DisplayScreen';

export type TimerMode = 'duration' | 'endTime';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'setup' | 'display'>('setup');
  const [mode, setMode] = useState<TimerMode>('duration');
  
  const [precautions, setPrecautions] = useState<string>(
    "注意事項：\n1. 拿出手機平板一律扣分.\n2. 作弊一律零分計算."
  );
  const [reminders, setReminders] = useState<string>(
    "提醒事項：\n筆試考完請至骨科實作室等待&準備跑台考試.\n筆試考完繼續上課."
  );
  
  const [durationSeconds, setDurationSeconds] = useState<number>(3000); // 50 mins default
  const [targetEndTime, setTargetEndTime] = useState<string>('12:00');

  const handleStartDisplay = (selectedMode: TimerMode, value: number | string) => {
    setMode(selectedMode);
    if (selectedMode === 'duration') {
      setDurationSeconds(value as number);
    } else {
      setTargetEndTime(value as string);
    }
    setScreen('display');
  };

  const handleBackToSetup = () => {
    setScreen('setup');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center font-sans overflow-hidden">
      {screen === 'setup' ? (
        <SetupScreen
          precautions={precautions}
          setPrecautions={setPrecautions}
          reminders={reminders}
          setReminders={setReminders}
          onStart={handleStartDisplay}
          initialMode={mode}
          initialDuration={durationSeconds}
          initialEndTime={targetEndTime}
        />
      ) : (
        <DisplayScreen
          precautions={precautions}
          reminders={reminders}
          mode={mode}
          durationSeconds={durationSeconds}
          targetEndTime={targetEndTime}
          onBack={handleBackToSetup}
        />
      )}
    </div>
  );
};

export default App;
