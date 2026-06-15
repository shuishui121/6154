import { useGameStore } from '@/store/useGameStore';
import { getAchievementsWithStatus } from '@/utils/storage';
import { ACHIEVEMENTS } from '@/game/utils/constants';
import { X, Lock, Trophy, Medal } from 'lucide-react';

export default function AchievementPanel() {
  const { setStatus, resetGame } = useGameStore();

  const achievements = getAchievementsWithStatus();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  const handleClose = () => {
    setStatus('menu');
    resetGame();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-500" />
            成就殿堂
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80">完成进度</span>
            <span className="font-bold text-lg">
              {unlockedCount} / {totalCount}
            </span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-sm text-white/80 mt-1">
            {progress}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 overflow-y-auto flex-1 pr-1">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-2xl transition-all duration-300 ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-300 shadow-md'
                  : 'bg-gray-100 border-2 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`text-3xl ${
                    achievement.unlocked ? '' : 'grayscale opacity-50'
                  }`}
                >
                  {achievement.unlocked ? (
                    achievement.icon
                  ) : (
                    <Lock className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold text-sm ${
                      achievement.unlocked ? 'text-amber-800' : 'text-gray-500'
                    }`}
                  >
                    {achievement.name}
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      achievement.unlocked ? 'text-amber-600' : 'text-gray-400'
                    }`}
                  >
                    {achievement.description}
                  </div>
                </div>
              </div>
              {achievement.unlocked && achievement.unlockedAt && (
                <div className="mt-2 text-xs text-amber-500 flex items-center gap-1">
                  <Medal className="w-3 h-3" />
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-shadow"
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
}
