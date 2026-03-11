import { $ } from "@wdio/globals";
import Page from "./page.ts";

class LoginPage extends Page {
  public get userField() {
    return $("//android.widget.ScrollView/android.widget.EditText[1]");
  }
  public get passField() {
    return $("//android.widget.ScrollView/android.widget.EditText[2]");
  }
  public get loginBtn() {
    return $('//android.widget.TextView[@text="Masuk"]');
  }
  public get checkboxBtn() {
    return $("//android.widget.CheckBox");
  }
  public get homeIndicator() {
    return $('//android.widget.TextView[@text="Pilih program yang mau diunduh"]');
  }

  async enterCredentials(username: string, password: string) {
    await this.userField.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Field username tidak ditemukan!"
    });
    await this.userField.setValue(username);

    await this.passField.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Field password tidak ditemukan!"
    });
    await this.passField.setValue(password);
  }

  async clickLogin() {
    await this.loginBtn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Tombol login tidak ditemukan!"
    });
    await this.loginBtn.click();
  }

  async checkboxRememberMe() {
    await this.checkboxBtn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Checkbox remember me tidak ditemukan!"
    });
    const status = await this.checkboxBtn.getAttribute("checked");

    if (status === "false" || status === null) {
      await this.checkboxBtn.click();
    }
  }
}

export default new LoginPage();
