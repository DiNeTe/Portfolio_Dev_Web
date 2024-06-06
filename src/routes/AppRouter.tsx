import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';

import Home from '../views/HomePage';
import Project from '../views/ProjectPage'; 
import LoginScreen from '../views/LoginScreenPage';
import NotFoundPage from '../views/NotFoundPage';


const AppRouter: React.FC = () => {
  const location = useLocation();
  const [routeKeys, setRouteKeys] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setRouteKeys((prevKeys) => ({
      ...prevKeys,
      [location.pathname]: uuidv4(),
    }));
  }, [location.pathname]);

  const currentKey = routeKeys[location.pathname] || 'default';

  return (
    <SwitchTransition>
      <CSSTransition
        key={currentKey}
        timeout={300}
        classNames="fade"
      >
        <div>
          <Routes location={location}>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/home" element={<Home />} />
            <Route path="/project/:id" element={<Project />} />(" ")
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default AppRouter;