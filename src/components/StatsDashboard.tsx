import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { TVETCentre } from '../types';
import { COUNTRY_REGIONS, REGION_COLORS } from '../data';
import { BarChart3, TrendingUp, Layers, Map, Compass, BookOpen, GraduationCap, Award } from 'lucide-react';

interface StatsDashboardProps {
  centres: TVETCentre[];
  onSelectCountry: (country: string) => void;
  onSelectRegion: (region: string) => void;
  activeTab: (tab: any) => void;
}

export default function StatsDashboard({
  centres,
  onSelectCountry,
  onSelectRegion,
  activeTab
}: StatsDashboardProps) {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [metricMode, setMetricMode] = useState<'count' | 'percentage'>('count');

  // Compute country counts
  const countryCounts = useMemo(() => {
    const list: { [key: string]: number } = {};
    centres.forEach(c => {
      list[c.country] = (list[c.country] || 0) + 1;
    });
    return Object.keys(list).map(country => ({
      country,
      count: list[country],
      percentage: ((list[country] / centres.length) * 100).toFixed(1),
      region: COUNTRY_REGIONS[country] || 'Other'
    })).sort((a, b) => {
      return sortOrder === 'desc' ? b.count - a.count : a.count - b.count;
    });
  }, [centres, sortOrder]);

  // Compute regional counts
  const regionStats = useMemo(() => {
    const list: { [key: string]: { count: number; countries: Set<string> } } = {
      "West Africa": { count: 0, countries: new Set() },
      "East Africa": { count: 0, countries: new Set() },
      "Central Africa": { count: 0, countries: new Set() },
      "Southern Africa": { count: 0, countries: new Set() },
    };

    centres.forEach(c => {
      const region = COUNTRY_REGIONS[c.country];
      if (region && list[region]) {
        list[region].count += 1;
        list[region].countries.add(c.country);
      }
    });

    return Object.keys(list).map(region => ({
      region,
      count: list[region].count,
      countryCount: list[region].countries.size,
      percentage: ((list[region].count / centres.length) * 100).toFixed(1),
    }));
  }, [centres]);

  const maxCountryCount = useMemo(() => {
    return Math.max(...countryCounts.map(c => c.count), 1);
  }, [countryCounts]);

  // Static analytical insights derived from data
  const insights = [
    {
      title: "Stronghold of Practical Arts",
      desc: "Central Africa leads vocational concentrations—DR Congo alone hosts 24 centres focusing heavily on technical engineering, trades, and mechanical skills (e.g., Institut Technique de Lubumbashi, Salama).",
      icon: ToolIcon
    },
    {
      title: "Southern Agricultural Core",
      desc: "Zambia & Mozambique lead Southern Africa's training network with specialized agricultural institutes (e.g. Lufubu Agriculture College, Bosco Youth Agricultural Centre) combining academic curriculum with hands-on food security skills.",
      icon: FarmIcon
    },
    {
      title: "West African Textiles & Crafts",
      desc: "Regional focuses like 'Don Bosco Stitches' in Lagos, Nigeria, and 'Centre Garelli' in Porto Novo, Benin showcase specialized micro-entrepreneurship programs that nurture immediate local employment.",
      icon: StitchIcon
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Upper Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F1116] border border-white/10 p-5 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227]">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block">Total TVET Centres</span>
            <span className="text-3xl font-bold text-white">{centres.length}</span>
          </div>
        </div>

        <div className="bg-[#0F1116] border border-white/10 p-5 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-400">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block">Nations Represented</span>
            <span className="text-3xl font-bold text-white">{Object.keys(COUNTRY_REGIONS).length}</span>
          </div>
        </div>

        <div className="bg-[#0F1116] border border-white/10 p-5 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block">Avg. Centres / Nation</span>
            <span className="text-3xl font-bold text-white">
              {(centres.length / Object.keys(COUNTRY_REGIONS).length).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="bg-[#0F1116] border border-white/10 p-5 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block">Peak Concentration</span>
            <span className="text-xl font-bold text-white truncate max-w-[150px] block" title="DR Congo (24)">DR Congo (24)</span>
          </div>
        </div>
      </div>

      {/* Subregional Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {regionStats.map((reg) => {
          const uiColors = REGION_COLORS[reg.region] || { border: "border-white/10", bg: "bg-white/5", text: "text-white/70", dot: "bg-white/40" };
          return (
            <div
              key={reg.region}
              className={`bg-[#0F1116] border ${uiColors.border} p-5 rounded-2xl shadow-lg flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold uppercase tracking-wider ${uiColors.text}`}>
                    {reg.region}
                  </span>
                  <span className={`w-3 h-3 rounded-full ${uiColors.dot}`} />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">{reg.count}</span>
                  <span className="text-sm text-white/40">centres ({reg.percentage}%)</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-white/40">Active Countries:</span>
                <span className="font-semibold text-white/70">{reg.countryCount} nations</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Analytical Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Country Bar Chart - Visualized with responsive SVGs & Framer Motion */}
        <div className="lg:col-span-2 bg-[#0F1116] border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#C9A227]" />
                Distribution by Country
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Comparative ranking of centers currently listed within the official TVET dataset.
              </p>
            </div>
            
            {/* Sort Order Toggles */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#0A0B0D] font-semibold text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
              >
                Sort: {sortOrder === 'desc' ? 'High → Low' : 'Low → High'}
              </button>
              <button
                onClick={() => setMetricMode(prev => prev === 'count' ? 'percentage' : 'count')}
                className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#0A0B0D] font-semibold text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
                title="Toggle Metric Type"
              >
                Metric: {metricMode === 'count' ? 'Count' : 'Share %'}
              </button>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin">
            {countryCounts.map((data) => {
              const regionColor = REGION_COLORS[data.region] || { dot: "bg-[#C9A227]" };
              const percentOfMax = (data.count / maxCountryCount) * 100;
              
              return (
                <div key={data.country} className="group/item flex items-center gap-4">
                  <div className="w-24 text-right">
                    <button
                      onClick={() => {
                        onSelectCountry(data.country);
                        activeTab('directory');
                      }}
                      className="text-xs font-semibold text-white/70 hover:text-[#C9A227] text-right w-full truncate block transition-colors cursor-pointer"
                      title={`Filter by ${data.country}`}
                    >
                      {data.country}
                    </button>
                  </div>
                  
                  {/* Dynamic Progress/Bar Track */}
                  <div className="flex-1 h-7 bg-black/40 rounded-lg overflow-hidden border border-white/10 relative flex items-center px-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentOfMax}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-5 rounded-md ${regionColor.dot} opacity-80 group-hover/item:opacity-100 transition-opacity`}
                    />
                    
                    {/* Floating label for exact count in bar representation */}
                    <span className="absolute right-3.5 text-[10px] font-mono font-bold text-white/40">
                      {metricMode === 'count' ? `${data.count} centres` : `${data.percentage}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Static Specialized Insights Cards */}
        <div className="bg-[#0F1116] border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#C9A227]" />
              Impact Insights
            </h3>
            <p className="text-xs text-white/50 mt-0.5 mb-5">
              Highlighting curated regional structures and operational clusters across our networks.
            </p>

            <div className="space-y-4">
              {insights.map((ins, i) => (
                <div key={i} className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-start gap-3">
                  <span className="mt-0.5">{ins.icon()}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {ins.title}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-white/50 mt-1">
                      {ins.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Icons for stats insight cards
function ToolIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 text-[#C9A227] flex items-center justify-center shrink-0">
      <GraduationCap className="w-4 h-4" />
    </div>
  );
}

// Icons for stats insight cards
function FarmIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 text-[#C9A227] flex items-center justify-center shrink-0">
      <Compass className="w-4 h-4" />
    </div>
  );
}

// Icons for stats insight cards
function StitchIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-[#C9A227]/10 text-[#C9A227] flex items-center justify-center shrink-0">
      <BookOpen className="w-4 h-4" />
    </div>
  );
}
