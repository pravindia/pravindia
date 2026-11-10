import { useEffect, useState } from 'react';

export type BlogTheme = 'dark' | 'light';

export function useBlogTheme() {
	const [theme, setTheme] = useState<BlogTheme>('dark');
	const [themeReady, setThemeReady] = useState(false);

	useEffect(() => {
		const saved = localStorage.getItem('blog-theme');
		if (saved === 'light' || saved === 'dark') {
			setTheme(saved);
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			setTheme('light');
		}
		setThemeReady(true);
	}, []);

	useEffect(() => {
		if (!themeReady) return;
		localStorage.setItem('blog-theme', theme);
	}, [theme, themeReady]);

	return { theme, setTheme, themeReady };
}
