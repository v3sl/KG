import { makeAutoObservable } from 'mobx';
import convertColorService from '../service/convertColorService';
import { TypeCMYK, TypeColor, TypeHSV, TypeRGB } from '../types/colorTypes';

class Color {
	color: TypeColor = {
		rgb: {
			red: 0,
			blue: 0,
			green: 0,
		},
		cmyk: {
			cyan: 0,
			magenta: 0,
			yellow: 0,
			key: 100,
		},
		hsv: {
			hue: 0,
			saturation: 0,
			value: 0,
		},
	};

	public constructor() {
		makeAutoObservable(this);
	}

	public setColor(color: TypeRGB | TypeCMYK | TypeHSV) {
		this.color = convertColorService.getColor(color);
	}
}

export default new Color();
