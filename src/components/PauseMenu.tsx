import { useGameStore } from '@/store/useGameStore';
import { Play, Home, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

export default function PauseMenu() {
  const { setStatus, resetGame } = useGameStore();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleResume = () => {
    setStatus('playing');
  };

  const handleRestart = () => {
    const restartFn = (window as any).__restartGame;
    if (restartFn) {
      restartFn();
    }
    setStatus('playing');
  };

  const handleBackToMenu = () => {
    resetGame();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">⏸️ 游戏暂停</h2>

        <div className="space-y-3">
          <button
            onClick={handleResume}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Play className="w-6 h-6 fill-current" />
            继续游戏
          </button>

          <button
            onClick={handleRestart}
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition-colors"
          >
            🔄 重新开始
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
            音效：{soundEnabled ? '开' : '关'}
          </button>

          <button
            onClick={handleBackToMenu}
            className="w-full py-3 px-6 bg-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
}
