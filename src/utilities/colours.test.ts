import { describe, expect, it } from "vitest";
import { colourAlphaOffset } from "./colourAlphaOffset";
import { colourGenerator } from "./colourGenerator";

describe("colourGenerator", () => {
	it("returns distinct translucent hex colours", () => {
		const colours = [0, 1, 2, 3].map(step => colourGenerator(4, step));
		expect(new Set(colours).size).toBe(4);
		colours.forEach(colour => expect(colour).toMatch(/^#[0-9a-f]{8}$/));
	});
});

describe("colourAlphaOffset", () => {
	it("raises the alpha channel by the offset", () => {
		expect(colourAlphaOffset("#ff00004c", 0.3)).toBe("#ff000098");
	});

	it("caps alpha at fully opaque", () => {
		expect(colourAlphaOffset("#ff0000ff", 0.5)).toBe("#ff0000ff");
	});

	it("leaves colours without an alpha channel unchanged", () => {
		expect(colourAlphaOffset("#ff0000", 0.3)).toBe("#ff0000");
	});
});
