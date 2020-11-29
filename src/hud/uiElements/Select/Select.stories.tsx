import Select, { Props } from './Select';

const items = [
  { value: '0', text: 'all' },
  { value: '1', text: 'articles' },
  { value: '2', text: 'products' },
  { value: '3', text: 'articles' },
  { value: '4', text: 'products' },
  { value: '5', text: 'articles' },
  { value: '6', text: 'products' },
];

export default {
  title: 'UI Elements/Select',
  component: Select,
  argTypes: { onSelect: { action: 'selected' } },
};

export const Basic = ({ options, onSelect }: Props<unknown>): JSX.Element => (
  <Select onSelect={onSelect} options={options} />
);

Basic.args = { options: items };
