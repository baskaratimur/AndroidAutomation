import { $ } from "@wdio/globals";
import Page from "./page.ts";

class PrivacyPages extends Page {
  public get agreeCheckbox() {
    return $("//android.widget.CheckBox");
  }

  public get continueBtn() {
    return $("//android.widget.ScrollView/android.view.View[2]/android.widget.Button");
  }

  public get homeFootbarIndicator() {
    return $("//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View[2]");
  }

  public get privacyIndicator(){
    return $("(//android.widget.TextView[@text='Kebijakan Privasi'])[2]")
  }

  async scrollAndAcceptPrivacy() {
    try {
      const scrollToEnd = $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(10)`);
      await scrollToEnd.waitForExist({ timeout: 5000 });
    } catch (error) {}

    try {
      const scrollLocator = $(`android=new UiScrollable(new UiSelector().scrollable(true)).setMaxSearchSwipes(50).scrollIntoView(new UiSelector().className("android.widget.CheckBox"))`);
      await scrollLocator.waitForExist({ timeout: 5000 });
    } catch (error) {}

    await this.agreeCheckbox.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Checkbox persetujuan (Setuju) tidak ditemukan!"
    });
    await this.agreeCheckbox.click();
  }

  async clickContinue() {
    await this.continueBtn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Tombol Lanjut tidak ditemukan!"
    });
    await this.continueBtn.click();
  }
}

export default new PrivacyPages();
