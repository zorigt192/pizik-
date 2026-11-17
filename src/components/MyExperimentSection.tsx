import React, { useState } from 'react';
import { Camera, CheckCircle2, Maximize2, X } from 'lucide-react';

const EXPERIMENT_IMAGE_SRC = '/assets/aistudio/file_00000000747c81f8ae70488275666805_282137d2.png';

export const MyExperimentSection: React.FC = () => {
  const [imgError, setImgError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <section id="my-experiment" className="w-full space-y-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <Camera className="w-4 h-4" />
          <span>Бодит гэрэл зураг · Гэрийн нөхцөлд хийсэн баталгаа</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-display">
          Миний хийсэн туршилт
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6">
        {/* Left: User's Real Experiment Photo */}
        <div className="lg:col-span-7 relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 min-h-[280px] group">
          {!imgError ? (
            <>
              <img
                src={EXPERIMENT_IMAGE_SRC}
                alt="Миний хийсэн туршилт — Улаан алим, шүдний чигчлүүр, халбага ба сэрээний бодит тэнцвэр"
                className="w-full h-full object-cover lg:h-full transition-transform duration-300 group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-950/85 hover:bg-slate-900 text-slate-200 text-xs font-medium border border-slate-700/70 backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Зургийг томруулж харах"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Томруулж үзэх</span>
              </button>
            </>
          ) : (
            <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-400 gap-2">
              <Camera className="w-8 h-8 text-amber-400/70" />
              <p className="text-sm font-medium text-slate-200">Миний хийсэн туршилт</p>
              <p className="text-xs text-slate-500">Алим, халбага, сэрээ ба шүдний чигчлүүр</p>
            </div>
          )}
        </div>

        {/* Right: Real Experiment Breakdown */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 py-1">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white font-display">
              Бодит туршилтын амжилттай үр дүн
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Энэхүү зураг дээр онолын загварыг бодит амьдрал дээр яг ижилхэн амжилттай туршсан үр дүн харагдаж байна. Улаан алиманд эгц босоогоор зоосон ганц нарийхан шүдний чигчлүүрийн үзүүр дээр халбага ба сэрээ хоёр агаарт ямар ч нэмэлт бэхэлгээгүйгээр төгс тэнцвэржин тогтсон байна.
            </p>
          </div>

          <div className="space-y-2.5 text-xs md:text-sm text-slate-300">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-100">Тогтвортой суурь:</span>{' '}
                <span className="text-slate-400">Улаан алим ширээн дээр хөдөлгөөнгүй суурь болж чигчлүүрийг эгц барьж байна.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-100">Цэгэн тулгуур:</span>{' '}
                <span className="text-slate-400">Халбага, сэрээний уулзвар яг шүдний чигчлүүрийн хурц үзүүр дээр төвлөрчээ.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-100">Хүндийн төвийн байрлал:</span>{' '}
                <span className="text-slate-400">Халбага ба сэрээний урт бариулууд доош унжсанаар нийт хүндийн төв тулгуураас доор шилжсэн байна.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full View */}
      {isLightboxOpen && !imgError && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
              <span className="text-sm font-bold text-white font-display">
                Миний хийсэн туршилт
              </span>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Хаах"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-black flex items-center justify-center">
              <img
                src={EXPERIMENT_IMAGE_SRC}
                alt="Миний хийсэн туршилт"
                className="w-full max-h-[80vh] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
