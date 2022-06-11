/**
 * Vary the alpha value of a hex colour code by a decimal offset.
 * e.g. if hex of rgba(0,0,0,0.1) => apply offset 0.3 => hex of rgba(0,0,0,0.4).
 * 
 * @param {string} originalColourHex The hex colour to be modified
 * @param {number} alphaOffset The offset from the original alpha
 * @returns {string} A modified hex colour code if transformation is possible 
 */
export const colourAlphaOffset = (originalColourHex:string, alphaOffset:number) => {
	if (originalColourHex.length === 9){
		const originalRGBHex = originalColourHex.slice(0, originalColourHex.length - 2);
		const originalAlphaHex = originalColourHex.slice(-2);
		const originalAlphaDec = parseInt(originalAlphaHex, 16);
		let newAlphaDec = ((originalAlphaDec/255) + alphaOffset)*255;

		if (newAlphaDec > 255){
			newAlphaDec = 255;
		}
		if (newAlphaDec < 0){
			newAlphaDec = 0;
		}

		const newAlphaHex = `00${(~ ~(newAlphaDec)).toString(16)}`.slice(-2);
		return `${originalRGBHex}${newAlphaHex}`;
	}
	return originalColourHex;
};
