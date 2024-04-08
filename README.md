# playwright-qatouch-reporter
This Playwright plugin allows you to push your Playwright Test results into QATouch.

# QA Touch Reporter for Playwright
Pushes test results into QA Touch system.

# Playwright Installation - Local Setup

``` shell

npm init playwright@latest

```

# Running the Example Test

``` shell

npx playwright test

```

# Version
npx playwright --version

# System requirements
Node.js 18+


# Installation - QA Touch plugin

``` shell

npm i playwright-qatouch-reporter


```


# Prerequisites
To use QA Touch Reporter, you will need to set up the following environment variables:

Ensure that your QA Touch API is enabled and generate your API keys. See https://doc.qatouch.com/#qa-touch-api

Add .env file to playwright project root folder with the following keys:


```Javascript

QATOUCH_DOMAIN=your-domain
QATOUCH_API_TOKEN=your-api-token
QATOUCH_PROJECT_KEY=Project-Key
QATOUCH_TESTRUN_ID=Test-Run-Id

```


# Usage
Please open playwright.config.js file, replace below code


```Javascript
 
 reporter: [["html"],["playwright-qatouch-reporter"]],

```

In order to use reporter, you should add meta information to your tests. Meta key should be TRXXX ID (TestRun Code in qatouch), e.g.:


```Javascript
test.only('TR0035 hastitle', async ({ page }) => {
  await page.goto('https://qatouch.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/End to End Test Management Tool | Software Test Management tool | QA Touch/);
});
```

## References
- https://www.npmjs.com/package/playwright-qatouch-reporter
- https://qatouch.com/
- https://help.qatouch.com/
- https://doc.qatouch.com/


# License
This project is licensed under the MIT License

