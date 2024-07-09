import { useEffect, useState } from "react";

export function useService<DataType, ErrorType>(service: () => Promise<DataType>) {
	const [data, setData] = useState<DataType>();
	const [error, setError] = useState<ErrorType>();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		service().then(setData).catch(setError).finally(() => setLoading(false));
	}, [service]);

	return { data, error, loading};
}
