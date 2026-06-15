import { useGameStore } from '@/store/useGameStore';
import { DIFFICULTY_CONFIG } from '@/game/utils/constants';
import { Gauge, Zap, Target, Pause } from 'lucide-react';

export default function HUD() {
  const {
    currentHeight,
    score,
    combo,
    runSpeed,
    isInJumpZone,
    difficulty,
    setStatus,
  } = useGameStore();

  const speedPercent = Math.min(runSpeed, 100);
  const isHighSpeed = speedPercent > 80;
  const isWaiting = runSpeed === 0;

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-40">
      <div className="flex justify-between items-start max-w-4xl mx-auto">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-4 py-3 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-white/70">当前高度</span>
          </div>
          <div className="text-2xl font-bold">
            {currentHeight.toFixed(2)}
            <span className="text-sm font-normal text-white/70 ml-1">米</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            <span className="text-white/70">难度：</span>
            <span className="font-semibold">
              {DIFFICULTY_CONFIG[difficulty].label}
            </span>
          </div>
          {combo > 0 && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-4 py-2 text-white font-bold animate-pulse">
              🔥 {combo} 连击！
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-4 py-3 text-white">
            <div className="text-xs text-white/70 mb-1">得分</div>
            <div className="text-2xl font-bold text-yellow-400">{score}</div>
          </div>
          <button
            onClick={() => setStatus('paused')}
            className="mt-2 bg-black/40 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/60 transition-colors pointer-events-auto"
          >
            <Pause className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Gauge className={`w-5 h-5 ${isHighSpeed ? 'text-red-400' : 'text-white'}`} />
            <span className="text-white text-sm font-medium">助跑速度</span>
            {isHighSpeed && (
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            )}
          </div>
          <div className="h-4 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className={`h-full rounded-full transition-all duration-100 ${
                speedPercent > 80
                  ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'
                  : speedPercent > 50
                  ? 'bg-gradient-to-r from-green-400 to-yellow-400'
                  : 'bg-gradient-to-r from-green-500 to-green-400'
              }`}
              style={{ width: `${speedPercent}%` }}
            />
          </div>
        </div>
      </div>

      {isWaiting && !isInJumpZone && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-3xl font-bold text-white animate-pulse drop-shadow-lg text-center">
            <div>🏃‍♂️ 按 → 键开始助跑！</div>
            <div className="text-lg text-white/80 mt-2">连按加速 · 空格起跳</div>
          </div>
        </div>
      )}

      {isInJumpZone && !isWaiting && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-4xl font-bold text-yellow-400 animate-pulse drop-shadow-lg">
            ⚡ 起跳区！
          </div>
        </div>
      )}
    </div>
  );
}
