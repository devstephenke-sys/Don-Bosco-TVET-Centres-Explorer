import React, { useState, useMemo, useRef } from 'react';
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
  selectedCountry,
  onSelectCountry,
  selectedRegion
}: MapSectionProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCentreId, setHoveredCentreId] = useState<string | null>(null);

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
    // Only drag with left mouse button click
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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

  // Center the map view on a selected center
  const centerOnItem = (item: { x: number; y: number }) => {
    // We want the projected item x, y to be in the center of the viewBox (width/2, height/2)
    // viewXY = itemXY * zoom + panXY = center => panXY = center - itemXY * zoom
    const zoomLevel = 2.5;
    setZoom(zoomLevel);
    setPan({
      x: width / 2 - item.x * zoomLevel,
      y: height / 2 - item.y * zoomLevel
    });
  };

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

        {/* Selected Centre Panel */}
        <div className="border-t border-white/10 pt-4 flex-1">
          {selectedCentre ? (
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/25">
                Active Spotlight
              </span>
              <div>
                <h4 className="font-bold text-white leading-tight text-sm sm:text-base">
                  {selectedCentre.centre}
                </h4>
                <p className="text-xs font-medium text-white/60 mt-1.5 flex items-center gap-1">
                  <span>📍</span> {selectedCentre.location}, {selectedCentre.country}
                </p>
                <div className="bg-black/35 px-3 py-2.5 rounded-lg border border-white/5 mt-3">
                  <span className="text-[9px] uppercase tracking-wider font-mono text-white/30 block mb-0.5">Projected Coordinates</span>
                  <p className="text-xs font-mono text-[#C9A227] mt-0.5">
                    {formatCoords(selectedCentre.coordinates.lat, selectedCentre.coordinates.lon)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const item = filteredCentresWithCoords.find(c => c.centre === selectedCentre.centre);
                  if (item) centerOnItem(item);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold bg-[#C9A227] hover:bg-[#C9A227]/90 text-black rounded-lg transition-colors shadow-md shadow-[#C9A227]/10 duration-200"
              >
                Center map here
              </button>
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
      <div className="lg:col-span-3 flex flex-col relative bg-[#0F1116] border border-white/10 rounded-2xl overflow-hidden shadow-lg group">
        
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
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 backdrop-blur-md bg-black/60 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-mono text-white/40 uppercase tracking-widest pointer-events-none shadow-sm">
          <Globe className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Equator Alignment Map Projection</span>
        </div>

        {/* Drag to Pan helpful alert */}
        <div className="absolute top-4 left-4 z-10 backdrop-blur-sm bg-black/85 text-white/80 border border-white/5 text-[10px] font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 duration-300 transition-opacity flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
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
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-white/[0.03]" strokeWidth="0.5" />
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
                  <g className="text-white/20 font-mono text-[8px] pointer-events-none">
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
                className="fill-black/35 stroke-white/5 transition-colors"
                strokeWidth="1.5"
                lineJoin="round"
              />
              {/* Madagascar Continental Shadow Base */}
              <path
                d={madagascarPath}
                className="fill-black/35 stroke-white/5 transition-colors"
                strokeWidth="1.5"
                lineJoin="round"
              />

              {/* Main SVG Coastline Map Render */}
              <path
                d={africaPath}
                className="fill-[#0A0B0D] stroke-white/10 transition-colors pointer-events-none"
                strokeWidth="1"
                lineJoin="round"
              />
              <path
                d={madagascarPath}
                className="fill-[#0A0B0D] stroke-white/10 transition-colors pointer-events-none"
                strokeWidth="1"
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
                      onSelectCentre({
                        centre: centre.centre,
                        location: centre.location,
                        coordinates: centre.coordinates,
                        country: centre.country
                      });
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
                      r={isSpotlighted ? 5.5 : isHovered ? 4.5 : 3.5}
                      className={`${colorConfig.dot} transition-all stroke-[#0A0B0D] stroke-1.5`}
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
