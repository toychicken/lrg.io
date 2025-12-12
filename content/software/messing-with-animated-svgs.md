I've been out of the animating things game for a lonnnnnnnnng time. So, I thought I'd have a crack at animating a line around an SVG, and here's my notes.

First up - a simple circle:

<svg id="loop" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
<defs>
		<style>
			circle {
			stroke:black;
			stroke-width: 10px;
			fill:#fff0;
				stroke-dash-array:10 40;
			}
			</style>
</defs>
<circle cx="100" cy="100" r="95"></circle>
</svg>
