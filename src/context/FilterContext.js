"use client";
import { createContext } from 'react';

const FilterContext = createContext({
    filters: {},
    setFilters: () => { },
});

export default FilterContext;
