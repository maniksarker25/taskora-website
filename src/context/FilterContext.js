"use client";
import { createContext } from 'react';
// make changes
const FilterContext = createContext({
    filters: {},
    setFilters: () => { },
});

export default FilterContext;
