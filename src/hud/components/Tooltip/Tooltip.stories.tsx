// @flow strct
import React from 'react';
import { storiesOf } from '@storybook/react';
import TooltipTrigger from './TooltipTrigger';

const TooltipContent = () => <div>child in a portal</div>;

storiesOf('Tooltip', module).add('TooltipTrigger', () => (
  <>
    <div>
      <TooltipTrigger tooltip={TooltipContent}>
        hover to show tooltip
      </TooltipTrigger>
    </div>
  </>
));
