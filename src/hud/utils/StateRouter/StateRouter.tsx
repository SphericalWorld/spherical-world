import type { ComponentType } from 'react';
import type { State } from '../../../reducers/rootReducer';
import { useMemoizedSelector } from '../../../util/reducerUtils';

type Props = Readonly<{
  on: string;
  component: ComponentType;
}>;

export const Route = ({ on, component: Component }: Props): JSX.Element | null => {
  const isVisible = useMemoizedSelector(({ uiStates }: State) => uiStates[on]);
  if (!isVisible) return null;
  return <Component />;
};
