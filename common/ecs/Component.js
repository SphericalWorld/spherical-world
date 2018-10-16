// @flow strict
export interface Component {
  +destructor?: () => void;
}
