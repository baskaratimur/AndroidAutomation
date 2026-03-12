import { Given, When, Then } from "@wdio/cucumber-framework";
import PrivacyPages from "../pages/privacy-pages.ts";

Given("user is on privacy page", async () => {
  const element = PrivacyPages.privacyIndicator;
  await expect(element).toBeDisplayed({
    message: "Indikator privasi tidak ditemukan, mungkin gagal redirect ke privacy page!",
    wait: 10000
  });
});

When("user accept privacy and policy", async () => {
  await PrivacyPages.scrollAndAcceptPrivacy();
});

When("user click button lanjut", async () => {
  await PrivacyPages.clickContinue();
});

Then("user redirected to homepage", async () => {
  const element = PrivacyPages.homeFootbarIndicator;
  await expect(element).toBeDisplayed({
      message: "Indikator beranda (footbar) tidak ditemukan, mungkin gagal redirect ke homepage!",
      wait: 10000
  });
});

