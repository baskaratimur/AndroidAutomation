import { $ } from "@wdio/globals";
import Page from "./page.ts";

class HomepagePages extends Page {
  public textIndicator(text: string) {
    return $(`//android.widget.TextView[@text="${text}"]`);
  }

  public get perbaruiDataBtn() {
    return $('//android.widget.TextView[@text="Perbarui Data"]');
  }

  public get changeProgramBtn() {
    return $("//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View[1]/android.view.View[1]/android.view.View[1]/android.widget.Button");
  }

  public get unduhProgramLainnyaBtn() {
    return $('//android.widget.TextView[@text="Unduh program lainnya"]');
  }

  public get checkboxFirstProgram() {
    return $("//android.widget.ScrollView/android.view.View[1]/android.widget.CheckBox");
  }

  public get confirmDownloadBtn() {
    return $("//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[3]/android.widget.Button");
  }

  public get backButton1() {
    return $("//android.widget.Button");
  }

  public get backButton2() {
    return $("//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.widget.Button");
  }

  public get homeFootbarIndicator() {
    return $("//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View[2]");
  }

  async scrollSlightlyToText(text: string) {
    try {
      const scrollLocator = $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${text}"))`);
      await scrollLocator.waitForExist({ timeout: 5000 });
    } catch (e) {}
  }

  async clickPerbaruiData() {
    await this.perbaruiDataBtn.waitForDisplayed({ timeout: 10000, timeoutMsg: "Tombol Perbarui Data tidak ditemukan!" });
    await this.perbaruiDataBtn.click();
  }

  async clickChangeProgram() {
    await this.changeProgramBtn.waitForDisplayed({ timeout: 10000, timeoutMsg: "Tombol Settings Menu tidak ditemukan!" });
    await this.changeProgramBtn.click();
  }

  async clickUnduhProgramLainnya() {
    await this.unduhProgramLainnyaBtn.waitForDisplayed({ timeout: 10000, timeoutMsg: "Tombol Unduh program lainnya tidak ditemukan!" });
    await this.unduhProgramLainnyaBtn.click();
  }

  async clickFirstProgramCheckbox() {
    await this.checkboxFirstProgram.waitForDisplayed({ timeout: 10000, timeoutMsg: "Checkbox pertama tidak ditemukan!" });
    await this.checkboxFirstProgram.click();
  }

  async clickConfirmDownload() {
    await this.confirmDownloadBtn.waitForDisplayed({ timeout: 10000, timeoutMsg: "Tombol Confirm Download tidak ditemukan!" });
    await this.confirmDownloadBtn.click();
  }

  async clickBackButtons() {
    await this.backButton1.waitForDisplayed({ timeout: 10000, timeoutMsg: "Tombol Back pertama tidak ditemukan!" });
    await this.backButton1.click();
    console.log("bback 1 passed")
    await driver.pause(3000);

    await this.backButton2.waitForDisplayed({ timeout: 10000, timeoutMsg: "Tombol Back kedua tidak ditemukan!" });
    await this.backButton2.click();
    console.log("bback 2 passed")
  }
}

export default new HomepagePages();
