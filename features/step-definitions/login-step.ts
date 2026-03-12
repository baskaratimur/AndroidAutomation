import { Given, When, Then } from "@wdio/cucumber-framework";
import LoginPage from "../pages/login-pages.ts";

Given("user is on the login page", async () => {
  const element = LoginPage.userField;
  await expect(element).toBeDisplayed({
      message: "User tidak berada di halaman login!",
      wait: 10000
  });
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

Then("user should see the error message {string}", async (expectedMsg: string) => {
  const notificationElement = LoginPage.getNotificationText(expectedMsg);
  await expect(notificationElement).toBeDisplayed({
      message: `Pesan error '${expectedMsg}' tidak ditemukan!`,
      wait: 10000
  });
});

Then("user should be redirected to the select program page", async () => {
  const element = LoginPage.programIndicator;
  await expect(element).toBeDisplayed({
      message: "User tidak berhasil dialihkan ke halaman Home!",
      wait: 15000
  });
});
