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
  private downloadIndicator(message: string) {
    return $(`//android.widget.TextView[@text='${message}']`);
  }

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

  async progressDownload(){
    const downloadProgressList = [
      'Data Program', 
      'Lokasi Area Tanam', 
      'Data Pohon Monitoring', 
      'Master Data Spesies Pohon', 
      'Data Lainnya'
    ];
    try {
      for (const [index, name] of downloadProgressList.entries()){
        const isDisplayed = await $(`//android.widget.TextView[@text='${name}']`).waitForDisplayed({timeout: 50000});
        console.log("mencari", name)
        console.log(isDisplayed,"<<")
        expect(isDisplayed).toBe(true)

        const isDoneDownload = await ($(`(//android.widget.TextView[@text='Selesai'])[${index + 1}]`)).waitForDisplayed({timeout:50000});
        console.log("mencari", index+1)
        expect(isDoneDownload).toBe(true)
      }
      return true;   
    // try {
    //   await expect($("//android.widget.TextView[@text='Data Program']")).waitForDisplayed({timeout: 50000});
    //   await expect($("(//android.widget.TextView[@text='Selesai'])[1]")).toBeDisplayed();
  
    //   await expect($("//android.widget.TextView[@text='Lokasi Area Tanam']")).toBeDisplayed();
    //   await expect($("(//android.widget.TextView[@text='Selesai'])[2]")).toBeDisplayed();
  
    //   await expect($("//android.widget.TextView[@text='Data Pohon Monitoring']")).toBeDisplayed();
    //   await expect($("(//android.widget.TextView[@text='Selesai'])[3]")).toBeDisplayed();
  
    //   await expect($("//android.widget.TextView[@text='Master Data Species Pohon']")).toBeDisplayed();
    //   await expect($("(//android.widget.TextView[@text='Selesai'])[4]")).toBeDisplayed();
  
    //   await expect($("//android.widget.TextView[@text='Data Lainnya']")).toBeDisplayed();
    //   await expect($("(//android.widget.TextView[@text='Selesai'])[5]")).toBeDisplayed();
    } catch (error) {
      return false;
    }
  }

  async isAtDownloadCompleted(message: string) {
    await this.downloadIndicator(message).waitForDisplayed({
      timeout: 50000,
      timeoutMsg: "User tidak berada di halaman unduhan selesai!",
    });
    return await this.downloadIndicator(message).isDisplayed();
  }
}

export default new ProgramPages();
