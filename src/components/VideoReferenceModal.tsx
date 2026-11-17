import React from 'react';
import { Film, X, Info } from 'lucide-react';

interface VideoReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoReferenceModal: React.FC<VideoReferenceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Film className="w-5 h-5" />
            <h3 className="font-bold text-white text-base font-display">
              Тэнцвэрийн гайхамшиг — Бодит бичлэг
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative flex-1 bg-black flex items-center justify-center">
          <video
            src="/assets/aistudio/received_1121780227262361_53087e27.mp4"
            controls
            autoPlay
            playsInline
            className="w-full max-h-[68vh] object-contain"
          />
        </div>

        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-400" />
            Халбага, сэрээ, алим ба шүдний чигчлүүрийн бодит туршилтын бичлэг
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
};
