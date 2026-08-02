import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, X, Shield, User, Heart, RotateCcw } from 'lucide-react';
import { useTreeStore } from '@/shared/store/treeStore';
import { ZHUZ_PRESETS } from '@/entities/node.types';

export const FilterBar: React.FC = () => {
  const { t } = useTranslation();
  const { filter, setFilter, resetFilter } = useTreeStore();
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const activeFilterCount =
    (filter.zhuz !== 'all' ? 1 : 0) +
    (filter.clan !== 'all' ? 1 : 0) +
    (filter.gender !== 'all' ? 1 : 0) +
    (filter.lifeStatus !== 'all' ? 1 : 0);

  return (
    <div className="relative z-30 flex flex-col gap-2">
      {/* Search Input Bar */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-2xl border border-sky-100 rounded-2xl p-1.5 shadow-apple-card min-w-[280px] md:min-w-[360px]">
        <div className="flex items-center flex-1 px-3 py-1.5 gap-2 text-slate-400">
          <Search className="w-4 h-4 text-sky-600" />
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => setFilter({ searchQuery: e.target.value })}
            placeholder={t('app.searchPlaceholder')}
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {filter.searchQuery && (
            <button
              onClick={() => setFilter({ searchQuery: '' })}
              className="p-1 hover:text-slate-900 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeFilterCount > 0 || isFilterExpanded
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('app.filters')}</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filter Panel */}
      {isFilterExpanded && (
        <div className="bg-white/95 backdrop-blur-2xl border border-sky-100 rounded-2xl p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150 text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('app.filters')}
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilter}
                className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                {t('app.resetFilters')}
              </button>
            )}
          </div>

          {/* Zhuz Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
              <Shield className="w-3 h-3 text-sky-600" />
              {t('modal.zhuz')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Барлығы' },
                { id: 'uly', label: ZHUZ_PRESETS.uly.nameKk, color: '#00A3E0' },
                { id: 'orta', label: ZHUZ_PRESETS.orta.nameKk, color: '#0284C7' },
                { id: 'kishi', label: ZHUZ_PRESETS.kishi.nameKk, color: '#EAB308' },
                { id: 'other', label: ZHUZ_PRESETS.other.nameKk, color: '#8B5CF6' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter({ zhuz: item.id })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    filter.zhuz === item.id
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
              <User className="w-3 h-3 text-sky-600" />
              {t('modal.gender')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter({ gender: 'all' })}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  filter.gender === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                Барлығы
              </button>
              <button
                onClick={() => setFilter({ gender: 'male' })}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  filter.gender === 'male'
                    ? 'bg-sky-100 border-sky-300 text-sky-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <User className="w-3 h-3 inline mr-1" />
                {t('modal.male')}
              </button>
              <button
                onClick={() => setFilter({ gender: 'female' })}
                className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  filter.gender === 'female'
                    ? 'bg-pink-100 border-pink-300 text-pink-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <Heart className="w-3 h-3 inline mr-1" />
                {t('modal.female')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
