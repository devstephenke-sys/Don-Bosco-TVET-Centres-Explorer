import React, { useState, useMemo } from 'react';
import { TVETCentre } from '../types';
import { COUNTRY_REGIONS, REGION_COLORS } from '../data';
import { Search, MapPin, Grid, List, Download, ArrowUpDown, Info, Bookmark, BookmarkCheck } from 'lucide-react';

interface CenterListProps {
  centres: TVETCentre[];
  selectedCentre: TVETCentre | null;
  onSelectCentre: (centre: TVETCentre | null) => void;
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  onActiveTab: (tab: any) => void;
  onAddToCompare: (centre: TVETCentre) => void;
  compareList: TVETCentre[];
}

export default function CenterList({
  centres,
  selectedCentre,
  onSelectCentre,
  selectedCountry,
  onSelectCountry,
  selectedRegion,
  onSelectRegion,
  onActiveTab,
  onAddToCompare,
  compareList
}: CenterListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'centre' | 'country' | 'location'>('centre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // List of unique countries for filters
  const uniqueCountries = useMemo(() => {
    const list = new Set<string>();
    centres.forEach(c => list.add(c.country));
    return Array.from(list).sort();
  }, [centres]);

  // List of unique regions
  const uniqueRegions = ['All', 'West Africa', 'East Africa', 'Central Africa', 'Southern Africa'];

  // Handle CSV data export
  const exportToCSV = () => {
    const headers = ['Centre Name', 'Location / State', 'Country', 'Region', 'Latitude', 'Longitude'];
    const rows = filteredCentres.map(c => [
      `"${c.centre.replace(/"/g, '""')}"`,
      `"${c.location.replace(/"/g, '""')}"`,
      `"${c.country}"`,
      `"${COUNTRY_REGIONS[c.country] || 'Other'}"`,
      c.coordinates.lat,
      c.coordinates.lon
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Don_Bosco_TVET_Directory_${selectedRegion || 'All'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter application pipeline
  const filteredCentres = useMemo(() => {
    return centres.filter(centre => {
      const region = COUNTRY_REGIONS[centre.country] || 'Other';
      const regionMatch = selectedRegion === 'All' || !selectedRegion || region === selectedRegion;
      const countryMatch = !selectedCountry || centre.country === selectedCountry;
      
      const searchLower = searchQuery.toLowerCase();
      const searchMatch = !searchQuery || 
        centre.centre.toLowerCase().includes(searchLower) ||
        centre.location.toLowerCase().includes(searchLower) ||
        centre.country.toLowerCase().includes(searchLower);

      return regionMatch && countryMatch && searchMatch;
    }).sort((a, b) => {
      let fieldA = a[sortBy].toLowerCase();
      let fieldB = b[sortBy].toLowerCase();
      
      if (sortDirection === 'asc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
  }, [centres, selectedRegion, selectedCountry, searchQuery, sortBy, sortDirection]);

  const handleSortToggle = (field: 'centre' | 'country' | 'location') => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Controls Container Card */}
      <div className="bg-[#0F1116] border border-white/10 rounded-2xl p-5 shadow-lg space-y-4">
        
        {/* Search Bar & Stats Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
            <input
              type="text"
              placeholder="Search by centre name, city, location or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10.5 pr-4 py-2 text-sm bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227]/20 focus:border-[#C9A227] text-white placeholder-white/30"
            />
          </div>
          
          <div className="flex items-center gap-2.5">
            {/* CSV Download Pin */}
            <button
              id="export-csv"
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white/80 hover:bg-white/5 bg-[#0A0B0D] hover:text-[#C9A227] border border-white/10 rounded-xl transition-colors cursor-pointer"
              title="Export filtered directory results to Excel/CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {/* Layout Toggles */}
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/5">
              <button
                id="layout-grid"
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${layoutMode === 'grid' ? 'bg-[#C9A227] text-black shadow-md' : 'text-white/40 hover:text-white/80'}`}
                title="Grid layout view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="layout-list"
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${layoutMode === 'list' ? 'bg-[#C9A227] text-black shadow-md' : 'text-white/40 hover:text-white/80'}`}
                title="List layout view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Division: Regions & Countries */}
        <div className="border-t border-white/10 pt-4 space-y-4">
          
          {/* Broad Region Switcher Tab Bar */}
          <div className="flex flex-wrap gap-1.5">
            {uniqueRegions.map((region) => {
              const regionKey = region === 'All' ? 'All' : region;
              const isSelected = selectedRegion === regionKey || (region === 'All' && !selectedRegion);
              return (
                <button
                  key={region}
                  onClick={() => {
                    onSelectRegion(region === 'All' ? '' : region);
                    onSelectCountry(''); // Reset country when shifting region
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#C9A227] text-black font-semibold shadow-md shadow-[#C9A227]/15' 
                      : 'bg-[#0A0B0D] text-white/50 hover:bg-white/5 border border-white/5 hover:text-white'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>

          {/* Individual Country Filter Sliders / List */}
          <div className="flex items-center gap-2 pt-2 border-t border-dashed border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 shrink-0">Filter Country:</span>
            <div className="flex flex-wrap gap-1.5 overflow-x-auto max-h-[110px] scrollbar-thin">
              <button
                onClick={() => onSelectCountry('')}
                className={`px-2 py-1 text-[11px] font-semibold border rounded-md transition-colors cursor-pointer ${
                  !selectedCountry 
                    ? 'bg-[#C9A227]/15 border-[#C9A227]/25 text-[#C9A227]' 
                    : 'bg-black/30 border-white/5 text-white/45 hover:text-white hover:bg-white/5'
                }`}
              >
                All Countries
              </button>
              
              {uniqueCountries.map(country => {
                // Only show country badges that reside in the currently selected region
                const region = COUNTRY_REGIONS[country];
                if (selectedRegion && region !== selectedRegion) return null;

                const isSelected = selectedCountry === country;
                return (
                  <button
                    key={country}
                    onClick={() => onSelectCountry(isSelected ? '' : country)}
                    className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-medium border rounded-md transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#C9A227]/15 border-[#C9A227]/25 text-[#C9A227]'
                        : 'bg-[#0A0B0D] text-white/45 border-white/5 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {country}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Directory Metadata Line */}
        <div className="border-t border-white/10 pt-3 flex justify-between items-center text-xs text-white/40">
          <span>
            Showing <strong className="font-semibold text-white/85">{filteredCentres.length}</strong> of {centres.length} vocational centers
          </span>
          <div className="flex gap-4 font-semibold">
            <button onClick={() => handleSortToggle('centre')} className="hover:text-[#C9A227] flex items-center gap-1 transition-colors cursor-pointer">
              Name <ArrowUpDown className="w-3 h-3" />
            </button>
            <button onClick={() => handleSortToggle('country')} className="hover:text-[#C9A227] flex items-center gap-1 transition-colors cursor-pointer">
              Country <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Directory Grid/List Layout Outputs */}
      {filteredCentres.length > 0 ? (
        layoutMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCentres.map((centre) => {
              const isSelected = selectedCentre?.centre === centre.centre;
              const region = COUNTRY_REGIONS[centre.country] || 'Other';
              const regionStyle = REGION_COLORS[region] || { border: "border-white/10", bg: "bg-white/5", text: "text-white/70" };
              const inComparison = compareList.some(c => c.centre === centre.centre);

              return (
                <div
                  key={centre.centre}
                  onClick={() => onSelectCentre(centre)}
                  className={`group relative flex flex-col justify-between bg-[#0F1116] border rounded-2xl p-5 shadow-lg hover:bg-[#14171D] transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-[#C9A227] ring-2 ring-[#C9A227]/20' 
                      : 'border-white/10'
                  }`}
                >
                  <div className="space-y-3.5">
                    
                    {/* Header line with tag badges */}
                    <div className="flex justify-between items-center gap-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${regionStyle.border} ${regionStyle.bg} ${regionStyle.text}`}>
                        {region}
                      </span>
                      
                      {/* Compare toggle trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCompare(centre);
                        }}
                        className="opacity-100 p-1.5 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-all cursor-pointer"
                        title={inComparison ? "Remove from Compare" : "Compare this Centre"}
                      >
                        {inComparison ? (
                          <BookmarkCheck className="w-4.5 h-4.5 text-[#C9A227]" />
                        ) : (
                          <Bookmark className="w-4.5 h-4.5" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-white group-hover:text-[#C9A227] transition-colors leading-snug">
                        {centre.centre}
                      </h4>
                      <p className="inline-flex items-center gap-1 text-xs text-white/50">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C9A227]/70" />
                        <span>{centre.location}, {centre.country}</span>
                      </p>
                    </div>

                    {/* Vocational Profiles Integration */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-white/40 font-mono">Founded: <strong>{centre.established}</strong></span>
                        <span className="text-emerald-400 font-bold font-mono">{centre.capacity} Slots</span>
                      </div>
                      
                      {/* Visual Load Bar */}
                      <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all" 
                          style={{ width: `${Math.min(100, Math.max(25, (centre.capacity / 900) * 100))}%` }} 
                        />
                      </div>

                      {/* Display Courses badges */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {centre.trades?.slice(0, 2).map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-white/5 border border-white/5 text-white/60">
                            ⚙️ {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions line */}
                  <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
                    <div className="text-[10px] font-mono text-white/30">
                      {centre.coordinates.lat.toFixed(3)}°N, {centre.coordinates.lon.toFixed(3)}°E
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCentre(centre);
                        onSelectRegion(COUNTRY_REGIONS[centre.country] || '');
                        onSelectCountry(centre.country);
                        onActiveTab('map');
                      }}
                      className="text-[11px] font-bold text-[#C9A227] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Show on Map</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List layout */
          <div className="bg-[#0F1116] border border-white/10 rounded-2xl overflow-hidden shadow-lg divide-y divide-white/5">
            {filteredCentres.map((centre) => {
              const isSelected = selectedCentre?.centre === centre.centre;
              const region = COUNTRY_REGIONS[centre.country] || 'Other';
              const regionStyle = REGION_COLORS[region] || { border: "border-white/10", bg: "bg-white/5", text: "text-white/70" };
              const inComparison = compareList.some(c => c.centre === centre.centre);

              return (
                <div
                  key={centre.centre}
                  onClick={() => onSelectCentre(centre)}
                  className={`group/row flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 cursor-pointer hover:bg-white/5 transition-colors ${
                    isSelected ? 'bg-[#C9A227]/10' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0 space-y-1.5 md:space-y-0.5 md:pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                       <span className={`inline-flex px-1.5 py-0.2 rounded text-[9px] font-extrabold border ${regionStyle.border} ${regionStyle.bg} ${regionStyle.text}`}>
                        {region}
                      </span>
                      <span className="text-[10px] font-mono text-white/30 md:ml-3">
                        {centre.coordinates.lat.toFixed(3)}°N, {centre.coordinates.lon.toFixed(3)}°E
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white truncate group-hover/row:text-[#C9A227] transition-colors">
                      {centre.centre}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-white/5 pt-2 md:pt-0">
                    <p className="text-xs text-white/50 shrink-0">
                      📍 {centre.location}, <strong className="text-white/80">{centre.country}</strong>
                    </p>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCompare(centre);
                        }}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white cursor-pointer"
                        title="Add to Compare"
                      >
                        {inComparison ? (
                          <BookmarkCheck className="w-4 h-4 text-[#C9A227]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCentre(centre);
                          onSelectRegion(COUNTRY_REGIONS[centre.country] || '');
                          onSelectCountry(centre.country);
                          onActiveTab('map');
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold bg-[#C9A227] hover:bg-[#C9A227]/90 text-black rounded-md transition-colors cursor-pointer"
                      >
                        Map View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="bg-[#0F1116] border border-white/10 rounded-2xl py-14 flex flex-col justify-center items-center text-center">
          <Info className="w-10 h-10 text-[#C9A227]/60 mb-3 animate-bounce" />
          <h4 className="font-bold text-white">No matching centers found</h4>
          <p className="text-xs text-white/40 max-w-md mt-1.5 px-4">
            Try resetting country filters, selecting "All Regions", or clearing search keywords.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCountry('');
              onSelectRegion('');
            }}
            className="mt-5 inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold bg-[#C9A227] hover:bg-[#C9A227]/90 text-black rounded-xl shadow-md shadow-[#C9A227]/10 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
