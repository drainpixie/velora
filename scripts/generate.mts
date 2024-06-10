#!/usr/bin/env -S node --import=tsx/esm

import { createCanvas } from "@napi-rs/canvas";
import { oklch, formatHex, type Oklch } from "culori";
import { writeFile } from "node:fs/promises";

type Hue = Oklch;

type Hues = Record<string, Hue>;
type Shades = Record<string, Hue[]>;

const blocksize = 128;

const canvasw = blocksize * 4; // 8 / 2 is the amount of colours
const canvash = blocksize * 2;

const hues: Hues = {
	uno: oklch("oklch(94.1% 0.043 79.8)")!, // #fbe9cc
	duo: oklch("oklch(58.7% 0.056 76.8)")!, // #8f7856
} as const;

const shades: Shades = {
	uno: [
		oklch("oklch(92.8% 0.041 79.3)")!, // #f7ddbe
		oklch("oklch(91.5% 0.039 78.9)")!, // #f2d0af
		oklch("oklch(90.2% 0.037 78.4)")!, // #ecc29f
	],
	duo: [
		oklch("oklch(60.0% 0.060 77.3)")!, // #947f61
		oklch("oklch(61.3% 0.064 77.7)")!, // #9a856b
		oklch("oklch(62.6% 0.069 78.2)")!, // #a08b75
	],
} as const;

const generate = (hs: Hues, ss: Shades) => {
	const img = createCanvas(canvasw, canvash);
	const ctx = img.getContext("2d");

	const draw = (hue: Hue, x: number, y: number, w: number, h: number) => {
		ctx.fillStyle = formatHex(hue);
		ctx.fillRect(x, y, w, h);
	};

	let x = 0;
	let y = 0;

	for (const [name, hue] of Object.entries(hs)) {
		draw(hue, x, y, blocksize, blocksize);
		x += blocksize;

		for (const shade of ss[name]) {
			draw(shade, x, y, blocksize, blocksize);
			x += blocksize;
		}

		x = 0;
		y += blocksize;
	}

	return img.toBuffer("image/png");
};

await writeFile("palette.png", generate(hues, shades));
