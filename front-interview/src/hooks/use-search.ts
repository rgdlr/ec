import { useService } from "@/hooks";

import { useMemo, useReducer } from "react";

export function filterByKey<T>(key: keyof T, options?: { reverse: boolean }) {
    return function filter(a: T, b: T) {
        if (a[key] > b[key]) return options?.reverse ? -1 : 1;
        if (a[key] < b[key]) return options?.reverse ? 1 : -1;
        return 0;
    }
}

export type UseSearchParams<Type> = {
    initialSearch?: string,
    initialOpen?: boolean,
    initialSortKey: keyof Type,
    initialSearchKey: keyof Type,
    limit?: number,
    service: () => Promise<Type[]>
}

export type UseSearchState<Type> = {
    open: boolean,
    search: string,
    searchKey: keyof Type,
    selected: Type | null,
    sortKey: keyof Type,
}

export type UseSearchAction<Type> = {
    type: keyof UseSearchState<Type>,
    payload: Partial<UseSearchState<Type>>
}

function searchReducer<Type>(state: UseSearchState<Type>, action: UseSearchAction<Type>) {
    const { payload,type } = action;
    switch (type) {
        case "open":
            return { ...state, ...payload };
        case "search":
            return { ...state, ...payload };
        case "searchKey":
            return { ...state, ...payload };
        case "selected":
            return { ...state, ...payload };
        case "sortKey":
            return { ...state, ...payload };
        default:
            return state;
    }
}

export function useSearch<Type>(params: UseSearchParams<Type>) {
    const {
        service,
        initialOpen = false,
        initialSearch = "",
        initialSearchKey,
        initialSortKey,
        limit = 5
    } = params;

	const {
        data,
        error,
        loading
    } = useService(service);

    const [state, dispatch] = useReducer(searchReducer<Type>, {
        open: initialOpen,
        search: initialSearch,
        searchKey: initialSearchKey,
        selected: null,
        sortKey: initialSortKey,
    })

    const {
        open,
        search,
        searchKey,
        selected,
        sortKey
    } = state;

    const sorted = useMemo(
        () => data?.sort(filterByKey(sortKey)),
        [data, searchKey, sortKey]
    );

    const filtered = useMemo(
        () => sorted?.filter((element) => String(element[searchKey]).toLowerCase().includes(search.toLowerCase())),
        [data, sorted, searchKey, sortKey, search]
    );

    const limited = useMemo(
        () => filtered?.slice(0, limit),
        [data, sorted, filtered, sortKey, searchKey, search]
    );

    return {
        data,
        error,
        loading,
        search: search,
        setSearch: (search: string) => dispatch({ type: "search", payload: { search } }),
        open: open,
        setOpen: (open: boolean) => dispatch({ type: "open", payload: { open } }),
        selected: selected,
        setSelected: (selected: Type) => dispatch({ type: "selected", payload: { selected } }),
        sortKey: sortKey,
        setSortKey: (sortKey: keyof Type) => dispatch({ type: "sortKey", payload: { sortKey } }),
        searchKey: searchKey,
        setSearchKey: (searchKey: keyof Type) => dispatch({ type: "searchKey", payload: { searchKey } }),
        sorted,
        filtered,
        limited
    }
}
