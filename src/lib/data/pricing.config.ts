import type { PricingConfig } from '$lib/types/trip.types';

export const PRICING_CONFIG: PricingConfig = {
	oneway: {
		threshold: 130,
		extraKmRate: 14
	},
	roundtrip: {
		threshold: 250,
		extraKmRate: 13
	},
	driverBata: 400
};

export function getThreshold(tripType: 'oneway' | 'roundtrip'): number {
	return PRICING_CONFIG[tripType].threshold;
}

export function getExtraKmRate(tripType: 'oneway' | 'roundtrip'): number {
	return PRICING_CONFIG[tripType].extraKmRate;
}

export function getDriverBata(): number {
	return PRICING_CONFIG.driverBata;
}
