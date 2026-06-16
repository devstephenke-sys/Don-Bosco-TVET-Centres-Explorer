import React, { useState, useEffect } from 'react';
import { ALL_CENTRES, COUNTRY_REGIONS } from './data';
import { TVETCentre, ActiveTab } from './types';
import MapSection from './components/MapSection';
import StatsDashboard from './components/StatsDashboard';
import CenterList from './components/CenterList';
import CompareCenters from './components/CompareCenters';
import { Map, ListCollapse, BarChart3, Shuffle, GraduationCap, Mail, Info, Database, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [selectedCentre, setSelectedCentre] = useState<TVETCentre | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [compareList, setCompareList] = useState<TVETCentre[]>([]);

  // Automatically deselect active spotlight center if region or country filter is changed manually and the center doesn't match
  useEffect(() => {
    if (selectedCentre) {
      const region = COUNTRY_REGIONS[selectedCentre.country] || 'Other';
      const matchesRegion = !selectedRegion || region === selectedRegion;
      const matchesCountry = !selectedCountry || selectedCentre.country === selectedCountry;
      if (!matchesRegion || !matchesCountry) {
        setSelectedCentre(null);
      }
    }
  }, [selectedRegion, selectedCountry]);

  // Add or remove a center to the comparison list
  const handleAddToCompare = (centre: TVETCentre) => {
    setCompareList(prev => {
      const exists = prev.some(c => c.centre === centre.centre);
      if (exists) {
        // Remove it
        return prev.filter(c => c.centre !== centre.centre);
      } else {
        // Add if limit (say 6 max) isn't reached
        if (prev.length >= 6) {
          alert("Maximum of 6 TVET centres can be compared side-by-side.");
          return prev;
        }
        return [...prev, centre];
      }
    });
  };

  const handleRemoveFromCompare = (centre: TVETCentre) => {
    setCompareList(prev => prev.filter(c => c.centre !== centre.centre));
  };

  const handleClearCompare = () => setCompareList([]);

  const uniqueCountriesCount = Array.from(new Set(ALL_CENTRES.map(c => c.country))).length;

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#E2E8F0] flex flex-col justify-between selection:bg-[#C9A227]/25 selection:text-[#C9A227]">
      
      {/* Top Premium Admin Header */}
      <header className="bg-[#0A0B0D]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F1116] border border-white/10 flex items-center justify-center text-[#C9A227] shrink-0 shadow-inner">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-[15px] sm:text-[17px] text-white tracking-tight leading-none uppercase">
                  <span className="text-[#C9A227] font-semibold">Salesian</span> Network Africa
                </h1>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 text-[9px] font-bold uppercase tracking-wider">
                  TVET National
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/40 font-medium tracking-[0.05em] mt-0.5">
                Continental Geospatial Mapping & Directory Archive
              </p>
            </div>
          </div>

          {/* Quick Metrics from Design HTML */}
          <div className="flex items-center gap-6 sm:gap-12">
            <div className="hidden sm:flex gap-8">
              <div className="text-right">
                <p className="text-xl font-light leading-none text-white">{ALL_CENTRES.length}</p>
                <p className="text-[9px] uppercase tracking-widest text-[#E2E8F0]/40 mt-1">Centres</p>
              </div>
              <div className="text-right mr-4">
                <p className="text-xl font-light leading-none text-white">{uniqueCountriesCount}</p>
                <p className="text-[9px] uppercase tracking-widest text-[#E2E8F0]/40 mt-1">Nations</p>
              </div>
            </div>

            {/* User Partner Badge */}
            <div className="flex items-center gap-2 bg-[#0F1116] border border-white/10 rounded-full py-1.5 px-3.5 shadow-md">
              <Mail className="w-3.5 h-3.5 text-white/40" />
              <div className="hidden sm:flex flex-col items-end leading-none">
                <span className="text-[10px] font-mono font-bold text-white/80">
                  elearning.assistant@dbtechafrica.org
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" title="Dataset connected" />
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs bar layout */}
        <div className="bg-[#0F1116] border border-white/10 p-1.5 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-3">
          
          <div className="flex flex-wrap w-full md:w-auto gap-1">
            <button
              id="tab-map"
              onClick={() => setActiveTab('map')}
              className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'map' 
                  ? 'bg-[#C9A227] text-[#0A0B0D] shadow-md shadow-[#C9A227]/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map Explorer</span>
            </button>

            <button
              id="tab-directory"
              onClick={() => setActiveTab('directory')}
              className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'directory' 
                  ? 'bg-[#C9A227] text-[#0A0B0D] shadow-md shadow-[#C9A227]/201' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ListCollapse className="w-4 h-4" />
              <span>TVET Directory</span>
            </button>

            <button
              id="tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'analytics' 
                  ? 'bg-[#C9A227] text-[#0A0B0D] shadow-md shadow-[#C9A227]/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics Overview</span>
            </button>

            <button
              id="tab-compare"
              onClick={() => setActiveTab('compare')}
              className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'compare' 
                  ? 'bg-[#C9A227] text-[#0A0B0D] shadow-md shadow-[#C9A227]/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              <span>Proximity & Compare</span>
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#C9A227]">
                  {compareList.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/40 font-mono pr-2 pointer-events-none uppercase tracking-wider">
            <Database className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Record Status: <span className="text-white/70">{ALL_CENTRES.length} active files</span></span>
          </div>

        </div>

        {/* Tab View Outputs with Fade-in Effect */}
        <div className="min-h-[500px]">
          {activeTab === 'map' && (
            <MapSection
              centres={ALL_CENTRES}
              selectedCentre={selectedCentre}
              onSelectCentre={setSelectedCentre}
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          )}

          {activeTab === 'directory' && (
            <CenterList
              centres={ALL_CENTRES}
              selectedCentre={selectedCentre}
              onSelectCentre={setSelectedCentre}
              selectedCountry={selectedCountry}
              onSelectCountry={setSelectedCountry}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
              onActiveTab={setActiveTab}
              onAddToCompare={handleAddToCompare}
              compareList={compareList}
            />
          )}

          {activeTab === 'analytics' && (
            <StatsDashboard
              centres={ALL_CENTRES}
              onSelectCountry={setSelectedCountry}
              onSelectRegion={setSelectedRegion}
              activeTab={setActiveTab}
            />
          )}

          {activeTab === 'compare' && (
            <CompareCenters
              compareList={compareList}
              onRemoveFromCompare={handleRemoveFromCompare}
              onClearCompare={handleClearCompare}
              onActiveTab={setActiveTab}
              onSelectCentre={setSelectedCentre}
            />
          )}
        </div>

      </main>

      {/* Footer Branding Panel */}
      <footer className="bg-black/90 border-t border-white/10 py-8 mt-12 text-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between text-xs">
          <div>
            <p className="font-semibold text-white uppercase tracking-wide">Don Bosco Tech Africa</p>
            <p className="text-white/50 mt-1">Supporting Technical & Vocational Education and Training (TVET) networks across marginalized regions.</p>
          </div>

          <div className="flex flex-col sm:items-end gap-1 text-[11px] font-mono text-white/30">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] uppercase tracking-widest text-white/40">System Synchronized</span>
            </div>
            <span>Server Sync Time: UTC 2026-06-16</span>
            <span>Delegated Administrator Desk Session</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
