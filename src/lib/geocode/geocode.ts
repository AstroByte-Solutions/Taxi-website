import { Env_data } from '$lib/constant/url.constant';

// src/lib/geocode/geocode.ts

interface MapboxFeature {
	id: string;
	type: string;
	place_type: string[];
	relevance: number;
	properties: {
		accuracy?: string;
		mapbox_id?: string;
		[key: string]: any;
	};
	text: string;
	place_name: string;
	bbox?: number[];
	center: [number, number];
	geometry: {
		type: string;
		coordinates: [number, number];
	};
	context?: Array<{
		id: string;
		text: string;
		short_code?: string;
	}>;
}

interface MapboxResponse {
	type: string;
	query: string[];
	features: MapboxFeature[];
	attribution: string;
}

export interface GeocodeResult {
	display_name: string;
	lat: string;
	lon: string;
	boundingbox: string[];
	address: Record<string, string>;
	type: string;
	place_id: string;
}

interface GeocodeOptions {
	limit?: number;
}

// Your Mapbox token
const MAPBOX_TOKEN = Env_data.MAPBOX_TOKEN;
const CACHE_KEY = 'mapbox_cache_v1';
const MIN_INTERVAL_MS = 100;

let lastRequestTs = 0;

// Initialize cache from localStorage
const getCacheFromStorage = (): Map<string, GeocodeResult[]> => {
	if (typeof window === 'undefined') return new Map();

	try {
		const stored = localStorage.getItem(CACHE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			return new Map(Object.entries(parsed));
		}
	} catch (e) {
		console.error('Failed to load cache:', e);
	}
	return new Map();
};

const cache: Map<string, GeocodeResult[]> = getCacheFromStorage();

function persist(): void {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(cache)));
	} catch (e) {
		console.error('Failed to persist cache:', e);
	}
}

// Parse Mapbox context to extract address components
function parseAddress(feature: MapboxFeature): Record<string, string> {
	const address: Record<string, string> = {
		name: feature.text || ''
	};

	if (feature.context) {
		feature.context.forEach((ctx) => {
			const idParts = ctx.id.split('.');
			const type = idParts[0];

			switch (type) {
				case 'postcode':
					address.postcode = ctx.text;
					break;
				case 'place':
					address.city = ctx.text;
					break;
				case 'district':
					address.district = ctx.text;
					break;
				case 'region':
					address.state = ctx.text;
					break;
				case 'country':
					address.country = ctx.text;
					address.country_code = ctx.short_code || '';
					break;
				case 'locality':
					address.locality = ctx.text;
					break;
				case 'neighborhood':
					address.neighborhood = ctx.text;
					break;
			}
		});
	}

	// Extract place type
	if (feature.place_type && feature.place_type.length > 0) {
		address.place_type = feature.place_type[0];
	}

	return address;
}

export async function Geocode(
	query: string,
	{ limit = 5 }: GeocodeOptions = {}
): Promise<GeocodeResult[]> {
	if (!query || query.trim().length < 2) return [];

	const key = query.trim().toLowerCase();
	if (cache.has(key)) {
		return cache.get(key)!;
	}

	const now = Date.now();
	const since = now - lastRequestTs;
	if (since < MIN_INTERVAL_MS) {
		await new Promise((r) => setTimeout(r, MIN_INTERVAL_MS - since));
	}
	lastRequestTs = Date.now();

	// Correct Mapbox Geocoding API v5 endpoint (not v6)
	const encodedQuery = encodeURIComponent(query);
	const url =
		`${Env_data.GEOCODE_URL}${encodedQuery}.json?` +
		`access_token=${MAPBOX_TOKEN}&` +
		`limit=${limit}&` +
		`country=in&` + // Restrict to India
		`language=en&` +
		`types=place,locality,neighborhood,address,poi`; // Include relevant place types

	try {
		const resp = await fetch(url, {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!resp.ok) {
			const errorText = await resp.text();
			console.error('Mapbox API Error:', errorText);
			throw new Error(`Mapbox geocode error: ${resp.status}`);
		}

		const data: MapboxResponse = await resp.json();

		console.log('Mapbox response------------', data);

		// Convert Mapbox features to our GeocodeResult format
		const items: GeocodeResult[] = data.features
			.filter((feature) => {
				// Double-check it's in India
				const context = feature.context || [];
				const countryContext = context.find((ctx) => ctx.id.startsWith('country'));
				return countryContext?.short_code?.toLowerCase() === 'in';
			})
			.map((feature) => {
				const [lon, lat] = feature.center;
				const bbox = feature.bbox || [lon, lat, lon, lat];

				return {
					display_name: feature.place_name,
					lat: lat.toString(),
					lon: lon.toString(),
					boundingbox: bbox.map(String),
					address: parseAddress(feature),
					type: feature.place_type[0] || 'unknown',
					place_id: feature.id
				};
			});

		cache.set(key, items);
		persist();
		return items;
	} catch (error) {
		console.error('Mapbox geocoding error:', error);
		throw error;
	}
}
// ```

// ## Key Fixes:

// ### 1. **Correct API Endpoint**
// ❌ Wrong: `https://api.mapbox.com/search/geocode/v6/forward?${encodedQuery}.json?`
// ✅ Correct: `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?`

// The main issues in your code were:
// - Using v6 endpoint (doesn't exist for standard geocoding)
// - Using `/search/geocode/` path (wrong)
// - Double `.json?` in URL
// - `forward?` parameter (incorrect syntax)

// ### 2. **Correct URL Structure**
// ```
// https://api.mapbox.com/geocoding/v5/mapbox.places/{search_text}.json
// ```

// ### 3. **Query Parameters**
// ```
// ?access_token=YOUR_TOKEN
// &limit=5
// &country=in
// &language=en
// &types=place,locality,neighborhood,address,poi
