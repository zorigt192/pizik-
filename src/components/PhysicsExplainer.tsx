import React from 'react';
import { Target, Scale, RotateCw, Layers, ArrowDownUp, Sparkles } from 'lucide-react';

export const PhysicsExplainer: React.FC = () => {
  return (
    <div className="w-full space-y-8">
      {/* Main Miracle of Balance Deep-Dive Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>Тэнцвэрийн гайхамшиг · Дэлгэрэнгүй тайлбар</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-display">
          Хоёр нарийхан шүдний чигчлүүрийн үзүүр дээр хүнд халбага, сэрээ хоёр яагаад унахгүй тогтдог вэ?
        </h2>
        <p className="text-sm md:text-base text-slate-300 leading-relaxed">
          Анх харахад хүнд металл халбага ба сэрээ хоёр агаарт ил гарсан ганц модон чигчлүүрийн үзүүр дээр тэнцвэржин тогтох нь таталцлын хуулийг зөрчиж байгаа мэт гайхшрал төрүүлдэг. Гэвч үнэн хэрэгтээ энэ нь <strong className="text-amber-300">«Хүндийн төвийн шилжилт»</strong> болон <strong className="text-emerald-300">«Тогтвортой тэнцвэрийн хууль»</strong>-ийн хамгийн цэвэрхэн, сонгодог жишээ юм.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Хэрэв бид сэрээ ба халбагыг шулуун байрлуулсан бол тулгуур цэг дээр тогтоох бараг боломжгүй байсан. Харин тэдгээрийг V-хэлбэрээр хооронд нь түгжихэд хоёр бариулын муруй үзүүр тулгуур цэгээс <strong className="text-slate-200">доош болон урагш</strong> сунаж, нийт массын жин тулгуурын доор төвлөрдөг. Ингэснээр халбага сэрээ хоёр яг л өлгүүрт дүүжлэгдсэн дүүжин мэт байгалийн жамаар өөрөө тэнцвэрждэг.
        </p>
      </div>

      {/* Detailed Physical Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400">
            <Target className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-semibold text-slate-100">
              1. Хүндийн төв (G) нь тулгуур цэг (P)-ээс доор орших нь
            </h3>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Аливаа биетийн бүх жин төвлөрсөн цэгийг <strong className="text-amber-300">хүндийн төв (G)</strong> гэдэг. Энэ туршилтад халбага ба сэрээний толгойнууд тулгуураас дээр орших ч, тэдгээрийн урт бөгөөд хүнд металл бариулууд хоёр тал руугаа урагш нумарч тулгуур цэгээс доош унждаг. Үүний үр дүнд нийлмэл системийн жингийн дундаж төв цэг (<strong className="text-emerald-300">G</strong>) нь агаар дахь шүргэлцлийн цэг (<strong className="text-amber-300">P</strong>)-ээс яг эгц доор шилждэг.
          </p>
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs font-mono-numbers text-amber-200/90">
            Тэнцвэрийн нөхцөл: G цэгийн өндөр &lt; P цэгийн өндөр (h_G &lt; h_P)
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Scale className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-semibold text-slate-100">
              2. Тогтвортой тэнцвэр ба Сэргээх эргүүлэх момент
            </h3>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Дээрх симуляци дээр та сэрээг хулганаар татаж хазайлгахад унахын оронд нааш цааш савлаж байгаад буцаад тэгш байрлалдаа орно. Учир нь систем θ өнцгөөр хазайх бүрт доор байрлах хүндийн төв (G) нь бага зэрэг дээшилж, потенциал энерги нь нэмэгддэг. Дэлхийн татах хүч түүнийг үргэлж хамгийн нам дор цэг рүү буюу анхны тэнцвэрийн шугам руу татах <strong className="text-emerald-300">сэргээх момент</strong> үүсгэнэ.
          </p>
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs font-mono-numbers text-emerald-200/90">
            Сэргээх момент: τ = -m · g · d · sin(θ) [d нь P ба G цэгийн зай]
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-sky-400">
            <ArrowDownUp className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-semibold text-slate-100">
              3. Хүчний нийлбэр тэг байх статик тэнцвэр
            </h3>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Систем хөдөлгөөнгүй тогтохын тулд бүх хүч болон эргүүлэх моментууд бие биенээ харилцан тэнцвэржүүлэх ёстой. Халбага, сэрээ болон хэвтээ чигчлүүрийн нийт жин доош (<strong className="text-emerald-300">Fg = m·g</strong>) татахад алиманд бат бөх зоогдсон босоо чигчлүүр нь яг тэнцүү хүчээр дээш (<strong className="text-amber-300">N</strong>) тулж өгдөг. Энэ хоёр хүч нэг босоо шулуун дээр эсрэг чиглэлтэй үйлчилдэг тул эргүүлэх хүч үүсэхгүй.
          </p>
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs font-mono-numbers text-sky-200/90">
            Тэнцвэрийн тэгшитгэл: ΣF = N - mg = 0 · ба · Στ = 0
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-300">
            <RotateCw className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-semibold text-slate-100">
              4. Цэгэн шүргэлцэл ба агаарт чөлөөтэй эргэх үзэгдэл
            </h3>
          </div>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Хоёр модон чигчлүүр ердөө 1 мм² орчим өчүүхэн талбайтай хурц үзүүрээрээ шүргэлцдэг. Тулгуур талбай маш бага учраас эргэлтийн үрэлтийн момент туйлын бага байна. Иймээс халбага эсвэл сэрээний бариулаас зөөлөн түлхэхэд бүхэл бүтэн систем уналгүйгээр ганц үзүүр дээрээ <strong className="text-amber-300">360° чөлөөтэй эргэж</strong> чаддаг нь туршилтын хамгийн гайхалтай хэсэг юм.
          </p>
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs font-mono-numbers text-amber-200/90">
            Онцлог: Тулгуур талбай багасах тусам босоо тэнхлэгийг тойрон эргэх эсэргүүцэл буурна.
          </div>
        </div>
      </div>

      {/* How the Mechanical Lock Works */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 flex items-start gap-3 text-xs md:text-sm text-slate-300">
        <Layers className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-100">Халбага ба сэрээний хатуу түгжээ</p>
          <p className="leading-relaxed text-slate-400">
            Сэрээний дунд шүднүүд нь халбаганы толгойг дээд ба доод талаас нь уян харимхай хүчээр хавчиж, дундуур нь шургуулсан чигчлүүр нь тэдгээрийг гулгахгүй ганц хатуу биет болгон түгждэг. Хэрэв алим хүнд, нягт биш байсан бол босоо чигчлүүр хазайж бүтэц унах байсан тул алим нь чичиргээ шингээх төгс суурь болдог.
          </p>
        </div>
      </div>
    </div>
  );
};
