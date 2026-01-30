import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDownIcon } from './Icons';

interface DivisionFilterProps {
    allDivisions: string[];
    selectedDivisions: string[];
    setSelectedDivisions: (divisions: string[]) => void;
}

const DivisionFilter: React.FC<DivisionFilterProps> = ({ allDivisions, selectedDivisions, setSelectedDivisions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const listboxId = useId();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const handleSelectionChange = (division: string) => {
        const newSelection = selectedDivisions.includes(division)
            ? selectedDivisions.filter(d => d !== division)
            : [...selectedDivisions, division];
        
        // Don't allow unselecting the last division
        if (newSelection.length > 0) {
            setSelectedDivisions(newSelection);
        }
    };

    const filteredDivisions = allDivisions.filter(d => 
        d && d.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-5 py-2.5 text-xs font-black uppercase tracking-widest dark:text-white text-light-content dark:bg-dark-300 bg-light-300 border border-transparent rounded-xl hover:border-brand-primary/50 focus:outline-none transition-all duration-300 shadow-sm"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
            >
                Filter Sectors
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 dark:bg-dark-200 bg-light-100 border dark:border-dark-300 border-light-300 rounded-2xl shadow-2xl z-30 animate-fadeIn backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90">
                    <div className="p-4 border-b dark:border-dark-300 border-light-300">
                         <input
                            type="text"
                            placeholder="Find sector..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full dark:bg-dark-400 bg-light-200 border-none rounded-xl p-3 text-sm dark:text-white text-light-content focus:ring-2 focus:ring-brand-primary transition-all shadow-inner"
                            aria-label="Search or filter divisions"
                        />
                    </div>
                    <ul id={listboxId} className="max-h-72 overflow-y-auto p-3 custom-scrollbar" role="listbox" aria-multiselectable="true">
                        {filteredDivisions.map(division => (
                             <li key={division} role="option" aria-selected={selectedDivisions.includes(division)}>
                                <label className="flex items-center space-x-3 px-3 py-2.5 rounded-xl dark:hover:bg-dark-300 hover:bg-light-200 cursor-pointer transition-all group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-5 w-5 rounded-lg dark:bg-dark-400 bg-light-300 border-none text-brand-primary focus:ring-brand-primary focus:ring-offset-0 transition-all cursor-pointer"
                                            checked={selectedDivisions.includes(division)}
                                            onChange={() => handleSelectionChange(division)}
                                            tabIndex={-1}
                                        />
                                    </div>
                                    <span className={`text-xs font-bold transition-colors ${selectedDivisions.includes(division) ? 'text-brand-primary' : 'dark:text-dark-content text-light-content opacity-70 group-hover:opacity-100'}`}>{division}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                    <div className="p-3 bg-light-200/50 dark:bg-dark-300/50 rounded-b-2xl flex justify-between items-center px-4">
                        <span className="text-[10px] font-black uppercase text-slate-500">{selectedDivisions.length} Selected</span>
                        <button
                            onClick={() => setSelectedDivisions([allDivisions[0]])}
                            className="text-[10px] font-black uppercase text-brand-primary hover:text-brand-secondary transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DivisionFilter;