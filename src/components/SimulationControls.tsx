import React from 'react';
import { Wind, RotateCw, Compass, RotateCcw, Volume2, VolumeX, Eye } from 'lucide-react';

interface SimulationControlsProps {
  showVectors: boolean;
  onToggleVectors: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBlowWind: () => void;
  onSpin: () => void;
  onNudge: () => void;
  onReset: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  showVectors,
  onToggleVectors,
  soundEnabled,
  onToggleSound,
  onBlowWind,
  onSpin,
  onNudge,
  onReset,
}) => {
  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onNudge}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-sky-800/60 bg-sky-950/40 text-sky-300 hover:bg-sky-900/60 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          title="Халбага сэрээг хөнгөн түлхэж савлуулах"
        >
          <Compass className="w-4 h-4 text-sky-400" />
          <span>Савлуулах</span>
        </button>

        <button
          onClick={onSpin}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-amber-700/60 bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          title="Шүдний чигчлүүрийн үзүүр дээр 360° эргүүлэх"
        >
          <RotateCw className="w-4 h-4" />
          <span>Эргүүлэх</span>
        </button>

        <button
          onClick={onBlowWind}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-cyan-800/60 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          title="Салхи үлээлгэж тэнцвэрийг шалгах"
        >
          <Wind className="w-4 h-4 text-cyan-400" />
          <span>Салхи үлээх</span>
        </button>

        <button
          onClick={onReset}
          className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          title="Анхны тэгш байрлалд оруулах"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Тэгшлэх</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleVectors}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
            showVectors
              ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title="Хүчний вектор ба хүндийн төвийг харуулах"
        >
          <Eye className="w-4 h-4" />
          <span>Вектор {showVectors ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg border transition-colors shrink-0 cursor-pointer ${
            soundEnabled
              ? 'bg-slate-800 border-slate-700 text-amber-400'
              : 'bg-slate-800/50 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title={soundEnabled ? 'Дуу хаах' : 'Дуу нээх'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
