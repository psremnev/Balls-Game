import { createRoot } from 'react-dom/client';
import App from 'src/components/App';
import './index.less';

const root = createRoot(document.querySelector('#root'));
root.render(<App />);
