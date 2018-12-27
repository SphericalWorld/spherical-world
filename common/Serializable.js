// @flow strict
export interface Serializable {
  +serialize: () => mixed;
}
