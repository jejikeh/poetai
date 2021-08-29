import React, {useState , useCallback} from 'react';
import Editor  from './editor';
import './styles/app.css';
import Preview from './preview';

const App: React.FC = () => {
    const [doc, setDoc] = useState<string>('# ge Hello woerld');
    const handleDocChange = useCallback(
        newDoc => {
            setDoc(newDoc);
        }, [],
    );
    return(
        <div className="app">

            <Editor onChange = {handleDocChange} initialDoc={doc} />
            <Preview/>
        </div>
    );
};

export default App;