'use babel';

import LinterYamllint from '../lib/linter-yamllint';

describe('LinterYamllint', () => {
  it('can launch', () => {
    waitsForPromise(() => atom.packages.activatePackage('linter-yamllint'));
  });
});
