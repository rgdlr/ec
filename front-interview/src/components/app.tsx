import { Search } from "@/components";
import { postsService } from "@/services";

export function App() {
	return (
		<main className="mx-auto max-w-xl">
			<Search service={postsService} initialSearchKey="title" initialSortKey="title" />
		</main>
	);
}
