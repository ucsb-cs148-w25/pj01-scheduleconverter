We use Jest as our testing library
To use it, we first follow the instruction provided in lab page
 - link: https://ucsb-cs148.github.io/topics/testing_jest/
1. Entering `schedule-converter` in you cmd, and the run the following command:
`npm install --save-dev jest`
2. Creating `.babelrc` file in `schedule-converter` folder with following content:
`{\n  "presets": ["next/babel"]\n}`
as well as `jest.config.js` folder in the same place with:
```js
module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest",
    },
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    testEnvironment: "jsdom"
};
```
as it will help you ignore non-js file (such as .css) in order to avoid error.
3. Add this in your `package.json` file:
```json
"scripts": {
    "test:jest": "jest"
}
```
Now, you can use `npm run test:jest` command to run the jest test!
4. Before you run the test, there are some packages you may need to install:
 - if you need `babel-jest` and its dependencies, you can run the command:
 `npm install --save-dev babel-jest @babel/core @babel/preset-env @babel/preset-react`
 - if you need `next.js`, you can run:
 `npm install --save-dev next`
 - Remebering to install test-lib for react, so that you can use `render`, `screen`, etc.
 You can do so by running:
 `npm install --save-dev @testing-library/react @testing-library/jest-dom`
 and you can just include `import { render, screen } from '@testing-library/react';` in the test file
 - To use test function such as `.toBeInTheDocument()`, you need to install `@testing-library/jest-dom`.
 To do so, you can use the command:
 `npm install --save-dev @testing-library/jest-dom`
 then, remebering to include `import '@testing-library/jest-dom';` in your test file.
5. Now, you should be able to run and write test file! You can start with running command `npm run test:jest`, and you can write test in `App.test.js` (since the only file that we need to test is the App.js file currently).