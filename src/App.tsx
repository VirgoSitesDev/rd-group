import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from 'styled-components';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorFallback from './components/common/ErrorFallback';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AcquistiPage from './pages/AcquistiPage';
import CarDetailPage from './pages/CarDetailPage';

import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

import { useFeaturedCars } from './hooks/useCars';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const LuxuryRedirect: React.FC = () => {
  return <Navigate to="/auto?luxury=true" replace />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const { data: featuredCars } = useFeaturedCars(1);
  const isHomePage = location.pathname === '/';
  
  // Prendi la prima auto in evidenza dal database se disponibile
  const heroFeaturedCar = featuredCars?.cars?.[0];

  const heroCarData = heroFeaturedCar ? {
    make: heroFeaturedCar.make.toUpperCase(),
    model: heroFeaturedCar.model.toUpperCase(),
    price: heroFeaturedCar.price,
    year: heroFeaturedCar.year,
    mileage: heroFeaturedCar.mileage,
    fuelType: heroFeaturedCar.fuelType === 'diesel' ? 'Diesel' : 
              heroFeaturedCar.fuelType === 'petrol' ? 'Benzina' : 
              heroFeaturedCar.fuelType === 'electric' ? 'Elettrico' : 
              heroFeaturedCar.fuelType === 'hybrid' ? 'Ibrido' : 'Benzina',
    transmission: heroFeaturedCar.transmission === 'automatic' ? 'Automatico' : 
                  heroFeaturedCar.transmission === 'manual' ? 'Manuale' : 
                  heroFeaturedCar.transmission === 'semi_automatic' ? 'Semiautomatico' : 'Automatico',
    power: `${heroFeaturedCar.power}KW`,
  } : undefined;

  return (
    <div className="app">
      {isHomePage ? (
        <Header showHero={true} featuredCar={heroCarData} />
      ) : location.pathname !== '/acquistiamo' ? (
        <Header showHero={false} />
      ) : null}
      
      <main className={`main-content ${!isHomePage ? 'with-normal-header' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auto" element={<CatalogPage />} />
          <Route path="/auto/:id" element={<CarDetailPage />} />
          <Route path="/luxury" element={<LuxuryRedirect />} />
          <Route path="/sedi" element={<Navigate to="/#sedi" replace />} />
          <Route path="/acquistiamo" element={<AcquistiPage />} />
          <Route path="/contatti" element={<Navigate to="/#contatti" replace />} />
          <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}>Pagina non trovata</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;