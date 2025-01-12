import { cn } from '@/lib/utils';
import { CircleX } from 'lucide-react';
import React from 'react';
import { Button } from '../buttons';
import { Typography } from '../typography';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
  title = 'Oops! Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  onRetry,
  className
}) => {
  return (
    <div className={
      cn("tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-4", 
        className
      )
    }>
      <div className="tw-text-center tw-max-w-md">
        <div className="tw-mb-8">
          <CircleX className='tw-w-16 tw-h-16 tw-mx-auto tw-text-primary-500' />
        </div>
        <Typography variant={'h2'} className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-4">
          {title}
        </Typography>

        <Typography className="tw-text-gray-600 tw-mb-8">
          {message}
        </Typography>

        {onRetry && (
          <Button
            onClick={onRetry}
            className="tw-inline-flex tw-items-center tw-shadow-sm  "
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorScreen;