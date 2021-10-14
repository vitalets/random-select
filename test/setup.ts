import chai from 'chai';
import { RandomSelect } from '../src';

type AssertType = typeof chai.assert;
type RandomSelectType = typeof RandomSelect;

declare global {
  const assert: AssertType;
  const RandomSelect: RandomSelectType;
}

Object.assign(global, {
  assert: chai.assert,
  RandomSelect,
});
