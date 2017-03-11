'use babel';

import Yamllint from './yamllint';

export default {
  activate(_state) {
  },

  deactivate() {
    this.yamllint = null;
  },

  provideLinter() {
    return {
      name: 'YamlLint',
      scope: 'file',
      lintsOnChange: true,
      grammarScopes: ['source.yaml'],
      lint: (textEditor) => {
        const yamllint = new Yamllint(textEditor);
        return yamllint.lint();
      },
    }
  }
};
