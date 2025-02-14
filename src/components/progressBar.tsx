'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressProviders = ({ children }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="red"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default ProgressProviders;