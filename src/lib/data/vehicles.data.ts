import type { Car } from '$lib/types/trip.types';

export const VEHICLES: Car[] = [
	{
		id: 1,
		imageLink:
			'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/17ws33z6wdrxmsp/suzuki_swift_car_maruti_suzuki_dzire_car_b15b42392c86348282930d72a750d493_HybpFp2Lkl.png',
		name: 'Hatchback',
		description: 'Compact and economical',
		rating: 4.5,
		reviews: 3456,
		passengers: 4,
		transmission: 'Manual',
		airConditioning: true,
		doors: 4,
		priceUnit: 'day',
		category: 'Sedan',
		onewayRatePerKm: 14,
		roundtripRatePerKm: 13
	},
	{
		id: 2,
		imageLink:
			'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/e13mtm7rl4mswcr/5bbc278ec0e2d_51e72df7d7ea4c637a2e6606f4866f6f_VffpCWZ2c5.png',
		name: 'Sedan (Etios)',
		description: 'Comfortable sedan',
		rating: 4.7,
		reviews: 2890,
		passengers: 5,
		transmission: 'Auto',
		airConditioning: true,
		doors: 4,
		priceUnit: 'day',
		category: 'MUV',
		onewayRatePerKm: 14,
		roundtripRatePerKm: 13
	},
	{
		id: 3,
		name: 'SUV',
		description: 'Spacious SUV',
		imageLink:
			'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/jy03lgb9tktiyzs/hyundai_creta_car_hyundai_motor_company_hyundai_i30_hyundai_creta_2da6ea49bda6f3386b1382fb01748980_WO1hIMK9ju.png',
		rating: 4.6,
		reviews: 2234,
		passengers: 5,
		transmission: 'Auto',
		airConditioning: true,
		doors: 4,
		priceUnit: 'day',
		category: 'Sedan',
		onewayRatePerKm: 19,
		roundtripRatePerKm: 17
	},
	{
		id: 4,
		imageLink:
			'https://image-hosting-server-production-da8d.up.railway.app/api/files/r682kajzrtrg4zc/cifxi30yi0t7fop/toyota_innova_car_mazda_mpv_toyota_a8f71f8a221e8c5c547390ce9861d454_lHUqsi7JkE.png',
		name: 'Innova',
		description: 'Premium MPV',
		rating: 4.4,
		reviews: 1987,
		passengers: 7,
		transmission: 'Manual',
		airConditioning: true,
		doors: 4,
		priceUnit: 'day',
		category: 'SUV',
		onewayRatePerKm: 20,
		roundtripRatePerKm: 18
	}
];
