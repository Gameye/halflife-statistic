# Half-life 2 statistic
Statistics for CS:GO and TF2. This project is based on the
[statistic-primer](https://github.com/Gameye/statistic-primer) project.

## Setup
Install all dependencies by executing the `npm install` command in the project
folder.

## Automated tests
This project relies completely on automated tests.

### Hook
NEVER commit something that breaks the build! You can
prevent this a bit by linking the `test.sh` script as a git `pre-commit` hook!

like this:
```bash
ln test.sh .git/hooks/pre-commit
```

This will make sure that all your code compiles and is linted before
compilation.

### All tests
You can run all tests simply by running `npm test`. You could also figure out
the test coverage of all tests via `npm run coverage`. A coverage report will
be generated in the `report` folder, you may view this report with your
favourite browser.

### Unit tests
All unit tests may be run with `npm run spec-all`. Unit test files have the
`*.spec.ts` name. They usually sit next to the file they test, somewhere in the
`/src` folder.

Unit test files can also easily be run via visual studio code. Simple open your
unit test file, then select the `typescript file` launch configuration and press
`F5`. Debugging is also supported in this launch configuration.

### Feature tests
You can run all feature tests via npm run `feature-all`. The feature files are
all located in the `/feature` folder and are written in the gherkin format.
They often use fixtures (logs) from the `/fixtures` directory.

You can easily run one feature file via visual studio code. Simple open the
feature file, select the `feature file` launch configuration and press `F5`.
Debugging is also supported in this run configuration, so you can step through
the code. However, you cannot set breakpoints in the actual feature file
itself.

### Linting
This projects uses tslint for linting. If you are using visual studio code, you
can lint while you type and linting errors will be automatically fixed. To
enable this functionality, you should install the [tslint](https://github.com/Microsoft/vscode-tslint) plugin.

