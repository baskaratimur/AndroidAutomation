import { Given, When, Then } from "@wdio/cucumber-framework";
import { $ } from "@wdio/globals";
import HomepagePages from "../pages/homepage-pages.ts";

Given("user is on the homepage", async () => {
  let isOnHomepage = false;
  for (let i = 0; i < 5; i++) {
    const programAktif = HomepagePages.textIndicator("Program aktif");
    if (await programAktif.isDisplayed()) {
      isOnHomepage = true;
      break;
    }

    console.log("⚠️ Tidak berada di homepage, mencoba menekan tab 'Beranda'...");
    const tabBeranda = HomepagePages.textIndicator("Beranda");
    if (await tabBeranda.isDisplayed()) {
      await tabBeranda.click();
      await driver.pause(2000);
      if (await programAktif.isDisplayed()) {
        isOnHomepage = true;
        break;
      }
    }

    console.log("⚠️ Tab Beranda tidak ditemukan atau belum mencapai homepage, menekan tombol Back...");
    await driver.back(); // Standard W3C way to press back, fixes deprecation warning
    await driver.pause(2000);
  }

  if (!isOnHomepage) {
    console.warn("⚠️ Gagal mencapai homepage secara otomatis setelah 5 kali menekan tombol back.");
  }

  const footerMenus = ["Beranda", "Data Saya", "Tarik Data", "Profil"];
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

When("user clicks back button once", async () => {
  await HomepagePages.backButton1.waitForDisplayed({ timeout: 10000 });
  await HomepagePages.backButton1.click();
  await driver.pause(2000);
});
