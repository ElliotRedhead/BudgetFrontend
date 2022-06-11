/**
 * Colour generator for evenly spaced colours.
 * 
 * @param {number} numOfSteps Total number steps to get color, means total colors
 * @param {number} step The step number, means the order of the color
 * @returns {string} A colour code 
 */
export const colourGenerator = (numOfSteps:number, step:number) => {
	// This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
	// Adam Cole, 2011-Sept-14
	// HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	let r, g, b;
	const h = step / numOfSteps;
	const i = ~~(h * 6);
	const f = h * 6 - i;
	const q = 1 - f;
	switch (i % 6){
	case 0: r = 1; g = f; b = 0; break;
	case 1: r = q; g = 1; b = 0; break;
	case 2: r = 0; g = 1; b = f; break;
	case 3: r = 0; g = q; b = 1; break;
	case 4: r = f; g = 0; b = 1; break;
	case 5: r = 1; g = 0; b = q; break;
	}
	if (r !== undefined && g !== undefined && b !== undefined){
		const redHex = `00${  (~ ~(r * 255)).toString(16)}`.slice(-2);
		const greenHex = `00${  (~ ~(g * 255)).toString(16)}`.slice(-2);
		const blueHex = `00${  (~ ~(b * 255)).toString(16)}`.slice(-2);
		const alphaHex = `00${  (~ ~(0.3 * 255)).toString(16)}`.slice(-2);
		const c = `#${redHex}${greenHex}${blueHex}${alphaHex}`;
		return (c);
	}
	return "#fff";
};
