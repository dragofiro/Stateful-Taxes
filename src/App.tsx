// Main application component for Stateful Taxes.
// Routes with the URL hash so the browser Back button returns to the map:
//   (no hash)   landing page with the state map
//   #/file/ny   the state's filing workflow, if the state has one in the registry
//   #/file/co   filing dashboard for Colorado (states without a workflow yet)
import { useCallback, useSyncExternalStore } from 'react';
import { LandingPage } from './components/landing/landing_page.tsx';
import { FilingDashboard } from './components/filing_dashboard.tsx';
import { JURISDICTION_NAMES } from './components/landing/jurisdictions.ts';
import { STATE_REGISTRY } from './components/forms/states/registry.ts';
import { MobileNotice } from './components/mobile_notice.tsx';

const FILE_ROUTE = /^#\/file\/([a-z]{2})$/i;

function subscribeToHash(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function useHash(): string {
  return useSyncExternalStore(subscribeToHash, () => window.location.hash);
}

/** Returns the postal code in the hash if it names a known state, otherwise null. */
function stateFromHash(hash: string): string | null {
  const code = FILE_ROUTE.exec(hash)?.[1]?.toUpperCase();
  return code && code in JURISDICTION_NAMES ? code : null;
}

export function App() {
  const stateCode = stateFromHash(useHash());

  const startFiling = useCallback((code: string) => {
    window.location.hash = `#/file/${code.toLowerCase()}`;
    window.scrollTo(0, 0);
  }, []);

  const backToMap = useCallback(() => {
    window.location.hash = '';
  }, []);

  const workflow = stateCode ? STATE_REGISTRY[stateCode] : undefined;
  if (workflow) {
    const StateForm = workflow.component;
    return (
      <>
        <StateForm onBack={backToMap} />
        <MobileNotice onLeave={backToMap} />
      </>
    );
  }
  if (stateCode) {
    return (
      <>
        <FilingDashboard stateCode={stateCode} onBack={backToMap} />
        <MobileNotice onLeave={backToMap} />
      </>
    );
  }
  return <LandingPage onStartFiling={startFiling} />;
}

export default App;
