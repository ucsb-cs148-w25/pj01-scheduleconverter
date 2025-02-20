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

# Update for lab06 --------------------------------------------------------------------------
1. In the previous lab, we use unit tests to test the render of our web app. It will check whether the page of our app load correctly, so that we can ensure our UI is fine. 

2. We will keep doing the unit test. This is because our project involves API on Google Calendar, which is hard to test in integration or end-end manner. Although we can easily see the updated schedule in our Google Calendar when we try to use the web app, it is difficult to check a mock (or fake) Google Calendar with mock Google account in test. In addition, unit test is much easier to write and organize, and we can write more of them to ensure we cover every case.

3. We use Integration test for lab06, which is recorded in `App.test.js`. The testing library we use is the React Testing Library. There are four unit tests about rendering at the beginning of `App.test.js`, which were created in last lab. Then, there is a newly added integration test. This test will mock what happens when a user try to sign in, input perm number and quarter, and convert returned course schedule into Google Calendar. It integrates the main processes of using our web app, so it fulfills the requirements of adding an integration test for lab06.

4. We will mainly use unit test in large quantity. However, after we fully complete our web app, we may want to add a high-level test, such as integration test or end-end test, to check the overall behavior. Since we are in the development phase of our project, many things have not been finally decided, and there might be some features and functions added or modified in our web app later. So, we will consider higher-level test later.
