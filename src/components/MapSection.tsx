import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { TVETCentre } from '../types';
import { COUNTRY_REGIONS, REGION_COLORS } from '../data';
import { MapPin, ZoomIn, ZoomOut, RotateCcw, Globe, Info, Compass, HelpCircle } from 'lucide-react';

interface MapSectionProps {
  centres: TVETCentre[];
  selectedCentre: TVETCentre | null;
  onSelectCentre: (centre: TVETCentre | null) => void;
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

// Bounding box for mapping latitude/longitude to SVG viewport coordinates
// Custom adjusted bounds for Africa & surrounding islands
const MAP_BOUNDS = {
  maxLat: 18.0,   // Upper limit just above Khartoum
  minLat: -36.0,  // Lower limit just below Cape Town
  minLon: -20.0,  // Left limit just west of Dakar
  maxLon: 60.0    // Right limit just east of Mauritius / Madagascar
};

const AFRICA_OUTLINE_COORDS = [
  { lat: 36.0, lon: -6.0 },   // Morocco/Gibraltar
  { lat: 37.2, lon: 9.9 },    // Tunis
  { lat: 31.5, lon: 25.1 },   // Libya Coast
  { lat: 31.3, lon: 32.2 },   // Nile Delta
  { lat: 30.0, lon: 32.5 },   // Sinai/Suez
  { lat: 27.2, lon: 33.8 },   // Red Sea North
  { lat: 22.0, lon: 36.9 },   // Red Sea Middle
  { lat: 12.8, lon: 43.0 },   // Bab-el-Mandeb
  { lat: 11.8, lon: 51.2 },   // Cape Guardafui (Horn of Africa)
  { lat: 5.0, lon: 48.0 },    // Somalia coast
  { lat: -1.0, lon: 41.5 },   // Kenya coast
  { lat: -6.8, lon: 39.2 },   // Dar es Salaam
  { lat: -11.0, lon: 40.5 },  // Cabo Delgado
  { lat: -15.0, lon: 40.6 },  // Mozambique Middle
  { lat: -25.0, lon: 34.0 },  // Inharrime / Maputo
  { lat: -34.0, lon: 25.0 },  // Port Elizabeth
  { lat: -34.8, lon: 20.0 },  // Cape Agulhas (Southern Tip)
  { lat: -33.9, lon: 18.4 },  // Cape Town
  { lat: -22.5, lon: 14.4 },  // Namibia Coast
  { lat: -12.3, lon: 13.6 },  // Benguela, Angola
  { lat: -6.0, lon: 12.2 },   // Congo River Mouth
  { lat: -1.0, lon: 9.0 },    // Gabon Cape Lopez
  { lat: 4.0, lon: 9.2 },     // Cameroon / Bioko
  { lat: 6.2, lon: 1.2 },     // Togo coast
  { lat: 5.1, lon: -4.0 },    // Ivory Coast
  { lat: 7.5, lon: -12.5 },   // Sierra Leone
  { lat: 11.5, lon: -16.5 },  // Guinea-Bissau
  { lat: 14.7, lon: -17.5 },  // Dakar (Cap Vert / Westernmost)
  { lat: 21.0, lon: -17.0 },  // Nouadhibou, Mauritania
  { lat: 26.1, lon: -14.5 },  // Western Sahara
  { lat: 32.0, lon: -9.8 },   // Morocco West Coast
];

const MADAGASCAR_OUTLINE_COORDS = [
  { lat: -12.0, lon: 49.3 }, // North tip
  { lat: -15.3, lon: 50.4 }, // East coast
  { lat: -22.2, lon: 48.0 },
  { lat: -25.6, lon: 45.2 }, // South tip
  { lat: -23.4, lon: 43.7 }, // West Tuléar
  { lat: -15.8, lon: 46.3 }, // West Mahajanga
  { lat: -12.3, lon: 48.5 },
];

export default function MapSection({
  centres,
  selectedCentre,
  onSelectCentre,
  selectedCountry,  onSelectCountry,
  selectedRegion,
  onSelectRegion
}: MapSectionProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCentreId, setHoveredCentreId] = useState<string | null>(null);
  const [pointerCoords, setPointerCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [mapStyle, setMapStyle] = useState<'brand' | 'corporate' | 'gold_accent' | 'charcoal'>('brand');
  const [mapSearch, setMapSearch] = useState('');

  const svgRef = useRef<SVGSVGElement>(null);

  // Width and height of SVG viewport container
  const width = 800;
  const height = 700;

  // Projection helper: transforms lat/lon to X/Y
  const project = (lat: number, lon: number) => {
    const x = ((lon - MAP_BOUNDS.minLon) / (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon)) * width;
    // Latitude decreases downwards in SVG, so subtract from maxLat
    const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * height;
    return { x, y };
  };

  // Build SVG path strings for outlines
  const africaPath = useMemo(() => {
    const points = AFRICA_OUTLINE_COORDS.map(coord => {
      const { x, y } = project(coord.lat, coord.lon);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  }, []);

  const madagascarPath = useMemo(() => {
    const points = MADAGASCAR_OUTLINE_COORDS.map(coord => {
      const { x, y } = project(coord.lat, coord.lon);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')} Z`;
  }, []);

  // Format latitude and longitude coordinates nicely
  const formatCoords = (lat: number, lon: number) => {
    const latDirection = lat >= 0 ? 'N' : 'S';
    const lonDirection = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}° ${latDirection}, ${Math.abs(lon).toFixed(4)}° ${lonDirection}`;
  };

  // Filter lists for sidebar controls
  const uniqueRegions = ['All', 'West Africa', 'East Africa', 'Central Africa', 'Southern Africa'];
  const uniqueCountries = useMemo(() => {
    const list = new Set<string>();
    centres.forEach(c => {
      const region = COUNTRY_REGIONS[c.country] || 'Other';
      if (!selectedRegion || region === selectedRegion) {
        list.add(c.country);
      }
    });
    return Array.from(list).sort();
  }, [centres, selectedRegion]);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.3, 5));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.3, 0.8));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    onSelectCentre(null);
  };

  // Drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // Left mouse click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    
    // Position of hover cursor inside localized SVG viewport
    const clickX = ((e.clientX - rect.left) / rect.width) * width;
    const clickY = ((e.clientY - rect.top) / rect.height) * height;

    // Apply inverse zoom and pan transformations
    const interiorX = (clickX - pan.x) / zoom;
    const interiorY = (clickY - pan.y) / zoom;

    const lon = (interiorX / width) * (MAP_BOUNDS.maxLon - MAP_BOUNDS.minLon) + MAP_BOUNDS.minLon;
    const lat = MAP_BOUNDS.maxLat - (interiorY / height) * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat);

    if (lat >= MAP_BOUNDS.minLat && lat <= MAP_BOUNDS.maxLat && lon >= MAP_BOUNDS.minLon && lon <= MAP_BOUNDS.maxLon) {
      setPointerCoords({ lat, lon });
    } else {
      setPointerCoords(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Styles map configuration
  const styleConfig = useMemo(() => {
    switch (mapStyle) {
      case 'corporate':
        return {
          bg: "bg-[#060F1A]",
          coastline: "fill-[#10233D] stroke-sky-400/40",
          gridColor: "text-sky-450/[0.04]",
          gridLine: "text-sky-400/15"
        };
      case 'gold_accent':
        return {
          bg: "bg-[#141108]",
          coastline: "fill-[#241F10] stroke-[#C9A227]/30",
          gridColor: "text-amber-500/[0.04]",
          gridLine: "text-amber-500/15"
        };
      case 'charcoal':
        return {
          bg: "bg-[#0B0D11]",
          coastline: "fill-[#14171E] stroke-white/10",
          gridColor: "text-white/[0.02]",
          gridLine: "text-white/8"
        };
      case 'brand':
      default:
        return {
          bg: "bg-[#0A0D14]",
          coastline: "fill-[#111A26] stroke-[#2ec4b6]/25",
          gridColor: "text-[#C9A227]/[0.03]",
          gridLine: "text-emerald-500/10"
        };
    }
  }, [mapStyle]);

  // Highlight filters
  const filteredCentresWithCoords = useMemo(() => {
    return centres.map(centre => {
      const { x, y } = project(centre.coordinates.lat, centre.coordinates.lon);
      const region = COUNTRY_REGIONS[centre.country] || 'Other';
      
      const matchesCountry = !selectedCountry || centre.country === selectedCountry;
      const matchesRegion = !selectedRegion || region === selectedRegion;
      const isSelected = selectedCentre?.centre === centre.centre;
      
      return {
        ...centre,
        x,
        y,
        region,
        isActive: matchesCountry && matchesRegion,
        isSelected
      };
    });
  }, [centres, selectedCountry, selectedRegion, selectedCentre]);

  // Filter centers based on query
  const searchResults = useMemo(() => {
    if (!mapSearch) return [];
    return filteredCentresWithCoords
      .filter(c => c.isActive && c.centre.toLowerCase().includes(mapSearch.toLowerCase()))
      .slice(0, 4);
  }, [filteredCentresWithCoords, mapSearch]);

  // Center the map view on a selected center
  const centerOnItem = (item: { x: number; y: number }) => {
    const zoomLevel = 2.4;
    setZoom(zoomLevel);
    setPan({
      x: width / 2 - item.x * zoomLevel,
      y: height / 2 - item.y * zoomLevel
    });
  };

  // Auto-center map on selected centre when selectedCentre changes
  useEffect(() => {
    if (selectedCentre) {
      const { x, y } = project(selectedCentre.coordinates.lat, selectedCentre.coordinates.lon);
      centerOnItem({ x, y });
    }
  }, [selectedCentre]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Sidebar - Quick Focus Controls */}
      <div className="lg:col-span-1 bg-[#0F1116] border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
        <div>
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#C9A227]" />
            Bespoke Mapping
          </h3>
          <p className="text-xs text-white/40 mt-1">
            Plotted on interactive coordinate grids projecting actual GPS coordinates of TVET centres.
          </p>
        </div>

        {/* Map Theme Style Selector */}
        <div className="space-y-1.5 border-t border-white/10 pt-4">
          <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">Map Visual Style</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'brand', label: 'Classic Brand' },
              { id: 'corporate', label: 'Tech Oceanic' },
              { id: 'gold_accent', label: 'Gold Contrast' },
              { id: 'charcoal', label: 'Slate Charcoal' }
            ].map(themeItem => (
              <button
                key={themeItem.id}
                onClick={() => setMapStyle(themeItem.id as any)}
                className={`py-1.5 px-2 text-[10.5px] font-medium rounded-lg border text-center transition-all cursor-pointer ${
                  mapStyle === themeItem.id
                    ? 'bg-[#C9A227]/15 border-[#C9A227]/30 text-[#C9A227]'
                    : 'bg-[#0A0B0D] border-white/5 text-white/55 hover:text-white hover:border-white/15'
                }`}
              >
                {themeItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map Quick Flight Search */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">Quick Center Flight</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search center name..."
              value={mapSearch}
              onChange={(e) => setMapSearch(e.target.value)}
              className="w-full bg-black/45 border border-white/10 text-white rounded-xl py-2 px-3 text-xs outline-none focus:ring-1 focus:ring-[#C9A227] focus:border-[#C9A227]"
            />
            {mapSearch && (
              <button
                onClick={() => setMapSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-[11px]"
              >
                Clear
              </button>
            )}
          </div>
          {searchResults.length > 0 && (
            <div className="bg-[#0A0B0D] border border-white/15 rounded-xl mt-1.5 overflow-hidden shadow-2xl divide-y divide-white/5">
              {searchResults.map(res => (
                <button
                  key={res.centre}
                  onClick={() => {
                    onSelectCentre(res);
                    centerOnItem(res);
                    setMapSearch('');
                  }}
                  className="w-full text-left px-3 py-2 text-[11px] text-white/70 hover:text-white hover:bg-white/5 truncate block"
                >
                  🎯 {res.centre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Map Filters Selectors */}
        <div className="border-t border-white/10 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#C9A227] text-xs uppercase tracking-wider">Map Filters</span>
            {(selectedRegion || selectedCountry) && (
              <button
                onClick={() => {
                  onSelectRegion('');
                  onSelectCountry('');
                }}
                className="text-[10px] text-rose-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          
          {/* Region Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">Geographic Region</label>
            <select
              value={selectedRegion || 'All'}
              onChange={(e) => {
                const reg = e.target.value;
                onSelectRegion(reg === 'All' ? '' : reg);
                onSelectCountry(''); // Reset country on region shifts
              }}
              className="w-full bg-black/45 border border-white/10 text-white rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#C9A227] focus:border-[#C9A227] outline-none cursor-pointer transition-colors hover:border-white/20"
            >
              <option value="All">All Regions (Continent)</option>
              {uniqueRegions.filter(r => r !== 'All').map(r => (
                <option key={r} value={r} className="bg-[#0F1116] text-white">{r}</option>
              ))}
            </select>
          </div>

          {/* Country Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-bold">Focus Country</label>
            <select
              value={selectedCountry || 'All'}
              onChange={(e) => {
                const c = e.target.value;
                onSelectCountry(c === 'All' ? '' : c);
              }}
              className="w-full bg-black/45 border border-white/10 text-white rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-[#C9A227] focus:border-[#C9A227] outline-none cursor-pointer transition-colors hover:border-white/20"
            >
              <option value="All">All Countries</option>
              {uniqueCountries.map(c => (
                <option key={c} value={c} className="bg-[#0F1116] text-white">{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Centre Panel */}
        <div className="border-t border-white/10 pt-4 flex-1">
          {selectedCentre ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/25">
                  Center Spotlight
                </span>
                <span className="text-[10px] font-mono text-white/40">Est. {selectedCentre.established}</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white leading-tight text-[14px]">
                    {selectedCentre.centre}
                  </h4>
                  <p className="text-[11px] font-medium text-white/50 mt-1.5 flex items-center gap-1">
                    <span>📍</span> {selectedCentre.location}, {selectedCentre.country}
                  </p>
                </div>

                {/* Capacity metric */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-mono text-white/40 uppercase tracking-wider font-bold">Enrollment Capacity</span>
                    <span className="font-bold text-emerald-400 font-mono">{selectedCentre.capacity} student slots</span>
                  </div>
                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, Math.max(30, (selectedCentre.capacity / 900) * 100))}%` }} 
                    />
                  </div>
                </div>

                {/* Core Trade lists */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-bold">Core Sector Curriculums</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCentre.trades?.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded text-[9.5px] font-semibold bg-white/5 border border-white/10 text-white/80">
                        ⚡ {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Micro coordinates projection card */}
                <div className="bg-black/45 px-3 py-2 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[8px] uppercase tracking-wider font-mono text-white/30 block">Cartographic Fix</span>
                  <p className="text-[10px] font-mono text-[#C9A227]">
                    {formatCoords(selectedCentre.coordinates.lat, selectedCentre.coordinates.lon)}
                  </p>
                </div>
              </div>

              {/* Action utilities */}
              <div className="pt-1.5 flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    const item = filteredCentresWithCoords.find(c => c.centre === selectedCentre.centre);
                    if (item) centerOnItem(item);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#C9A227] hover:bg-[#C9A227]/90 text-black rounded-lg transition-colors shadow-sm shadow-[#C9A227]/10 duration-200 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Center map here</span>
                </button>

                <a
                  href={`mailto:elearning.assistant@dbtechafrica.org?subject=Inquiry: ${encodeURIComponent(selectedCentre.centre)}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors text-center duration-200"
                >
                  <span>Inquire Office</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center py-8 text-center bg-black/20 rounded-xl border border-dashed border-white/10">
              <MapPin className="w-8 h-8 text-[#C9A227]/40 mb-2 animate-pulse" />
              <p className="text-xs font-medium text-white/40 px-4 leading-relaxed">
                Hover over map markers or click a TVET centre to trigger geographical spotlight.
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="border-t border-white/10 pt-4 text-xs space-y-2">
          <span className="font-semibold text-white/50 block mb-1">Regional Color Mapping</span>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(REGION_COLORS).map(reg => (
              <div key={reg} className="flex items-center gap-1.5 font-medium text-white/70">
                <span className={`w-2 h-2 rounded-full ${REGION_COLORS[reg].dot}`} />
                <span>{reg.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Box */}
      <div className={`lg:col-span-3 flex flex-col relative ${styleConfig.bg} border border-[#C9A227]/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 group`}>
        
        {/* Navigation Toolbar Overlay */}
        <div className="absolute top-4 right-4 z-10 flex gap-1.5 bg-[#0A0B0D]/95 p-1 rounded-xl shadow-lg border border-white/10 backdrop-blur-md">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 hover:bg-white/5 rounded-lg text-white/70 hover:text-[#C9A227] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 hover:bg-white/5 rounded-lg text-white/70 hover:text-[#C9A227] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Reset Map Layout"
            className="p-2 hover:bg-white/5 rounded-lg text-white/70 hover:text-[#C9A227] transition-colors flex items-center justify-center cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Grid Stats overlay on bottom corner of the map */}
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex flex-col gap-1 backdrop-blur-md bg-black/65 border border-white/5 px-3 py-2 rounded-xl text-[10px] font-mono text-white/40 pointer-events-none shadow-xl">
          <div className="flex items-center gap-2 text-[#C9A227] uppercase tracking-widest font-extrabold text-[9px]">
            <Globe className="w-3.5 h-3.5" />
            <span>Map Grid Projection</span>
          </div>
          {pointerCoords ? (
            <div className="text-white/80 font-mono mt-0.5">
              Cursor: <span className="text-[#C9A227] font-semibold">{formatCoords(pointerCoords.lat, pointerCoords.lon)}</span>
            </div>
          ) : (
            <span className="text-white/30 text-[9px] uppercase tracking-wide mt-0.5">Cursor out of Bounds</span>
          )}
        </div>

        {/* Drag to Pan helpful alert */}
        <div className="absolute top-4 left-4 z-10 backdrop-blur-sm bg-black/85 text-white/80 border border-white/5 text-[10px] font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 duration-300 transition-opacity flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-[#C9A227]" />
          <span>Left-click + drag to pan continent</span>
        </div>

        {/* SVG Projection Canvas */}
        <div className="w-full relative h-[600px] sm:h-[650px] md:h-[700px] overflow-hidden cursor-move">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background Map Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className={`${styleConfig.gridColor}`} strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              
              {/* Equator & Tropics dashed lanes */}
              {(() => {
                // Equator lies at lat 0.0
                const equatorProj = project(0, 0);
                // Tropic of Cancer at lat 23.436
                const cancerProj = project(23.436, 0);
                // Tropic of Capricorn at lat -23.436
                const capricornProj = project(-23.436, 0);

                return (
                  <g className="text-white/15 font-mono text-[8px] pointer-events-none">
                    {/* Equator */}
                    <line x1={0} y1={equatorProj.y} x2={width} y2={equatorProj.y} stroke="currentColor" strokeDasharray="3,5" strokeWidth="1" />
                    <text x={20} y={equatorProj.y - 4} fill="currentColor">EQUATOR (0° 00' N/S)</text>

                    {/* Capricorn */}
                    <line x1={0} y1={capricornProj.y} x2={width} y2={capricornProj.y} stroke="currentColor" strokeDasharray="1,8" strokeWidth="1" />
                    <text x={20} y={capricornProj.y - 4} fill="currentColor">TROPIC OF CAPRICORN (23° 26' S)</text>
                  </g>
                );
              })()}

              {/* Africa Continental Shadow Base */}
              <path
                d={africaPath}
                className="fill-black/35 stroke-none transition-colors"
                strokeWidth="1.5"
                lineJoin="round"
              />
              {/* Madagascar Continental Shadow Base */}
              <path
                d={madagascarPath}
                className="fill-black/35 stroke-none transition-colors"
                strokeWidth="1.5"
                lineJoin="round"
              />

              {/* Main SVG Coastline Map Render */}
              <path
                d={africaPath}
                className={`${styleConfig.coastline} transition-colors duration-500 pointer-events-none`}
                strokeWidth="1.2"
                lineJoin="round"
              />
              <path
                d={madagascarPath}
                className={`${styleConfig.coastline} transition-colors duration-500 pointer-events-none`}
                strokeWidth="1.2"
                lineJoin="round"
              />

              {/* TVET Centre Coordinate Nodes / Markers */}
              {filteredCentresWithCoords.map((centre) => {
                const colorConfig = REGION_COLORS[centre.region] || {
                  border: "border-indigo-500/20",
                  bg: "bg-indigo-50/50",
                  text: "text-indigo-750",
                  dot: "bg-indigo-500"
                };
                const isSpotlighted = selectedCentre?.centre === centre.centre;
                const isHovered = hoveredCentreId === centre.centre;
                
                // Dim markers that don't match our active filter query
                const opacity = !centre.isActive ? "opacity-15 pointer-events-none" : "opacity-100";

                return (
                  <g
                    key={centre.centre}
                    className={`transition-all duration-300 cursor-pointer ${opacity}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCentre(centre);
                    }}
                    onMouseEnter={() => setHoveredCentreId(centre.centre)}
                    onMouseLeave={() => setHoveredCentreId(null)}
                  >
                    {/* Pulsing ring around spotlighted / clicked center */}
                    {(isSpotlighted || isHovered) && (
                      <circle
                        cx={centre.x}
                        cy={centre.y}
                        r={isSpotlighted ? 12 : 8}
                        className={`stroke-2 stroke-current ${colorConfig.text} fill-none`}
                        opacity="0.6"
                      >
                        <animate
                          attributeName="r"
                          values={isSpotlighted ? "5;14;5" : "4;10;4"}
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Centre Node Dot */}
                    <circle
                      cx={centre.x}
                      cy={centre.y}
                      r={isSpotlighted ? 6.5 : isHovered ? 5.5 : 4.5}
                      className={`fill-current ${colorConfig.text} transition-all stroke-white stroke-1.5 shadow-md`}
                    />
                  </g>
                );
              })}

              {/* Interactive Info Window overlaying on the hover node */}
              {filteredCentresWithCoords.map((centre) => {
                if (hoveredCentreId !== centre.centre) return null;
                const regionColor = REGION_COLORS[centre.region] || {
                  border: "border-zinc-500/20",
                  bg: "bg-zinc-50/50",
                  text: "text-[#C9A227]",
                  dot: "bg-zinc-500"
                };
                const isUpperHalf = centre.y < height / 2;

                return (
                  <g
                    key={`tooltip-${centre.centre}`}
                    className="pointer-events-none"
                    transform={`translate(${centre.x}, ${centre.y})`}
                  >
                    {/* Frame Container aligned vertically based on SVG position to avoid clipping */}
                    <foreignObject
                      x={-110}
                      y={isUpperHalf ? 15 : -95}
                      width={220}
                      height={90}
                    >
                      <div className="bg-[#14171D] text-white px-3 py-2.5 rounded-xl shadow-xl text-center border border-white/10">
                        <span className={`text-[9px] uppercase tracking-wider font-extrabold ${regionColor.text}`}>
                          {centre.country} • {centre.region}
                        </span>
                        <h5 className="font-bold text-[10px] sm:text-xs truncate max-w-full mt-0.5 leading-tight text-white/90">
                          {centre.centre}
                        </h5>
                        <p className="text-[9px] font-medium text-white/50 mt-1 truncate">
                          📍 {centre.location}
                        </p>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
