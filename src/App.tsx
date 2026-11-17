/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Film, Sparkles } from 'lucide-react';
import { ExperimentCanvas } from './components/ExperimentCanvas';
import { SimulationControls } from './components/SimulationControls';
import { PhysicsExplainer } from './components/PhysicsExplainer';
import { MyExperimentSection } from './components/MyExperimentSection';
import { VideoReferenceModal } from './components/VideoReferenceModal';
import { soundManager } from './utils/audio';

export default function App() {
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [windGust, setWindGust] = useState<boolean>(false);
  const [spinTrigger, setSpinTrigger] = useState<number>(0);
  const [nudgeTrigger, setNudgeTrigger] = useState<number>(0);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
  };

  const handleBlowWind = useCallback(() => {
    setWindGust(true);
  }, []);

  const handleSpin = useCallback(() => {
    setSpinTrigger((c) => c + 1);
  }, []);

  const handleNudge = useCallback(() => {
    setNudgeTrigger((c) => c + 1);
  }, []);

  const handleReset = useCallback(() => {
    setResetTrigger((c) => c + 1);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c111d] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav links) - Zone 3 (1 Primary Action) */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between gap-8">
        <a href="/" className="text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display">
          Тэнцвэрийн гайхамшиг
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#experiment" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Интерактив анимаци
          </a>
          <a href="#my-experiment" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Миний хийсэн туршилт
          </a>
          <a href="#theory" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            Тэнцвэрийн тайлбар
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Бодит бичлэг</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-10" id="experiment">
        {/* Hero Header */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-medium text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>Тэнцвэрийн гайхамшиг</span>
            <span aria-hidden="true">·</span>
            <span>Халбага + Сэрээ + Алим + 2 Шүдний чигчлүүр</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display">
            Халбага, Сэрээ ба Шүдний Чигчлүүрийн Тэнцвэрийн Гайхамшиг
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed">
            Алим дээр зоосон ганц шүдний чигчлүүрийн хурц үзүүр дээр халбага ба сэрээ хоёр уналгүй хэрхэн тэнцвэржин тогтож, агаарт савлаж болон эргэлдэж чаддагийг бодитоор туршиж, физик нууцыг нь ойлгоорой.
          </p>
        </div>

        {/* Visual Simulation Stage */}
        <div className="space-y-4">
          <ExperimentCanvas
            showVectors={showVectors}
            windGust={windGust}
            onWindEnd={() => setWindGust(false)}
            spinTrigger={spinTrigger}
            nudgeTrigger={nudgeTrigger}
            resetTrigger={resetTrigger}
          />

          <SimulationControls
            showVectors={showVectors}
            onToggleVectors={() => setShowVectors((prev) => !prev)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onBlowWind={handleBlowWind}
            onSpin={handleSpin}
            onNudge={handleNudge}
            onReset={handleReset}
          />
        </div>

        {/* User's Real Experiment Photo */}
        <div className="pt-4 border-t border-slate-800/80">
          <MyExperimentSection />
        </div>

        {/* Detailed Explanation of the Miracle of Balance */}
        <section id="theory" className="pt-4 border-t border-slate-800/80">
          <PhysicsExplainer />
        </section>
      </main>

      <footer className="border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500">
        <p>
          «Тэнцвэрийн гайхамшиг» · Халбага, сэрээ, алим ба шүдний чигчлүүрийн интерактив физик симуляци
        </p>
      </footer>

      <VideoReferenceModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
