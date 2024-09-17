import React from 'react';

const Context = React.createContext();

export const GenreProvider = ({ children, genres }) => {
  return <Context.Provider value={{ genres }}>{children}</Context.Provider>;
};

export default Context;
