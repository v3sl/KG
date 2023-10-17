export type TypeRGB = {
	red: number;
	green: number;
	blue: number;
};

export type TypeCMYK = {
	cyan: number;
	magenta: number;
	yellow: number;
	key: number;
};

export type TypeHSV = {
	hue: number;
	saturation: number;
	value: number;
};

export type TypeColor = {
	rgb: TypeRGB;
	cmyk: TypeCMYK;
	hsv: TypeHSV;
};
