import { $ } from "@wdio/globals";
import Page from "./page.ts";

class ProfilePages extends Page {
  public textIndicator(text: string) {
    return $(`//android.widget.TextView[@text="${text}"]`);
  }

  public get textIndicatorKebijakanPrivasiIndex1() {
    return $("(//android.widget.TextView[@text='Kebijakan Privasi'])[1]");
  }

  public get textIndicatorKebijakanPrivasiIndex2() {
    return $("(//android.widget.TextView[@text='Kebijakan Privasi'])[2]");
  }

  public get textIndicatorSyaratKetentuanIndex1() {
    return $("(//android.widget.TextView[@text='Syarat & Ketentuan'])[1]");
  }

  public get textIndicatorSyaratKetentuanIndex2() {
    return $("(//android.widget.TextView[@text='Syarat & Ketentuan'])[2]");
  }

  public get hubungiBtn() {
    return $("//android.widget.Button");
  }

  public get closeBottomSheetBtn() {
    return $("//android.view.ViewGroup[@resource-id='android:id/content']/android.view.View/android.view.View/android.view.View[1]");
  }

  async clickMenu(text: string) {
    const menu = this.textIndicator(text);
    await menu.waitForDisplayed({ timeout: 10000, timeoutMsg: `Menu ${text} tidak ditemukan!`});
    await menu.click();
  }

  async clickHubungiButton() {
    await this.hubungiBtn.waitForDisplayed({ timeout: 10000, timeoutMsg: "Tombol Hubungi tidak ditemukan!"});
    await this.hubungiBtn.click();
  }

  async closeBottomSheet() {
    await this.closeBottomSheetBtn.waitForDisplayed({ timeout: 10000, timeoutMsg: "Tombol Close BottomSheet tidak ditemukan!"});
    await this.closeBottomSheetBtn.click();
  }

  async swipeUp() {
    const { width, height } = await driver.getWindowRect();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.90);
    const endY = Math.floor(height * 0.15); 

    await driver
      .action('pointer')
      .move({ x: startX, y: startY })
      .down()
      .pause(100)
      .move({ duration: 500, x: startX, y: endY })
      .up()
      .perform();
      
    await driver.pause(1000);
  }

  async scrollToText(text: string, maxSwipes: number = 30) {
    const element = this.textIndicator(text);

    for (let i = 0; i < maxSwipes; i++) {
      try {
        const isDisplayed = await element.isDisplayed();
        if (isDisplayed) {
          return;
        }
      } catch (error) {}
      await this.swipeUp();
    }
  }
}

export default new ProfilePages();
