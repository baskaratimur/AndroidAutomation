import { Given, When, Then } from "@wdio/cucumber-framework";
import LoginPage from "../pages/login-pages.ts";

Given("user is on the login page", async () => {
  const isAtLogin = await LoginPage.isAtLoginPage();
  if (!isAtLogin) throw new Error("User tidak berada di halaman login!");
});

When(
  "user enters username {string} and password {string}",
  async (user, pw) => {
    await LoginPage.enterCredentials(user, pw);
  },
);

When("user clicks login button", async () => {
  await LoginPage.clickLogin();
});

When('user checks the "Remember Me" checkbox', async () => {
  await LoginPage.checkboxRememberMe();
});

Then("user should see the error message {string}", async (expectedMsg) => {
  const actualMsg = await LoginPage.getMessage(expectedMsg);
  expect(actualMsg).toBe(expectedMsg);
});

Then("user should be redirected to the home page", async () => {
  const isAtHome = await LoginPage.isAtHomePage();
  expect(isAtHome).toBe(true);
});
