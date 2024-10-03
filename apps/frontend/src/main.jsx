import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AuroraBackground from './components/ui/AuroraBackground.jsx';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri:
    import.meta.env.VITE_NODE_ENV === 'development'
      ? 'http://localhost:4000/graphql'
      : '/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuroraBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </AuroraBackground>
    </BrowserRouter>
  </React.StrictMode>
);
