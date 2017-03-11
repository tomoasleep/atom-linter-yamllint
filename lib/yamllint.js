'use babel';

import { BufferedProcess } from 'atom';
import { existsSync } from 'fs';
import { join } from 'path';

export default class Yamllint {
  errorRegExp = /^(.*):(\d+):(\d+):\s*\[(\w*)\]\s*(.*)$/;

  constructor(textEditor) {
    this.textEditor = textEditor;
  }

  lint() {
    const editorPath = this.textEditor.getPath();
    if (!editorPath) { return null; }

    return new Promise((resolve, reject) => {
      let output = '';
      const command = 'yamllint';
      const args = ['-f', 'parsable', editorPath];
      const stdout = (data) => { output += data };
      const exit = (_code) => resolve(this.parseOutput(output));
      const cwd = this.fetchWorkingDirectoryPath();

      const bufferedProcess = new BufferedProcess({ command, args, exit, stdout, options: { cwd } });
      bufferedProcess.onWillThrowError(({ error }) => reject(error));
    })
  }

  fetchWorkingDirectoryPath() {
    const dirs = atom.project && atom.project.getDirectories().filter((dir) => dir.contains(this.textEditor.getPath()));
    const rootDirPath = dirs && dirs.length && dirs[0].getPath();
    if (!rootDirPath) { return null; }

    return rootDirPath;
  }

  parseOutput(output) {
    const results = output.split("\n").map((line) => this.parseLine(line));
    return results.filter((result) => !!result);
  }

  parseLine(line) {
    const match = this.errorRegExp.exec(line);
    if (!match) { return null; }

    const filePath = match[1];
    const lineNum = Number(match[2]) - 1;
    const charNum = Number(match[3]) - 1;
    const messageType = match[4];
    const message = match[5];

    return {
      filePath,
      text: message,
      type: messageType,
      range: [[lineNum, charNum], [lineNum, charNum + 1]],
    };
  }
}
