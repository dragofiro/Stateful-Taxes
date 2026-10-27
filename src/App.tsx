import React, { useState } from 'react';

// Mock state list for the directory (/src/components/states)
const STATES = [
  { name: 'New York', code: 'NY', form: 'IT-201', status: 'Available' },
  { name: 'California', code: 'CA', form: 'Form 540', status: 'Coming Soon' },
  { name: 'Massachusetts', code: 'MA', form: 'Form 1', status: 'Coming Soon' },
  { name: 'Connecticut', code: 'CT', form: 'CT-1040', status: 'Coming Soon' },
  { name: 'New Jersey', code: 'NJ', form: 'NJ-1040', status: 'Coming Soon' },
  { name: 'Pennsylvania', code: 'PA', form: 'PA-40', status: 'Coming Soon' },
  { name: 'Texas', code: 'TX', form: 'No State Income Tax', status: 'N/A' },
  { name: 'Florida', code: 'FL', form: 'No State Income Tax', status: 'N/A' },
];

export function App() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [savedJsonData, setSavedJsonData] = useState<string | null>(null);
  const [mockFormData, setMockFormData] = useState({
    fullName: '',
    ssn: '',
    homeAddress: '',
  });

  // Simulate JSON Export (Saving progress locally)
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockFormData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "stateful-taxes-draft.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Simulate JSON Import (Restoring progress)
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setMockFormData(parsed);
          setSavedJsonData("Progress successfully loaded from local JSON!");
        } catch {
          alert("Invalid JSON file format.");
        }
      };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              ST
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">Stateful Taxes</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                100% Client-Side
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <span className="hidden sm:inline">Zero Servers • Zero Tracking • Local PDF & JSON</span>
            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition">
              Restore Draft (.json)
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
          <span>Desktop-Optimized Tax Engine</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          File your state income taxes entirely on your computer.
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          No accounts, no cloud databases, and no data leaves your browser. Stateful Taxes uses client-side templates and <code className="text-indigo-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">pdf-lib</code> to generate official state returns locally.
        </p>

        {savedJsonData && (
          <div className="mt-4 inline-block bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-4 py-2 rounded-lg text-sm">
            {savedJsonData}
          </div>
        )}
      </section>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-6 pb-20 flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: State Form Directory (/src/components/states) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">State Form Directory</h2>
                <p className="text-sm text-slate-400">Select a jurisdiction from <code className="text-xs text-indigo-300">/src/components/states</code></p>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                50 States + DC
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STATES.map((s) => (
                <button
                  key={s.code}
                  onClick={() => setSelectedState(s.name)}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left transition ${
                    selectedState === s.name
                      ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/5'
                      : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.form}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    s.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    s.status === 'Coming Soon' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-slate-800 text-slate-500'
                  }`}>
                    {s.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Architectural Component Structure Viewer */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">Project Component Architecture</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-slate-400">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-indigo-400 font-bold block mb-1">/src/components/forms/bases</span>
                <p className="text-slate-500 font-sans text-xs">Contains generic wrappers (`form_wrapper`), inputs (`input_field`), and selects (`select_field`).</p>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-indigo-400 font-bold block mb-1">/src/components/forms/fields</span>
                <p className="text-slate-500 font-sans text-xs">Contains pre-configured named fields (`full_name`, `home_address`, `billing_address`).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Active Form Preview & Local Storage Options */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-lg mb-1">
              {selectedState ? `${selectedState} Return` : 'Interactive Form Preview'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {selectedState ? `Loaded from /components/states/${selectedState}` : 'Select a state to test field bindings.'}
            </p>

            <div className="space-y-4">
              {/* Simulating /forms/fields/full_name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name (from fields/full_name)</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={mockFormData.fullName}
                  onChange={(e) => setMockFormData({...mockFormData, fullName: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Simulating /forms/fields/home_address */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Home Address (from fields/home_address)</label>
                <input
                  type="text"
                  placeholder="123 Main St, City, ST Zip"
                  value={mockFormData.homeAddress}
                  onChange={(e) => setMockFormData({...mockFormData, homeAddress: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={handleExportJson}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 px-4 rounded-xl text-sm border border-slate-700 transition flex items-center justify-center space-x-2"
                >
                  <span>Download Progress (.json)</span>
                </button>
                <button
                  onClick={() => alert("pdf-lib triggered: Compiling form data into official state template PDF locally...")}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2"
                >
                  <span>Generate Official PDF (pdf-lib)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300">Privacy Assurance</div>
            <p>
              Your data never touches a server. All calculations happen in-browser, and PDFs are assembled client-side using <code className="text-slate-300">pdf-lib</code>.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Stateful Taxes • Designed for secure, offline desktop tax preparation.
      </footer>
    </div>
  );
}

export default App;