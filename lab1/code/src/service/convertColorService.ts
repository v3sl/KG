import { TypeCMYK, TypeColor, TypeHSV, TypeRGB } from '../types/colorTypes';

class ConvertColorsService {
	public rgbToCmyk({ red, green, blue }: TypeRGB) {
		const normalizedR = red / 255;
		const normalizedG = green / 255;
		const normalizedB = blue / 255;

		const max = Math.max(normalizedR, normalizedG, normalizedB);
		const key = 1 - max;
		let cyan, magenta, yellow;
		if (key == 1) {
			cyan = 0;
			magenta = 0;
			yellow = 0;
		} else {
			cyan = (1 - normalizedR - key) / (1 - key);
			magenta = (1 - normalizedG - key) / (1 - key);
			yellow = (1 - normalizedB - key) / (1 - key);
		}

		return {
			cyan: Math.round(cyan * 100),
			magenta: Math.round(magenta * 100),
			yellow: Math.round(yellow * 100),
			key: Math.round(key * 100),
		};
	}
	public rgbToHsv({ red, green, blue }: TypeRGB): TypeHSV {
		const normalizedR = red / 255;
		const normalizedG = green / 255;
		const normalizedB = blue / 255;

		const max = Math.max(normalizedR, normalizedG, normalizedB);
		const min = Math.min(normalizedR, normalizedG, normalizedB);

		const delta = max - min;
		const value = max;

		const saturation = max === 0 ? 0 : delta / max;

		let hue;
		if (delta === 0) hue = 0;
		else if (max === normalizedR)
			hue = 60 * ((normalizedG - normalizedB) / delta);
		else if (max === normalizedG)
			hue = 60 * ((normalizedB - normalizedR) / delta + 2);
		else hue = 60 * ((normalizedR - normalizedG) / delta + 4);

		if (hue < 0) hue += 360;

		return {
			hue: Math.round(hue),
			saturation: Math.round(saturation * 100),
			value: Math.round(value * 100),
		};
	}
	public hsvToRgb(
		{ hue, saturation, value }: TypeHSV,
		needToRound: boolean = true
	): TypeRGB {
		const rgbRange = ((value / 100) * saturation) / 100;
		const maxRgb = value / 100;
		const minRgb = maxRgb - rgbRange;
		const hPrime = hue / 60;
		const x1 = hPrime % 1.0;
		const x2 = 1 - (hPrime % 1.0);
		let r, g, b;
		if (hPrime >= 0 && hPrime < 1) {
			r = maxRgb;
			g = x1 * rgbRange + minRgb;
			b = minRgb;
		} else if (hPrime >= 1 && hPrime < 2) {
			r = x2 * rgbRange + minRgb;
			g = maxRgb;
			b = minRgb;
		} else if (hPrime >= 2 && hPrime < 3) {
			r = minRgb;
			g = maxRgb;
			b = x1 * rgbRange + minRgb;
		} else if (hPrime >= 3 && hPrime < 4) {
			r = minRgb;
			g = x2 * rgbRange + minRgb;
			b = maxRgb;
		} else if (hPrime >= 4 && hPrime < 5) {
			r = x1 * rgbRange + minRgb;
			g = minRgb;
			b = maxRgb;
		} else {
			r = maxRgb;
			g = minRgb;
			b = x2 * rgbRange + minRgb;
		}
		return {
			red: needToRound ? Math.round(r * 255) : r * 255,
			green: needToRound ? Math.round(g * 255) : g * 255,
			blue: needToRound ? Math.round(b * 255) : b * 255,
		};
	}
	public hsvToCmyk(color: TypeHSV): TypeCMYK {
		const rgbColor = this.hsvToRgb(color, false);
		return this.rgbToCmyk(rgbColor);
	}
	public cmykToRgb(
		{ cyan, magenta, yellow, key }: TypeCMYK,
		needToRound: boolean = true
	): TypeRGB {
		const c = cyan / 100;
		const m = magenta / 100;
		const y = yellow / 100;
		const k = key / 100;
		const r = 255 * (1 - c) * (1 - k);
		const g = 255 * (1 - m) * (1 - k);
		const b = 255 * (1 - y) * (1 - k);
		return {
			red: needToRound ? Math.round(r) : r,
			green: needToRound ? Math.round(g) : g,
			blue: needToRound ? Math.round(b) : b,
		};
	}
	public cmykToHsv(color: TypeCMYK): TypeHSV {
		const rgbColor = this.cmykToRgb(color, false);
		return this.rgbToHsv(rgbColor);
	}
	public getColor(color: TypeCMYK | TypeHSV | TypeRGB): TypeColor {
		if ('red' in color)
			return {
				rgb: color,
				cmyk: this.rgbToCmyk(color),
				hsv: this.rgbToHsv(color),
			};
		else if ('cyan' in color)
			return {
				rgb: this.cmykToRgb(color),
				cmyk: color,
				hsv: this.cmykToHsv(color),
			};
		else
			return {
				rgb: this.hsvToRgb(color),
				cmyk: this.hsvToCmyk(color),
				hsv: color,
			};
	}
}

export default new ConvertColorsService();
