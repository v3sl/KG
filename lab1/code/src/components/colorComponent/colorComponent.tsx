import { Slider, TextField } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent } from 'react';
import { HsvColorPicker } from 'react-colorful';
import color from '../../store/color';
import styles from './color.module.css';

export const ColorComponent: React.FC = observer(() => {
	const handleRgbTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (/^0\d/.test(event.target.value))
			event.target.value = event.target.value.charAt(1);
		const id = event.target.id;
		const value = event.target.value === '' ? 0 : parseInt(event.target.value);
		if (value < 0 || value > 255) return;
		color.setColor({
			red: id === 'redTextField' ? value : color.color.rgb.red,
			green: id === 'greenTextField' ? value : color.color.rgb.green,
			blue: id === 'blueTextField' ? value : color.color.rgb.blue,
		});
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleRgbSliderChange = (event: any, value: number | number[]) => {
		value = value as number;
		color.setColor({
			red: event.target.name === 'redSlider' ? value : color.color.rgb.red,
			green:
				event.target.name === 'greenSlider' ? value : color.color.rgb.green,
			blue: event.target.name === 'blueSlider' ? value : color.color.rgb.blue,
		});
	};

	const handleCmykTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (/^0\d/.test(event.target.value))
			event.target.value = event.target.value.charAt(1);
		const id = event.target.id;
		const value = event.target.value === '' ? 0 : parseInt(event.target.value);
		if (value < 0 || value > 100) return;
		color.setColor({
			cyan: id === 'cyanTextField' ? value : color.color.cmyk.cyan,
			magenta: id === 'magentaTextField' ? value : color.color.cmyk.magenta,
			yellow: id === 'yellowTextField' ? value : color.color.cmyk.yellow,
			key: id === 'keyTextField' ? value : color.color.cmyk.key,
		});
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleCmykSliderChange = (event: any, value: number | number[]) => {
		value = value as number;
		color.setColor({
			cyan: event.target.name === 'cyanSlider' ? value : color.color.cmyk.cyan,
			magenta:
				event.target.name === 'magentaSlider'
					? value
					: color.color.cmyk.magenta,
			yellow:
				event.target.name === 'yellowSlider' ? value : color.color.cmyk.yellow,
			key: event.target.name === 'keySlider' ? value : color.color.cmyk.key,
		});
	};

	const handleHsvTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (/^0\d/.test(event.target.value))
			event.target.value = event.target.value.charAt(1);
		const id = event.target.id;
		const value = event.target.value === '' ? 0 : parseInt(event.target.value);
		if (
			value < 0 ||
			(value > 360 && id === 'hueTextField') ||
			(value > 100 && id !== 'hueTextField')
		)
			return;
		color.setColor({
			hue: id === 'hueTextField' ? value : color.color.hsv.hue,
			saturation:
				id === 'saturationTextField' ? value : color.color.hsv.saturation,
			value: id === 'valueTextField' ? value : color.color.hsv.value,
		});
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleHsvSliderChange = (event: any, value: number | number[]) => {
		value = value as number;
		color.setColor({
			hue: event.target.name === 'hueSlider' ? value : color.color.hsv.hue,
			saturation:
				event.target.name === 'saturationSlider'
					? value
					: color.color.hsv.saturation,
			value:
				event.target.name === 'valueSlider' ? value : color.color.hsv.value,
		});
	};

	return (
		<div className={styles.wrapper}>
			<div
				className={styles.colorMonitor}
				style={{
					backgroundColor: `rgb(${color.color.rgb.red},${color.color.rgb.green},${color.color.rgb.blue})`,
				}}
			/>
			<div className={styles.paletteContainer}>
				<section className='palette'>
					<HsvColorPicker
						color={{
							h: color.color.hsv.hue,
							s: color.color.hsv.saturation,
							v: color.color.hsv.value,
						}}
						onChange={c =>
							color.setColor({
								hue: c.h,
								saturation: c.s,
								value: c.v,
							})
						}
					/>
				</section>
			</div>
			<div className={styles.modelContainer}>
				<div className={styles.modelTitle}>RGB</div>
				<div className={styles.modelParameterContainer}>
					<TextField
						id='redTextField'
						label='Red'
						type='number'
						value={color.color.rgb.red}
						onChange={handleRgbTextFieldChange}
						className={styles.input}
					/>
					<Slider
						name='redSlider'
						value={color.color.rgb.red}
						min={0}
						max={255}
						step={1}
						sx={{ width: 255 }}
						onChange={handleRgbSliderChange}
					/>
				</div>
				<div className={styles.modelParameterContainer}>
					<TextField
						id='greenTextField'
						label='Green'
						type='number'
						value={color.color.rgb.green}
						onChange={handleRgbTextFieldChange}
						className={styles.input}
					/>
					<Slider
						name='greenSlider'
						value={color.color.rgb.green}
						min={0}
						max={255}
						step={1}
						sx={{ width: 255 }}
						onChange={handleRgbSliderChange}
					/>
				</div>
				<div className={styles.modelParameterContainer}>
					<TextField
						id='blueTextField'
						label='Blue'
						type='number'
						value={color.color.rgb.blue}
						onChange={handleRgbTextFieldChange}
						className={styles.input}
					/>
					<Slider
						name='blueSlider'
						value={color.color.rgb.blue}
						min={0}
						max={255}
						step={1}
						sx={{ width: 255 }}
						onChange={handleRgbSliderChange}
					/>
				</div>
			</div>
			<div className={styles.modelContainer}>
				<div className={styles.modelTitle}>HSV</div>
				<div className={styles.modelParameterContainer}>
					<TextField
						id='hueTextField'
						label='hue(°)'
						type='number'
						value={color.color.hsv.hue}
						onChange={handleHsvTextFieldChange}
						className={styles.input}
					/>
					<Slider
						name='hueSlider'
						value={color.color.hsv.hue}
						min={0}
						max={360}
						step={1}
						sx={{ width: 255 }}
						onChange={handleHsvSliderChange}
					/>
				</div>
				<div className={styles.modelParameterContainer}>
					<TextField
						id='saturationTextField'
						label='Saturation(%)'
						type='number'
						value={color.color.hsv.saturation}
						onChange={handleHsvTextFieldChange}
						className={styles.input}
					/>
					<Slider
						name='saturationSlider'
						value={color.color.hsv.saturation}
						min={0}
						max={100}
						step={1}
						sx={{ width: 255 }}
						onChange={handleHsvSliderChange}
					/>
				</div>
				<div className={styles.modelParameterContainer}>
					<TextField
						id='valueTextField'
						label='Value(%)'
						type='number'
						value={color.color.hsv.value}
						onChange={handleHsvTextFieldChange}
						className={styles.input}
					/>
					<Slider
						name='valueSlider'
						value={color.color.hsv.value}
						min={0}
						max={100}
						step={1}
						sx={{ width: 255 }}
						onChange={handleHsvSliderChange}
					/>
				</div>
			</div>
			<div className={styles.modelContainer}>
				<div className={styles.modelTitle}>CMYK</div>
				<div className={styles.modelParameterContainer}>
					<TextField
						id='cyanTextField'
						label='Cyan(%)'
						type='number'
						value={color.color.cmyk.cyan}
						onChange={handleCmykTextFieldChange}
						className={styles.input}
					/>
					<Slider
						name='cyanSlider'
						value={color.color.cmyk.cyan}
						min={0}
						max={100}
						step={1}
						sx={{ width: 255 }}
						onChange={handleCmykSliderChange}
					/>
				</div>
				<div className={styles.modelParameterContainer}>
					<TextField
						id='magentaTextField'
						label='Magenta(%)'
						type='number'
						value={color.color.cmyk.magenta}
						onChange={handleCmykTextFieldChange}
						className={styles.input}
					/>
					<Slider
						name='magentaSlider'
						value={color.color.cmyk.magenta}
						min={0}
						max={100}
						step={1}
						sx={{ width: 255 }}
						onChange={handleCmykSliderChange}
					/>
				</div>
				<div className={styles.modelParameterContainer}>
					<TextField
						id='yellowTextField'
						label='Yellow(%)'
						type='number'
						value={color.color.cmyk.yellow}
						onChange={handleCmykTextFieldChange}
						className={styles.input}
					/>
					<Slider
						name='yellowSlider'
						value={color.color.cmyk.yellow}
						min={0}
						max={100}
						step={1}
						sx={{ width: 255 }}
						onChange={handleCmykSliderChange}
					/>
				</div>
				<div className={styles.modelParameterContainer}>
					<TextField
						id='keyTextField'
						label='Key(%)'
						type='number'
						value={color.color.cmyk.key}
						onChange={handleCmykTextFieldChange}
						className={styles.input}
					/>
					<Slider
						name='keySlider'
						value={color.color.cmyk.key}
						min={0}
						max={100}
						step={1}
						sx={{ width: 255 }}
						onChange={handleCmykSliderChange}
					/>
				</div>
			</div>
		</div>
	);
});
