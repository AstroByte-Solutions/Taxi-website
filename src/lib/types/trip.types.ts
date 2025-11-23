export type TripType = 'oneway' | 'roundtrip';

export interface Location {
	display_name: string;
	lat: number | string;
	lon: number | string;
}

export interface TripData {
	tripType: TripType;
	pickup: Location;
	dropoff: Location;
	pickupDateAndTime: string;
	returnDateAndTime?: string;
	createdAt: number;
}

export interface Car {
	id: number;
	imageLink: string;
	name: string;
	rating: number;
	reviews: number;
	passengers: number;
	transmission: string;
	airConditioning: boolean;
	doors: number;
	category: string;
	priceUnit: string;
	onewayRatePerKm: number;
	roundtripRatePerKm: number;
	description?: string;
	distance?: number;
	pricePerKm?: number;
	estimatedFare?: number;
	pickupDateAndTime?: string;
	returnDateAndTime?: string;
	extraKm?: number;
	extraFee?: number;
}

export interface FareBreakdown {
	baseFare: number;
	baseKm: number;
	extraKm: number;
	extraFee: number;
	driverBata: number;
	total: number;
	actualDistance: number;
	chargeableDistance: number;
	threshold: number;
}

export interface VehicleDetails {
	selectedAt: number;
	tripType: TripType;
	actualDistance: number;
	chargeableDistance: number;
	threshold: number;
	extraKm: number;
	extraFee: number;
	baseFare: number;
	totalFare: number;
	extraKmRate?: number;
	car: Car;
}

export interface BookerInfo {
	name: string;
	contact: string;
	contact2?: string;
	email: string;
	pickupAddress: string;
}

export interface PricingConfig {
	oneway: {
		threshold: number;
		extraKmRate: number;
	};
	roundtrip: {
		threshold: number;
		extraKmRate: number;
	};
	driverBata: number;
}

export interface ValidationResult {
	ok: boolean;
	message?: string;
}
