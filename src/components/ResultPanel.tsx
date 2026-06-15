import { useGameStore } from '@/store/useGameStore';
import { getAchievementById } from '@/utils/achievements';
import { Trophy, RotateCcw, Home, Star, Sparkles } from 'lucide-react';

export default function ResultPanel() {
  const {
    maxHeightReached,
    score,
    isNewRecord,
    combo,
    newlyUnlockedAchievements,
    resetGame,
    startGame,
    difficulty,
  } = useGameStore();

  const handleRestart = () => {
    const restartFn = (window as any).__restartGame;
    if (restartFn) {
      restartFn();
    }
    startGame();
  };

  const handleBackToMenu = () => {
    resetGame();
  };

  const newAchievements = newlyUnlockedAchievements
    .map((id) => getAchievementById(id))
    .filter(Boolean);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl max-w-md w-full mx-4 transform animate-bounce-in">
        {isNewRecord && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-lg font-bold animate-pulse">
              <Star className="w-5 h-5 fill-current" />
              新纪录！
              <Star className="w-5 h-5 fill-current" />
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isNewRecord ? '🎉 太厉害了！' : '本次成绩'}
          </h2>
          <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent py-4">
            {maxHeightReached.toFixed(2)}
            <span className="text-2xl text-gray-500 ml-1">米</span>
          </div>
          <div className="flex justify-center gap-6 text-gray-600 mt-4">
            <div>
              <div className="text-sm text-gray-500">得分</div>
              <div className="text-xl font-bold text-amber-500">{score}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">最高连击</div>
              <div className="text-xl font-bold text-orange-500">{combo}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">难度</div>
              <div className="text-xl font-bold text-blue-500">
                {difficulty === 'easy' ? '简单' : difficulty === 'normal' ? '普通' : '困难'}
              </div>
            </div>
          </div>
        </div>

        {newAchievements.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 justify-center">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-purple-600">解锁新成就！</span>
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {newAchievements.map((achievement) => (
                <div
                  key={achievement!.id}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full animate-bounce-in"
                  style={{ animationDelay: '0.1s' }}
                >
                  <span className="text-2xl">{achievement!.icon}</span>
                  <span className="font-medium text-purple-700">
                    {achievement!.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleRestart}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            再来一次
          </button>
          <button
            onClick={handleBackToMenu}
            className="w-full py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            返回主菜单
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>小知识：跳高的世界纪录是2.45米！</span>
          </div>
        </div>
      </div>
    </div>
  );
}
