<script lang="ts">
	type PropsType = {
		width?: string;
		height?: string;
		fill?: string;
		class?: string;
	};

	let { width = '777', height = '702', fill = '#1572D3', class: className }: PropsType = $props();
</script>

<svg {width} {height} viewBox="0 0 777 702" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M-346 859L215.555 638.171L777 859L549.017 510.317L215.555 -2.45464e-05L-118.017 510.317L-346 859Z"
		{fill}
		fill-opacity="0.1"
	/>
</svg>
