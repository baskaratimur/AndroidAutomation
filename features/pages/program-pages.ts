import { $ } from "@wdio/globals";
import Page from "./page.ts";

class ProgramPages extends Page {
  public get selectProgramIndicator() {
    return $('//android.widget.TextView[@text="Pilih program yang mau diunduh"]');
  }
  public get searchField() {
    return $("//android.widget.EditText");
  }
  public get refreshProgramBtn() {
    return $("//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[1]");
  }
  public get downloadBtn() {
    return $("//androidx.compose.ui.platform.ComposeView/android.view.View/android.view.View/android.view.View[3]");
  }
  public get completeDownloadBtn(){
    return $("(//android.widget.TextView[@text='Selesai'])[6]")
  }

  public selectProgramLocator(programIndex: number) {
    return $(`//android.widget.ScrollView/android.view.View[${programIndex}]/android.widget.CheckBox`);
  }
  
  public downloadIndicator(message: string) {
    return $(`//android.widget.TextView[@text='${message}']`);
  }

  public progressNameIndicator(name: string) {
    return $(`//android.widget.TextView[@text='${name}']`);
  }

  public progressStatusIndicator(index: number) {
    return $(`(//android.widget.TextView[@text='Selesai'])[${index}]`);
  }

  public programListItem(name: string) {
    return $(`//android.widget.TextView[@text="${name}"]`);
  }

  public getPlacehodlerSearchfield(placeholder: string){
    return $(`//android.widget.TextView[@text="${placeholder}"]`)
  }

  async searchProgram(programName: string) {
    await this.searchField.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Field pencarian tidak ditemukan!"
    });
    await this.searchField.setValue(programName);
  }

  async clearSearchField() {
    await this.searchField.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Field pencarian tidak ditemukan!"
    });
    await this.searchField.clearValue();
  }

  async refreshProgramList() {
    await this.refreshProgramBtn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Tombol refresh tidak ditemukan!"
    });
    await this.refreshProgramBtn.click();
  }

  async selectProgram() {
    for (let i = 1; i <= 2; i++) {
      const checkbox = this.selectProgramLocator(i);
      await checkbox.waitForDisplayed({
        timeout: 10000,
        timeoutMsg: `Checkbox program ke-${i} tidak ditemukan!`
      });
      await checkbox.click();
    }
  }

  async clickDownload() {
    await this.downloadBtn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Tombol download tidak ditemukan!"
    });
    await this.downloadBtn.click();
  }
}

export default new ProgramPages();
