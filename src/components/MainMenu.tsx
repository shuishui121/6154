import { useGameStore } from '@/store/useGameStore';
import { DIFFICULTY_CONFIG } from '@/game/utils/constants';
import type { Difficulty } from '@/game/utils/constants';
import { loadGameData } from '@/utils/storage';
import { Trophy, Medal, Award, Play, ChevronRight } from 'lucide-react';

export default function MainMenu() {
  const {
    difficulty,
    setDifficulty,
    startGame,
    setStatus,
  } = useGameStore();

  const gameData = loadGameData();
  const highScore = gameData.highScores[difficulty];

  const handleStart = () => {
    startGame();
  };

  const handleShowAchievements = () => {
    setStatus('achievements');
  };

  const difficulties: { key: Difficulty; icon: string; color: string }[] = [
    { key: 'easy', icon: '🌱', color: 'from-green-400 to-green-600' },
    { key: 'normal', icon: '⚡', color: 'from-blue-400 to-blue-600' },
    { key: 'hard', icon: '🔥', color: 'from-orange-400 to-red-500' },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-sky-400 to-sky-200 z-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-12 bg-white rounded-full opacity-80 animate-pulse" />
        <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-70" />
        <div className="absolute top-16 left-1/3 w-24 h-10 bg-white rounded-full opacity-60" />
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-2 animate-bounce">
            🏃‍♂️ 跳高小达人
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            挑战你的极限，飞跃更高的横杆！
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl max-w-md mx-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              选择难度
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  className={`relative p-4 rounded-2xl transition-all duration-300 ${
                    difficulty === d.key
                      ? `bg-gradient-to-br ${d.color} text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-1">{d.icon}</div>
                  <div className="text-sm font-medium">
                    {DIFFICULTY_CONFIG[d.key].label}
                  </div>
                  {difficulty === d.key && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center justify-center gap-2 text-amber-700">
              <Medal className="w-5 h-5" />
              <span className="text-sm">当前最高纪录</span>
            </div>
            <div className="text-3xl font-bold text-amber-600 mt-1">
              {highScore > 0 ? `${highScore.toFixed(2)} 米` : '--'}
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 px-8 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Play className="w-6 h-6 fill-current" />
            开始游戏
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleShowAchievements}
            className="w-full mt-4 py-3 px-6 bg-white border-2 border-purple-300 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
          >
            <Award className="w-5 h-5" />
            成就殿堂
          </button>
        </div>

        <div className="mt-6 text-white/80 text-sm">
          <p>💡 小提示：快速连按 → 键加速，空格键起跳</p>
        </div>
      </div>
    </div>
  );
}
