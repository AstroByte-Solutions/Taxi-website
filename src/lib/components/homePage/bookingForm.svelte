<script lang="ts">
	import { Tabs } from 'bits-ui';
	import OnewayForm from './oneWayForm.svelte';
	import RoundtripForm from './roundTripForm.svelte';
</script>

<Tabs.Root
	value="oneway"
	class="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:rounded-2xl sm:p-6"
>
	<Tabs.List class="mb-4 inline-flex w-full gap-2 sm:mb-6 sm:w-auto">
		<Tabs.Trigger
			value="oneway"
			class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white sm:flex-none sm:px-6 sm:py-2.5 sm:text-sm"
		>
			One way
		</Tabs.Trigger>
		<Tabs.Trigger
			value="roundtrip"
			class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white sm:flex-none sm:px-6 sm:py-2.5 sm:text-sm"
		>
			Round trip
		</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="oneway" class="select-none">
		<OnewayForm />
	</Tabs.Content>

	<Tabs.Content value="roundtrip" class="select-none">
		<RoundtripForm />
	</Tabs.Content>
</Tabs.Root>
