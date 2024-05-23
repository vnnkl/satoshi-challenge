import React from 'react';

interface ButtonProps {
  children: any;
}

export const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button className="pointer-events-auto rounded-md bg-indigo-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-indigo-500">{children}</button>;
};