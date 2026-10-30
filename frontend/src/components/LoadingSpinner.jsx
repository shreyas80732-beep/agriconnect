import React from 'react';
import SmartLoading from './SmartLoading';

export default function LoadingSpinner({ label }) {
  const customMessages = label
    ? [
        label,
        'Getting information...',
        'Checking which suits you...',
        'Gathering best outcome...',
        'On the way...',
        'Just there...',
      ]
    : undefined;

  return <SmartLoading messages={customMessages} />;
}
