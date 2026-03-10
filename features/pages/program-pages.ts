import { $ } from "@wdio/globals";
import Page from "./page";

class ProgramPages extends Page {
  private selectProgramIndicator = $(
    '//android.widget.TextView[@text="Pilih program yang mau diunduh"]',
  );
  private searchField = $("//android.widget.EditText");
  private resultSearchedProgram = $(
    '//android.widget.TextView[@text="Program Geotagging - North Rosalinda"]',
  );
  private refreshProgramBtn = $(
    "//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[1]",
  );
  private downloadBtn = $(
    "//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[3]",
  );
  private selectProgramLocator(programIndex: number) {
    return $(
      `//android.widget.ScrollView/android.view.View[${programIndex}]/android.widget.CheckBox`,
    );
  }
  private downloadCompletedIndicator = $(
    "//android.widget.TextView[@text='Unduhan Selesai']"
  );

  async isAtSelectProgram() {
    await this.selectProgramIndicator.waitForDisplayed({
      timeout: 5000,
      timeoutMsg: "User tidak berada di halaman pilih program!",
    });
    return await this.selectProgramIndicator.isDisplayed();
  }

  async searchProgram(programName: string) {
    try {
      await this.searchField.setValue(programName);
      return this.resultSearchedProgram.waitForDisplayed({
        timeout: 5000,
        timeoutMsg: `Program '${programName}' tidak ditemukan!`,
      });
    } catch (error) {
      return false;
    }
  }

  async clearSearchField() {
    await this.searchField.clearValue();
  }

  async refreshProgramList() {
    await this.refreshProgramBtn.click();
  }

  async verifyMessage(message: string) {
    const text: String = await this.getMessage(message);
    return text;
  }

  async selectProgram() {
    for (let i = 1; i <= 2; i++) {
      const checkbox = this.selectProgramLocator(i);
      await checkbox.click();
    }
  }

  async clickDownload() {
    await this.downloadBtn.click();
  }

  async isAtDownloadCompleted() {
    await this.downloadCompletedIndicator.waitForDisplayed({
      timeout: 50000,
      timeoutMsg: "User tidak berada di halaman unduhan selesai!",
    });
    return await this.downloadCompletedIndicator.isDisplayed();
  }
}

export default new ProgramPages();
