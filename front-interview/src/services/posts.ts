export type Post = {
	body: string;
	id: number;
	title: string;
	userId: number;
};

export function postsService(): Promise<Post[]> {
	return fetch("https://jsonplaceholder.typicode.com/posts").then((response) => response.json());
}
