import { Button, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';

type Line = {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
};
export const App: React.FC = () => {
	const DEFAULT_LINE: Line = {
		x1: -1,
		x2: -1,
		y1: -1,
		y2: -1,
	};

	const [line, setLine] = useState<Line>(DEFAULT_LINE);

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const GRID_SIZE = 16;

	const drawGrid = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const width = canvas.width;
		const height = canvas.height;
		ctx.beginPath();

		for (let x = 3 * GRID_SIZE; x <= width; x += GRID_SIZE) {
			ctx.moveTo(x, 3 * GRID_SIZE);
			ctx.lineTo(x, height);
		}

		for (let y = 3 * GRID_SIZE; y <= height; y += GRID_SIZE) {
			ctx.moveTo(3 * GRID_SIZE, y);
			ctx.lineTo(width, y);
		}

		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;

		ctx.stroke();
		ctx.closePath();
	};

	const drawAxes = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.beginPath();

		ctx.moveTo(10, 20);
		ctx.lineTo(60, 20);
		ctx.lineTo(50, 16);
		ctx.moveTo(60, 20);
		ctx.lineTo(50, 24);
		ctx.font = '10px Arial';
		ctx.fillText('X', 70, 20);

		ctx.moveTo(10, 20);
		ctx.lineTo(10, 70);
		ctx.lineTo(6, 60);
		ctx.moveTo(10, 70);
		ctx.lineTo(14, 60);
		ctx.fillText('Y', 10, 95);

		ctx.lineWidth = 2;

		for (let i = 0; i < 100; ++i) {
			ctx.fillText(
				i.toString(),
				54 + 16 * i - (i.toString().length === 2 ? 4 : 0),
				40
			);
		}

		for (let i = 0; i < 100; ++i) {
			ctx.fillText(i.toString(), 35, 59 + 16 * i);
		}

		ctx.stroke();
		ctx.closePath();
	};

	useEffect(() => {
		drawGrid();
		drawAxes();
	}, []);

	function runBresenham(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		step: number,
		needLog = false
	): number[][] {
		const startTime = new Date();
		const points = [];
		const dx = Math.abs(x2 - x1);
		const dy = -Math.abs(y2 - y1);
		const sx = x1 < x2 ? step : -step;
		const sy = y1 < y2 ? step : -step;
		let error = dx + dy;
		let iter = 1;
		// eslint-disable-next-line no-constant-condition
		while (true) {
			needLog &&
				console.log(
					iter + '. Рисуем точку (' + x1 + ', ' + y1 + '), error = ' + error
				);
			iter++;
			points.push([x1, y1]);
			if (x1 === x2 && y1 === y2) {
				needLog && console.log('(' + x2 + ', ' + y2 + '), выход из цикла');
				break;
			}
			if (2 * error >= dy && x1 !== x2) {
				needLog &&
					console.log(
						error -
							0.5 * dy +
							' >= 0, сдвигаем x на ' +
							sx +
							', ошибка уменьшается на ' +
							Math.abs(dy)
					);
				error += dy;
				x1 += sx;
			}
			if (2 * error <= dx && y1 !== y2) {
				needLog &&
					console.log(
						error -
							0.5 * dx +
							' <= 0, сдвигаем y на ' +
							sy +
							', ошибка увеличивается на ' +
							dx
					);
				error += dx;
				y1 += sy;
			}
		}
		const endTime = new Date();
		const elapsedTime = endTime.getTime() - startTime.getTime();
		needLog &&
			console.log('Алгоритм Брезенхема отработал за ' + elapsedTime + ' ms');
		return points;
	}

	function runStepByStep(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		step: number,
		needLog = false
	) {
		const startTime = new Date();
		const points = [];
		if (x1 > x2) {
			[x1, x2] = [x2, x1];
			[y1, y2] = [y2, y1];
		}
		const dx = x2 - x1;
		const dy = y2 - y1;
		needLog && console.log('dx = ' + dx);
		needLog && console.log('dy = ' + dy);
		if (dx == 0 && dy == 0) {
			needLog && console.log('dx = 0, dy = 0 => (' + x2 + ', ' + y2 + ')');
			points.push([x1, y1]);
		} else {
			if (Math.abs(dx) > Math.abs(dy)) {
				needLog && console.log('|dx| > |dy| => x от ' + x1 + ' до ' + x2);
				for (let x = x1; x <= x2; x += step) {
					const temp = Math.round((y1 + (dy * (x - x1)) / dx) / step) * step; // or floor
					needLog &&
						console.log(
							'y (для x = ' +
								x +
								') = ' +
								temp +
								' => (' +
								x +
								', ' +
								temp +
								')'
						);
					points.push([x, temp]);
				}
			} else {
				if (y1 > y2) {
					[x1, x2] = [x2, x1];
					[y1, y2] = [y2, y1];
				}
				needLog && console.log('|dy| >= |dx| => y от ' + y1 + ' до ' + y2);
				for (let y = y1; y <= y2; y += step) {
					const temp = Math.round(((dx / dy) * (y - y1) + x1) / step) * step; // or floor
					needLog &&
						console.log(
							'x (для y = ' +
								y +
								') = ' +
								temp +
								' => (' +
								temp +
								', ' +
								y +
								')'
						);
					points.push([temp, y]);
				}
			}
		}
		const endTime = new Date();
		const elapsedTime = endTime.getTime() - startTime.getTime();
		needLog &&
			console.log('Пошаговый алгоритм отработал за ' + elapsedTime + ' ms');
		return points;
	}

	const drawLineByPoints = (points: number[][]) => {
		console.log(points);
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawGrid();
		drawAxes();
		ctx.strokeStyle = 'red';
		ctx.beginPath();
		if (points.length > 0) ctx.moveTo(points[0][0], points[0][1]);
		ctx.fillRect(points[0][0], points[0][1], 16, 16);
		for (let i = 1; i < points.length; i++) {
			ctx.fillRect(points[i][0], points[i][1], 16, 16);
		}
		ctx.stroke();
		ctx.closePath();
	};

	return (
		<div className={styles.container}>
			<div className={styles.utilsContainer}>
				<div className={styles.inputContainer}>
					<TextField
						label='X1'
						type='number'
						className={styles.inputField}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setLine(prevLine => ({
								...prevLine,
								x1: parseInt(event.target.value),
							}));
						}}
					/>
					<TextField
						label='Y1'
						type='number'
						className={styles.inputField}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setLine(prevLine => ({
								...prevLine,
								y1: parseInt(event.target.value),
							}));
						}}
					/>
					<TextField
						label='X2'
						type='number'
						className={styles.inputField}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setLine(prevLine => ({
								...prevLine,
								x2: parseInt(event.target.value),
							}));
						}}
					/>
					<TextField
						label='Y2'
						type='number'
						className={styles.inputField}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setLine(prevLine => ({
								...prevLine,
								y2: parseInt(event.target.value),
							}));
						}}
					/>
				</div>
				<div className={styles.buttonsContainer}>
					<Button
						className={styles.button}
						variant='contained'
						onClick={() => {
							runStepByStep(line.x1, line.y1, line.x2, line.y2, 1, true); // so bad =(
							const point = runStepByStep(
								line.x1 * GRID_SIZE + 3 * GRID_SIZE,
								line.y1 * GRID_SIZE + 3 * GRID_SIZE,
								line.x2 * GRID_SIZE + 3 * GRID_SIZE,
								line.y2 * GRID_SIZE + 3 * GRID_SIZE,
								GRID_SIZE
							);
							drawLineByPoints(point);
						}}
					>
						<div className={styles.buttonText}>пошаговый алгоритм</div>
					</Button>
					<Button
						className={styles.button}
						variant='contained'
						onClick={() => {
							const canvas = canvasRef.current;
							if (!canvas) return;
							const ctx = canvas.getContext('2d');
							if (!ctx) return;
							ctx.clearRect(0, 0, canvas.width, canvas.height);
							drawGrid();
							drawAxes();
						}}
					>
						<div className={styles.buttonText}>Очистить</div>
					</Button>
					<Button
						className={styles.button}
						variant='contained'
						onClick={() => {
							runBresenham(line.x1, line.y1, line.x2, line.y2, 1, true); // so bad =(
							const points = runBresenham(
								line.x1 * GRID_SIZE + 3 * GRID_SIZE,
								line.y1 * GRID_SIZE + 3 * GRID_SIZE,
								line.x2 * GRID_SIZE + 3 * GRID_SIZE,
								line.y2 * GRID_SIZE + 3 * GRID_SIZE,
								GRID_SIZE
							);
							drawLineByPoints(points);
						}}
					>
						<div className={styles.buttonText}>алгоритм Брезенхема</div>
					</Button>
				</div>
			</div>
			<div className={styles.canvasContainer}>
				<canvas
					ref={canvasRef}
					width={1217}
					height={561}
					className={styles.canvas}
				/>
			</div>
		</div>
	);
};
