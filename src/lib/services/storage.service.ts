/**
 * Storage service abstraction for localStorage operations
 * Provides type-safe access with error handling
 */

export const storage = {
	/**
	 * Get an item from localStorage with type safety
	 */
	getItem<T>(key: string): T | null {
		try {
			const item = localStorage.getItem(key);
			if (!item) return null;
			return JSON.parse(item) as T;
		} catch (error) {
			console.error(`Error reading from localStorage (${key}):`, error);
			return null;
		}
	},

	/**
	 * Set an item in localStorage with type safety
	 */
	setItem<T>(key: string, value: T): void {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error writing to localStorage (${key}):`, error);
			throw error;
		}
	},

	/**
	 * Remove an item from localStorage
	 */
	removeItem(key: string): void {
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error(`Error removing from localStorage (${key}):`, error);
		}
	},

	/**
	 * Clear all items from localStorage
	 */
	clear(): void {
		try {
			localStorage.clear();
		} catch (error) {
			console.error('Error clearing localStorage:', error);
		}
	}
};
