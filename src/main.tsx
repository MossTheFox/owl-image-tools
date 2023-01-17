import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n/config';
import MainContainer from './ui/MainContainer';
import WrappedThemeProvider from './ui/WrappedThemeProvider';
import './transitions.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <WrappedThemeProvider>
            <MainContainer>
                <App />
            </MainContainer>
        </WrappedThemeProvider>
    </React.StrictMode>,
)
