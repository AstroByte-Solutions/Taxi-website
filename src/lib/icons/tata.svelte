<script lang="ts">
	type PropsType = {
		width?: string;
		height?: string;
		class?: string;
		fill?: string;
	};

	let { width = '153', height = '18', fill = '#5F5F5F', class: className }: PropsType = $props();
</script>

<svg {width} {height} viewBox="0 0 153 18" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M0 0H36.8393V5.27175H26.2773V17.95H10.924V5.27175H0V0Z"
		{fill}
	/>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M55.4931 7.24615L47.742 17.95H33.0063L47.4652 0H63.4572L78.2781 17.95H63.3508L55.4931 7.24615Z"
		{fill}
	/>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M74.7432 0H111.582V5.27175H101.02V17.95H85.6672V5.27175H74.7432V0Z"
		{fill}
	/>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M130.236 7.24615L122.485 17.95H107.749L122.187 0H138.2L153 17.95H138.094L130.236 7.24615Z"
		{fill}
	/>
</svg>
