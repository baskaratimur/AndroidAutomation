import { $ } from "@wdio/globals";
import Page from "./page";

class LoginPage extends Page {
  private userField = $(
    "//android.widget.ScrollView/android.widget.EditText[1]",
  );
  private passField = $(
    "//android.widget.ScrollView/android.widget.EditText[2]",
  );
  private loginBtn = $('//android.widget.TextView[@text="Masuk"]');
  private checkboxBtn = $("//android.widget.CheckBox");
  private homeIndicator = $(
    '//android.widget.TextView[@text="Pilih program yang mau diunduh"]',
  );
  getNotificationText(message: string) {
    return $(`//android.widget.TextView[@text="${message}"]`);
  }

  async enterCredentials(username: string, password: string) {
    // WDIO otomatis menunggu elemen ada (waitForExist) sebelum setValue
    await this.userField.setValue(username);
    await this.passField.setValue(password);
  }

  async clickLogin() {
    await this.loginBtn.click();
  }

  async checkboxRememberMe() {
    const element = this.checkboxBtn;
    const status = await element.getAttribute("checked");

    if (status === "false" || status === null) {
      await element.click();
    }
  }

  async verifyMessage(message: string) {
    const text: String = await this.getMessage(message);
    return text;
  }

  async isAtLoginPage(timeoutMs: number = 30000) {
    try {
      return await this.userField.waitForDisplayed({ timeout: timeoutMs });
    } catch (error) {
      return false;
    }
  }

  async isAtHomePage() {
    try {
      return await this.homeIndicator.waitForDisplayed({ timeout: 15000 });
    } catch (error) {
      return false;
    }
  }
}

export default new LoginPage();
