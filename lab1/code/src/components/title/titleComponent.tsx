import React from 'react';
import styles from './title.module.css';

interface TitleComponentProps extends Partial<HTMLDivElement> {
	title: string;
}

export const TitleComponent: React.FC<TitleComponentProps> = ({ title }) => {
	return (
		<div className={styles.titleWrapper}>
			<div className={styles.titleText}>{title}</div>
		</div>
	);
};
