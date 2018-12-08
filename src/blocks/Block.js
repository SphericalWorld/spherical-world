// @flow strict
import BasePropertiesComponent from './components/BasePropertiesComponent';

type BaseData = $Call<typeof BasePropertiesComponent>;

const Block = <T>(...components: T[]): $Call<Object$Assign, BaseData, T> =>
  Object.assign(
    {},
    BasePropertiesComponent(),
    ...components,
  );

export default Block;
