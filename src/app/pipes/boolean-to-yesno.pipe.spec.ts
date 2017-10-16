import { BooleanToYesnoPipe } from './boolean-to-yesno.pipe';

describe('BooleanToYesnoPipe', () => {
  it('create an instance', () => {
    const pipe = new BooleanToYesnoPipe();
    expect(pipe).toBeTruthy();
  });
});
