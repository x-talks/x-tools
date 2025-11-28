import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { WizardProvider, useWizard } from './core/store';
import { Stepper } from './components/ui/Stepper';
import { Step0_CreateTeam } from './components/wizard/Step0_CreateTeam';
import { initializeExampleTeam } from './core/storage';
// Placeholder imports for other steps
import { Step1_Purpose } from './components/wizard/Step1_Purpose';
import { Step2_Vision } from './components/wizard/Step2_Vision';
import { Step3_Mission } from './components/wizard/Step3_Mission';
import { Step4_Strategy } from './components/wizard/Step4_Strategy';
import { Step4_Values } from './components/wizard/Step4_Values';
import { Step5_Principles } from './components/wizard/Step5_Principles';
import { Step6_Behaviors } from './components/wizard/Step6_Behaviors';
import { Step7_Goals } from './components/wizard/Step7_Goals';
import { Step8_Roles } from './components/wizard/Step8_Roles';
import { Step10_Save as Step9_Save } from './components/wizard/Step10_Save';
import { Step9_Export as Step10_Export } from './components/wizard/Step9_Export';

const STEPS = [
  { title: 'Create Circle' },
  { title: 'Purpose' },
  { title: 'Vision' },
  { title: 'Mission' },
  { title: 'Strategy' },
  { title: 'Values' },
  { title: 'Principles' },
  { title: 'Behaviors' },
  { title: 'Goals' },
  { title: 'Roles' },
  { title: 'Save' },
  { title: 'Export' },
];

function WizardOrchestrator({ onViewHome }: { onViewHome: () => void }) {
  const { state, dispatch } = useWizard();

  const handleStepClick = (index: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: index });
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 0: return <Step0_CreateTeam />;
      case 1: return <Step1_Purpose />;
      case 2: return <Step2_Vision />;
      case 3: return <Step3_Mission />;
      case 4: return <Step4_Strategy />;
      case 5: return <Step4_Values />;
      case 6: return <Step5_Principles />;
      case 7: return <Step6_Behaviors />;
      case 8: return <Step7_Goals />;
      case 9: return <Step8_Roles />;
      case 10: return <Step9_Save onViewHome={onViewHome} />;
      case 11: return <Step10_Export />;
      default: return <Step0_CreateTeam />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-4xl relative pt-16">
        <div className="absolute top-0 left-0 w-full flex justify-between items-center mb-8">
          <button
            onClick={onViewHome}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
          >
            <div className="p-1 rounded-full bg-slate-100 group-hover:bg-blue-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 group-hover:text-blue-600"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            </div>
            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">Back to Home</span>
          </button>
          <div className="text-sm font-medium text-slate-400">
            Minimal Vibroscope <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full ml-1">v1.1</span>
          </div>
        </div>
        <Stepper steps={STEPS} currentStep={state.currentStep} onStepClick={handleStepClick} />
      </div>
      <div className="mx-auto max-w-4xl">
        {renderStep()}
      </div>
    </div>
  );
}

import { LandingPage } from './components/LandingPage';
import type { SavedTeam } from './core/types';

function MainContent() {
  const [view, setView] = useState<'landing' | 'wizard'>('landing');
  const { dispatch } = useWizard();

  // Initialize example team on first app load
  useEffect(() => {
    initializeExampleTeam().catch(err => {
      console.error('Failed to initialize example team:', err);
    });
  }, []);

  const handleStartNew = () => {
    dispatch({ type: 'RESET' });
    setView('wizard');
  };

  const handleLoadTeam = (team: SavedTeam) => {
    dispatch({ type: 'LOAD_STATE', payload: team.state });
    // Navigate to Export/Canvas overview (step 10)
    setTimeout(() => {
      dispatch({ type: 'GO_TO_STEP', payload: 11 });
    }, 0);
    setView('wizard');
  };

  return (
    <>
      {view === 'landing' ? (
        <LandingPage onStartNew={handleStartNew} onLoadTeam={handleLoadTeam} />
      ) : (
        <WizardOrchestrator onViewHome={() => setView('landing')} />
      )}
    </>
  );
}

// Redefine App to use MainContent
function AppWrapper() {
  return (
    <WizardProvider>
      <Layout>
        <MainContent />
      </Layout>
    </WizardProvider>
  );
}

export default AppWrapper;
