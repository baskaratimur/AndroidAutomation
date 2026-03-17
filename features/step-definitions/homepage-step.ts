import { Given, When, Then } from "@wdio/cucumber-framework";
import { $ } from "@wdio/globals";
import HomepagePages from "../pages/homepage-pages.ts";

Given("user is on the homepage", async () => {
  const footerMenus = ["Beranda", "Kirim Data", "Tarik Data", "Profil"];
  for (const menutext of footerMenus) {
    const footerElement = HomepagePages.textIndicator(menutext);
    await expect(footerElement).toBeDisplayed({
      message: `Menu footer '${menutext}' tidak ditemukan!`,
      wait: 10000
    });
  }
});

Then("user should see homepage indicator {string}", async (text: string) => {
  const element = HomepagePages.textIndicator(text);
  await expect(element).toBeDisplayed({
    message: `Indikator teks '${text}' tidak ditemukan di Homepage!`,
    wait: 10000
  });

  try {
    const scrollToTop = $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollToBeginning(10)`);
    await scrollToTop.waitForExist({ timeout: 5000 });
  } catch (e) {}
});

When("user scrolls down to {string}", async (text: string) => {
  await HomepagePages.scrollSlightlyToText(text);
});

When("user clicks Perbarui Data button", async () => {
  await HomepagePages.clickPerbaruiData();
});

When("user clicks change program", async () => {
  await HomepagePages.clickChangeProgram();
});

When("user clicks Unduh program lainnya", async () => {
  await HomepagePages.clickUnduhProgramLainnya();
});

When("user selects the first program", async () => {
  await HomepagePages.clickFirstProgramCheckbox();
});

When("user clicks the confirm download button", async () => {
  await HomepagePages.clickConfirmDownload();
});

When("user navigates back to homepage", async () => {
  await HomepagePages.clickBackButtons();
});
