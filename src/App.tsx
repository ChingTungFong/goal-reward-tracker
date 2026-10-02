/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CelebrationModal } from './components/CelebrationModal';
import { TrophyShelfModal } from './components/TrophyShelfModal';
import { WeeklyRecapModal } from './components/WeeklyRecapCard';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { CreateTreatModal } from './components/CreateTreatModal';
import { TodayView } from './views/TodayView';
import { CalendarView } from './views/CalendarView';
import { TreatsView } from './views/TreatsView';
import { GoalsView } from './views/GoalsView';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isCreateTreatOpen, setIsCreateTreatOpen] = useState(false);
  const [redeemModalTreatId, setRedeemModalTreatId] = useState<string | null>(null);

  const handleOpenRedeemModal = (treatId: string) => {
    setRedeemModalTreatId(treatId);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex justify-center text-stone-800">
      {/* Mobile Shell / Max Width Container */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#FFFDF9] relative border-x border-stone-200/50 shadow-sm">
        {/* Top Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 px-4 pt-3 pb-20 overflow-y-auto">
          {activeTab === 'today' && (
            <TodayView
              onOpenCreateGoal={() => setIsCreateGoalOpen(true)}
              onOpenRedeemModal={handleOpenRedeemModal}
            />
          )}

          {activeTab === 'calendar' && <CalendarView />}

          {activeTab === 'treats' && (
            <TreatsView
              onOpenCreateTreat={() => setIsCreateTreatOpen(true)}
              redeemModalTreatId={redeemModalTreatId}
              setRedeemModalTreatId={setRedeemModalTreatId}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsView
              isCreateModalOpen={isCreateGoalOpen}
              setIsCreateModalOpen={setIsCreateGoalOpen}
              onOpenCreateTreat={() => setIsCreateTreatOpen(true)}
            />
          )}
        </main>

        {/* Bottom Fixed Navigation Bar */}
        <BottomNav />

        {/* Global Modals & Overlays */}
        <CelebrationModal />
        <TrophyShelfModal />
        <WeeklyRecapModal />
        <SettingsModal />
        <OnboardingModal />
        <CreateTreatModal
          isOpen={isCreateTreatOpen}
          onClose={() => setIsCreateTreatOpen(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
