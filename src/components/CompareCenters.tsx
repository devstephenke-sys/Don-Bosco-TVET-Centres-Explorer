import React, { useMemo } from 'react';
import { TVETCentre } from '../types';
import { COUNTRY_REGIONS, REGION_COLORS } from '../data';
import { Shuffle, Trash2, MapPin, Calculator, Navigation, Bookmark } from 'lucide-react';

interface CompareCentersProps {
  compareList: TVETCentre[];
  onRemoveFromCompare: (centre: TVETCentre) => void;
  onClearCompare: () => void;
  onActiveTab: (tab: any) => void;
  onSelectCentre: (centre: TVETCentre) => void;
}

// Proximity Calculator helper using Haversine formula
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1)); // Return rounded km value
}

export default function CompareCenters({
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onActiveTab,
  onSelectCentre
}: CompareCentersProps) {
  
  // Calculate relative geographic statistics if there are at least two centers selected
  const distanceMatrix = useMemo(() => {
    if (compareList.length < 2) return null;
    const matrix: { [key: string]: { [key: string]: number } } = {};
    
    compareList.forEach(c1 => {
      matrix[c1.centre] = {};
      compareList.forEach(c2 => {
        if (c1.centre === c2.centre) {
          matrix[c1.centre][c2.centre] = 0;
        } else {
          matrix[c1.centre][c2.centre] = calculateHaversineDistance(
            c1.coordinates.lat, c1.coordinates.lon,
            c2.coordinates.lat, c2.coordinates.lon
          );
        }
      });
    });
    return matrix;
  }, [compareList]);

  // Compute extremes, e.g. Westernmost, Easternmost, Northernmost, Southernmost
  const geographicExtremes = useMemo(() => {
    if (compareList.length === 0) return null;
    
    let northernmost = compareList[0];
    let southernmost = compareList[0];
    let easternmost = compareList[0];
    let westernmost = compareList[0];
    
    compareList.forEach(c => {
      if (c.coordinates.lat > northernmost.coordinates.lat) northernmost = c;
      if (c.coordinates.lat < southernmost.coordinates.lat) southernmost = c;
      if (c.coordinates.lon > easternmost.coordinates.lon) easternmost = c;
      if (c.coordinates.lon < westernmost.coordinates.lon) westernmost = c;
    });

    return { northernmost, southernmost, easternmost, westernmost };
  }, [compareList]);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Upper informational billing header */}
      <div className="bg-[#0F1116] border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-[#C9A227]" />
            Spotlight Comparison
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Compare geographic positions, regional distributions, and run real-time point-to-point proximity calculations.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={onClearCompare}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear comparison deck</span>
          </button>
        )}
      </div>

      {compareList.length > 0 ? (
        <div className="space-y-6">
          
          {/* Side-by-Side Spec Sheet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compareList.map((centre) => {
              const region = COUNTRY_REGIONS[centre.country] || 'Other';
              const regionStyle = REGION_COLORS[region] || { border: "border-white/10", bg: "bg-white/5", text: "text-white/70" };
              
              return (
                <div key={centre.centre} className="bg-[#0F1116] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative">
                  
                  {/* Remove Card Trigger */}
                  <button
                    onClick={() => onRemoveFromCompare(centre)}
                    className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-md text-white/40 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Remove center from compare"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-4">
                    <div>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-extrabold border ${regionStyle.border} ${regionStyle.bg} ${regionStyle.text} uppercase tracking-wider`}>
                        {region}
                      </span>
                      <h4 className="font-semibold text-base text-white mt-2.5 max-w-[85%]">
                        {centre.centre}
                      </h4>
                      <p className="inline-flex items-center gap-1 text-xs text-white/50 mt-1">
                        📍 {centre.location}, {centre.country}
                      </p>
                    </div>

                    {/* Spec List */}
                    <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs text-white/60">
                      <div className="flex justify-between">
                        <span className="font-medium text-white/40">Latitude:</span>
                        <span className="font-mono text-white/80">{centre.coordinates.lat.toFixed(5)}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-white/40">Longitude:</span>
                        <span className="font-mono text-white/80">{centre.coordinates.lon.toFixed(5)}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-white/40">Equator Distance:</span>
                        <span className="font-semibold text-white">
                          {Math.abs(calculateHaversineDistance(centre.coordinates.lat, centre.coordinates.lon, 0, centre.coordinates.lon))} km
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                    <button
                      onClick={() => {
                        onSelectCentre(centre);
                        onActiveTab('map');
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-[11px] font-bold bg-[#C9A227] hover:bg-[#C9A227]/90 text-black rounded-lg transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Map Spotlight</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Extended Proximity Matrices & Calculations */}
          {compareList.length >= 2 && distanceMatrix && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Distance Matrix Table */}
              <div className="bg-[#0F1116] border border-white/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-[#C9A227]" />
                  <h4 className="font-bold text-sm text-white">Point-to-Point Proximity (Air Distances)</h4>
                </div>
                <div className="overflow-x-auto border border-white/10 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#0A0B0D] text-white/40 uppercase tracking-wider text-[10px] font-bold border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Tvet Centre</th>
                        {compareList.map(c => (
                          <th key={c.centre} className="px-4 py-3 font-semibold truncate max-w-[120px]" title={c.centre}>
                            {c.centre.split(' ').slice(0, 2).join(' ')}...
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/70 font-medium">
                      {compareList.map(c1 => (
                        <tr key={c1.centre} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-bold truncate max-w-[140px] text-white" title={c1.centre}>
                            {c1.centre}
                          </td>
                          {compareList.map(c2 => {
                            const val = distanceMatrix[c1.centre][c2.centre];
                            return (
                              <td key={c2.centre} className="px-4 py-3 font-mono text-white/60">
                                {val === 0 ? (
                                  <span className="text-white/20 font-sans italic">Core</span>
                                ) : (
                                  <span className="font-semibold text-white/90">{val.toLocaleString()} km</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Geographic Extremes Card */}
              {geographicExtremes && (
                <div className="bg-[#0F1116] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Navigation className="w-5 h-5 text-[#C9A227]" />
                      <h4 className="font-bold text-sm text-white">Geographic Bounds Extremes (Deck Subset)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A227]/90 font-mono">Northernmost</span>
                        <p className="font-bold text-xs truncate text-white mt-1">{geographicExtremes.northernmost.centre}</p>
                        <span className="text-[10px] font-mono text-white/40">{geographicExtremes.northernmost.coordinates.lat.toFixed(4)}° N</span>
                      </div>

                      <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A227]/90 font-mono">Southernmost</span>
                        <p className="font-bold text-xs truncate text-white mt-1">{geographicExtremes.southernmost.centre}</p>
                        <span className="text-[10px] font-mono text-white/40">{geographicExtremes.southernmost.coordinates.lat.toFixed(4)}° S</span>
                      </div>

                      <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A227]/90 font-mono">Easternmost</span>
                        <p className="font-bold text-xs truncate text-white mt-1">{geographicExtremes.easternmost.centre}</p>
                        <span className="text-[10px] font-mono text-white/40">{geographicExtremes.easternmost.coordinates.lon.toFixed(4)}° E</span>
                      </div>

                      <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A227]/90 font-mono">Westernmost</span>
                        <p className="font-bold text-xs truncate text-white mt-1">{geographicExtremes.westernmost.centre}</p>
                        <span className="text-[10px] font-mono text-white/40">{geographicExtremes.westernmost.coordinates.lon.toFixed(4)}° W</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      ) : (
        <div className="bg-[#0F1116] border border-white/10 rounded-2xl py-14 flex flex-col justify-center items-center text-center">
          <Bookmark className="w-10 h-10 text-[#C9A227]/60 mb-3 animate-pulse" />
          <h4 className="font-bold text-white">Comparison Deck is Empty</h4>
          <p className="text-xs text-white/40 max-w-sm mt-1.5 px-4 leading-relaxed">
            Head over to the TVET Directory tab and use the bookmark icon on any center card to stage them for point-to-point comparison metrics.
          </p>
          <button
            onClick={() => onActiveTab('directory')}
            className="mt-5 inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold bg-[#C9A227] hover:bg-[#C9A227]/90 text-black rounded-xl shadow-md shadow-[#C9A227]/10 transition-colors cursor-pointer"
          >
            Open Directory
          </button>
        </div>
      )}

    </div>
  );
}
