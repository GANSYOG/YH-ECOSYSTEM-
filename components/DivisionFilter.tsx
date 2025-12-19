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
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium dark:text-white text-light-content dark:bg-dark-300 bg-light-300 border border-transparent rounded-md hover:border-brand-primary/50 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-100 focus:ring-offset-light-100 focus:ring-brand-primary"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
            >
                Filter Divisions
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 dark:bg-dark-200 bg-light-100 border dark:border-dark-300 border-light-300 rounded-md shadow-lg z-20">
                    <div className="p-2">
                         <input
                            type="text"
                            placeholder="Search divisions..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full dark:bg-dark-300 bg-light-200 dark:border-dark-300 border-light-300 rounded-md p-2 text-sm dark:text-white text-light-content focus:ring-brand-primary focus:border-brand-primary"
                            aria-label="Search or filter divisions"
                        />
                    </div>
                    <ul id={listboxId} className="max-h-60 overflow-y-auto p-2" role="listbox" aria-multiselectable="true">
                        {filteredDivisions.map(division => (
                             <li key={division} role="option" aria-selected={selectedDivisions.includes(division)}>
                                <label className="flex items-center space-x-3 px-2 py-1.5 rounded-md dark:hover:bg-dark-300 hover:bg-light-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded dark:bg-dark-300 bg-light-200 dark:border-slate-500 border-slate-400 text-brand-primary focus:ring-brand-primary focus:ring-offset-0"
                                        checked={selectedDivisions.includes(division)}
                                        onChange={() => handleSelectionChange(division)}
                                        tabIndex={-1}
                                    />
                                    <span className="text-sm dark:text-dark-content text-light-content select-none">{division}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DivisionFilter;