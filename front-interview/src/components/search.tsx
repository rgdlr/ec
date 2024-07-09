import { useSearch } from "@/hooks/use-search";

import { Close } from "@mui/icons-material";
import { Alert, Button, ButtonGroup, Card, ClickAwayListener, FormControl, FormControlLabel, FormLabel, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, Radio, RadioGroup, TextField, Tooltip } from "@mui/material";
import cn from "classnames";

export type SearchProps<Type> = Readonly<{
    initialSearch?: string;
    initialOpen?: boolean;
    initialSearchKey: keyof Type;
    initialSortKey: keyof Type;
    service: () => Promise<Type[]>;
}>;

export function Search<Type>(props: SearchProps<Type>) {
	const { service, initialOpen, initialSearchKey, initialSortKey } = props;

    const {
        data, limited, loading, search, setSearch, open, setOpen, selected, setSelected, sortKey, setSortKey, searchKey, setSearchKey
    } = useSearch<Type>({
        service, initialOpen, initialSearchKey, initialSortKey
    })

	return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <article className="m-4 flex flex-col gap-2">
            <Card component="section" className="mb-8 flex min-h-24 items-center justify-between gap-4 rounded-md border px-4 py-2">
                {data && data[0] ?
                    <FormControl>
                        <FormLabel>Search Key</FormLabel>                    
                        <RadioGroup row value={searchKey} onChange={(event) => setSearchKey(event.target.value)}>
                                <>{Object.keys(data[0])?.map?.(key => <FormControlLabel key={"search-key-" + key} value={key} control={<Radio />} label={key[0].toUpperCase() + key.slice(1)} />)}</>
                        </RadioGroup>
                    </FormControl>:
                    <>Loading options...</>
                }
            </Card>
            <div className="relative mb-1">
                <TextField className="w-full" inputProps={{ style: { paddingRight: 46 } }} label="Search" onChange={(event) => setSearch(event.target.value)} value={search} onFocus={() => setOpen(true)} />
                {Boolean(search.length) && (<div className="absolute right-2 top-2"><IconButton aria-label="close" color="primary" onClick={() => setSearch("")}><Close /></IconButton></div>)}
                {open &&
                    <section className="mt-1 max-h-80 max-w-full overflow-y-scroll rounded-md border">
                        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white px-4 py-2">
                            <span>SORT KEY</span>
                            <div className="flex gap-2">
                                {data && data[0] &&
                                    <ButtonGroup disableElevation>
                                        {Object.keys(data[0])?.map?.(key => <Button key={"sort-key-" + key} variant={sortKey === key ? "contained" : "outlined"} onClick={() => setSortKey(key)}>{key}</Button>)}
                                    </ButtonGroup>
                                }
                            </div>
                        </div>
                        {loading && <LinearProgress />}
                        <List>
                            {search.length
                                ? (limited?.length
                                    ? limited?.map((post) => (
                                        <ListItem key={post.id} disablePadding>
                                            <span className="absolute right-2 top-3 flex aspect-square h-4 items-center justify-center rounded-full bg-slate-400 text-xs text-white">{post.userId}</span>
                                            <ListItemButton onClick={() => setSelected(selected?.id === post.id ? null : post)} selected={post.id === selected?.id}>
                                                <Tooltip title={post.id !== selected?.id ? "Click to expand content" : "Click to collapse content"} placement="top">
                                                    <ListItemText className="flex flex-col pr-4" primary={post.title} primaryTypographyProps={{ className: cn({ "truncate text-ellipsis": post.id !== selected?.id }) }} secondary={post.body} secondaryTypographyProps={{ className: cn({ "truncate text-ellipsis": post.id !== selected?.id }) }} />
                                                </Tooltip>
                                            </ListItemButton>
                                        </ListItem>))
                                    : <Alert severity="error">No results matching search</Alert>
                                ) : <Alert severity="info">Start typing to search for results</Alert>
                            }
                        </List>
                    </section>
                }
                </div>
            </article>
        </ClickAwayListener>
	);
}
