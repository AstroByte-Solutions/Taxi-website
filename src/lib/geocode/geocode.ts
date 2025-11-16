import { Env_data } from '$lib/constant/url.constant';

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

// --- Mapbox token and caches ---
const MAPBOX_TOKEN = Env_data.MAPBOX_TOKEN;
const CACHE_KEY = 'mapbox_cache_v1';
const MIN_INTERVAL_MS = 100;
let lastRequestTs = 0;

// --- Geocode cache (localStorage) ---
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

// --- parse address helper (same as before) ---
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

	if (!MAPBOX_TOKEN) {
		throw new Error('Mapbox token not provided (MAPBOX_TOKEN).');
	}

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

	const encodedQuery = encodeURIComponent(query);
	const url =
		`${Env_data.GEOCODE_URL}/${encodedQuery}.json?` +
		`access_token=${MAPBOX_TOKEN}&` +
		`limit=${limit}&` +
		`country=in&` +
		`language=en&` +
		`types=place,locality,neighborhood,address,poi`;

	try {
		const resp = await fetch(url, {
			headers: { Accept: 'application/json' }
		});

		// TODO: Here using toast-----------------------
		if (!resp.ok) {
			const errorText = await resp.text();
			console.error('Mapbox API Error:', errorText);
			throw new Error(`Mapbox geocode error: ${resp.status}`);
		}

		const data: MapboxResponse = await resp.json();

		const items: GeocodeResult[] = (data.features || [])
			.filter((feature) => {
				const context = feature.context || [];
				const countryContext = context.find((ctx) => ctx.id.startsWith('country'));
				return !countryContext || countryContext.short_code?.toLowerCase() === 'in';
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

// ------------------- Directions integration below -------------------

// Simple types to represent essential parts of Mapbox directions response
export interface RouteStep {
	distance: number;
	duration: number;
	name: string;
	maneuver: {
		instruction?: string;
		type?: string;
		modifier?: string;
		location: [number, number];
	};
}

export interface RouteLeg {
	summary: string;
	weight: number;
	duration: number;
	distance: number;
	steps: RouteStep[];
}

export interface RouteGeometry {
	coordinates: [number, number][];
	type: string;
}

export interface RouteResult {
	distance: number;
	duration: number;
	geometry: RouteGeometry;
	legs: RouteLeg[];
	// Keep raw route for future use if needed
	raw?: any;
}

// directions cache to avoid duplicate calls in a short time
const directionsCache: Map<string, RouteResult> = new Map();

// Helper to build a cache key
function directionsCacheKey(from: string, to: string) {
	return `${from.trim().toLowerCase()}|${to.trim().toLowerCase()}`;
}

/**
 * getDrivingDirections
 * - Accepts `fromPlace` and `toPlace` as place name strings
 * - Resolves each to coordinates using Geocode()
 * - Calls Mapbox Directions API with `lon,lat;lon,lat` format
 * - Returns the first route as RouteResult or null when not found
 */
export async function getDrivingDirections(
	fromPlace: string,
	toPlace: string
): Promise<RouteResult | null> {
	if (!MAPBOX_TOKEN) {
		throw new Error('Mapbox token not provided (MAPBOX_TOKEN).');
	}

	// Use cache key
	const cacheKey = directionsCacheKey(fromPlace, toPlace);
	if (directionsCache.has(cacheKey)) {
		return directionsCache.get(cacheKey)!;
	}

	try {
		// Resolve place names to coordinates (limit 1)
		const [fromData, toData] = await Promise.all([
			Geocode(fromPlace, { limit: 1 }),
			Geocode(toPlace, { limit: 1 })
		]);

		if (!fromData.length || !toData.length) {
			console.warn('getDrivingDirections: unable to geocode one or both locations', {
				fromPlace,
				toPlace
			});
			return null;
		}

		const from = fromData[0];
		const to = toData[0];

		// Mapbox expects "lon,lat" pairs separated by semicolon
		const fromCoords = `${from.lon},${from.lat}`;
		const toCoords = `${to.lon},${to.lat}`;

		// Build the directions URL
		const url =
			`${Env_data.DIRECTION_URL}/${encodeURIComponent(
				fromCoords
			)};${encodeURIComponent(toCoords)}?` +
			`alternatives=true&geometries=geojson&language=en&overview=full&steps=true&` +
			`access_token=${MAPBOX_TOKEN}`;

		const resp = await fetch(url, {
			headers: { Accept: 'application/json' }
		});

		if (!resp.ok) {
			const errText = await resp.text();
			console.error('Mapbox Directions API error:', errText);
			throw new Error(`Mapbox directions error: ${resp.status}`);
		}

		const data = await resp.json();

		if (!data.routes || data.routes.length === 0) {
			console.warn('Mapbox Directions returned no routes', { fromCoords, toCoords });
			return null;
		}

		const route = data.routes[0]; // choose first route
		const result: RouteResult = {
			distance: route.distance,
			duration: route.duration,
			geometry: route.geometry,
			legs: route.legs,
			raw: route
		};

		// Cache result (in-memory)
		directionsCache.set(cacheKey, result);

		return result;
	} catch (err) {
		console.error('Error in getDrivingDirections:', err);
		return null;
	}
}

// ------------------- Example usage -------------------
// (remove or move to your calling code — kept here for reference)
/*
(async () => {
	const route = await getDrivingDirections('Chennai International Airport', 'Coimbatore');
	console.log('Route', route);
})();
*/
