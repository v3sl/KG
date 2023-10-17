import { ColorComponent } from './components/colorComponent/colorComponent';
import { TitleComponent } from './components/title/titleComponent';

const App: React.FC = () => {
	return (
		<>
			<TitleComponent title='RGB-CMYK-HSV COLOR CONVERTER' />
			<ColorComponent />
		</>
	);
};

export default App;
