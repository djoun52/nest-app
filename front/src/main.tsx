import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { store } from './redux/store';
import {BrowserRouter} from 'react-router-dom'
import {ChakraProvider} from '@chakra-ui/react'
import {Provider} from "react-redux";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
        <Provider store={store}>
            <ChakraProvider>
                <App/>
            </ChakraProvider>
        </Provider>
    </BrowserRouter>,
)
