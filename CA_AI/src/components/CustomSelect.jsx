import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  variant = 'dark', // 'dark' | 'cream' | 'pill'
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options into array of objects { value, label }
  const normalizedOptions = options.map(opt =>
    typeof opt === 'object' && opt !== null
      ? opt
      : { value: opt, label: opt }
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value) || {
    value: '',
    label: placeholder
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const isPill = variant === 'pill';
  const isCream = variant === 'cream';

  return (
    <div className={`relative inline-block w-full ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 transition-all font-semibold select-none ${
          isPill
            ? 'bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-full px-3.5 py-1.5 text-xs shadow-md hover:border-amber-400/50'
            : isCream
            ? 'bg-white text-[#0a0a0a] border border-[#e2dec8] rounded-xl px-3.5 py-2.5 text-sm shadow-sm hover:border-[#d8b020]'
            : 'bg-[#0a0a0a] text-white border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-sm shadow-sm hover:border-[#d8b020]'
        }`}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-400' : 'text-slate-400'}`} />
      </button>

      {/* Custom Options Popup List */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 mt-1.5 z-50 rounded-2xl shadow-2xl border overflow-hidden p-1.5 space-y-1 animate-fadeIn max-h-60 overflow-y-auto scrollbar-none ${
            isCream
              ? 'bg-[#ffffff] border-[#e8e4d6] text-[#0a0a0a]'
              : 'bg-[#141416] border-[#2a2a2a] text-white'
          }`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#ffe760] to-[#f7d130] text-[#0a0a0a] font-bold shadow-sm'
                    : isCream
                    ? 'hover:bg-[#f6f3eb] text-[#0a0a0a]'
                    : 'hover:bg-[#222226] text-slate-200 hover:text-white'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#0a0a0a] shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
