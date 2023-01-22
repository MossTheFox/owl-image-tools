import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n/config';
import './utils/browserCompability';
import MainContainer from './ui/MainContainer';
import WrappedThemeProvider from './ui/WrappedThemeProvider';
import './transitions.css';
import './main.css';
import { AppConfigContextProvider } from './context/appConfigContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AppConfigContextProvider>
            <WrappedThemeProvider>
                <MainContainer>
                    <App />
                </MainContainer>
            </WrappedThemeProvider>
        </AppConfigContextProvider>
    </React.StrictMode>,
)
