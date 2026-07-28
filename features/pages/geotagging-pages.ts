import { $ } from "@wdio/globals";
import Page from "./page.ts";

class GeotaggingPages extends Page {
  public textIndicator(text: string) {
    return $(`//android.widget.TextView[@text="${text}"]`);
  }

  public get btnGeotagging() {
    return $('//android.view.View[@content-desc="Geotagging"]');
  }

  public get inputDiameter() {
    return $('//android.widget.TextView[@text="Ukuran diameter"]/following-sibling::android.widget.EditText[1]');
  }

  public get inputTinggi() {
    return $('//android.widget.TextView[@text="Tinggi pohon"]/following-sibling::android.widget.EditText[1]');
  }

  public get fieldKondisi() {
    return $('//android.widget.TextView[contains(@text, "Kondisi pohon")]/following-sibling::android.widget.EditText[1]');
  }

  public get simpanBtn() {
    return $('//android.widget.TextView[@text="Simpan"]/parent::android.widget.Button');
  }

  public get addPhotoBtn() {
    return $('//android.view.View[@content-desc="AddAPhoto"]');
  }

  public get gpsAccuracyValue() {
    return $('//android.widget.TextView[@text="Akurasi GPS"]/following-sibling::android.widget.TextView');
  }

  public get tabTinjau() {
    return $('//android.widget.TextView[@text="Tinjau"]/parent::android.view.View');
  }

  public get checkboxPhoto() {
    return $('//android.widget.TextView[@text="Data foto sesuai"]/preceding-sibling::android.widget.CheckBox');
  }

  public get checkboxLocation() {
    return $('//android.widget.TextView[@text="Lokasi akurat"]/preceding-sibling::android.widget.CheckBox');
  }

  public get checkboxComplete() {
    return $('//android.widget.TextView[@text="Pengisian data lengkap"]/preceding-sibling::android.widget.CheckBox');
  }

  public get btnKirimSemuaDataSheet() {
    return $('//android.widget.TextView[@text="Kirim Semua Data"]');
  }

  public get statusBerhasil() {
    return $('//android.widget.TextView[contains(@text, "Berhasil")]');
  }

  public get btnSelesai() {
    return $('//android.widget.TextView[@text="Selesai"]');
  }

  async clickGeotaggingMenu() {
    await this.btnGeotagging.waitForDisplayed({ timeout: 10000 });
    await this.btnGeotagging.click();
  }

  async selectBlock(blockName: string) {
    const block = this.textIndicator(blockName);
    await block.waitForDisplayed({ timeout: 10000 });
    await block.click();
  }

  async clickKunciLokasi() {
    await driver.pause(5000);
    const btn = this.textIndicator("Kunci Lokasi");
    await btn.waitForDisplayed({ timeout: 10000 });
    await btn.click();
  }

  async selectSpecies(speciesName: string) {
    const field = this.textIndicator("Pilih Spesies Pohon");
    await field.waitForDisplayed({ timeout: 10000 });
    await field.click();
    
    const species = this.textIndicator(speciesName);
    await species.waitForDisplayed({ timeout: 10000 });
    await species.click();
    await driver.pause(1000);
  }

  async selectCondition(condition: string) {
    await this.swipeUp(0.2);
    await this.fieldKondisi.waitForDisplayed({ timeout: 10000 });
    await this.fieldKondisi.click();
    
    const opt = this.textIndicator(condition);
    await opt.waitForDisplayed({ timeout: 10000 });
    await opt.click();
    await driver.pause(1000);
  }

  async swipeUp(distance: number = 0.5) {
    const { width, height } = await driver.getWindowRect();
    const startX = Math.floor(width / 2);
    const startY = Math.floor(height * 0.8);
    const endY = Math.floor(height * (0.8 - distance));

    await driver.action('pointer')
      .move({ x: startX, y: startY })
      .down()
      .pause(100)
      .move({ duration: 800, x: startX, y: endY })
      .up()
      .perform();
    
    await driver.pause(1500);
  }

  async handlePhotoTaking() {
    await this.addPhotoBtn.waitForDisplayed({ timeout: 10000 });
    await this.addPhotoBtn.click();
    await driver.pause(4000);

    let accuracy = 0;
    for (let i = 0; i < 30; i++) {
        const accuracyText = await this.gpsAccuracyValue.getText();
        accuracy = parseFloat(accuracyText.replace(/[^0-9.]/g, ''));
        if (accuracy > 0 && accuracy < 30) {
          console.log(`✅ [Assert] GPS Akurat: ${accuracyText} Meter`);
          break;
        }
        await driver.pause(1000);
    }
    
    // Assert Jarak Anda
    const jarakValText = await $('//android.widget.TextView[@text="Jarak Anda"]/following-sibling::android.widget.TextView').getText();
    const jarak = parseFloat(jarakValText.replace(/[^0-9.]/g, ''));
    if (jarak === 0) {
      console.warn(`⚠️ [Warning] Jarak Anda saat foto adalah 0 (${jarakValText})`);
    } else {
      console.log(`✅ [Assert] Jarak Anda saat foto: ${jarakValText}`);
    }

    await driver.action('pointer')
      .move({ x: 720, y: 2610 })
      .down()
      .up()
      .perform();
    
    await driver.pause(4000);

    const btnConfirm = $('//*[contains(@text, "Unggah") or contains(@text, "Simpan")]');
    await btnConfirm.waitForDisplayed({ timeout: 10000 });
    await btnConfirm.click();
    await driver.pause(3000);
  }

  async fillForm(species: string, condition?: string, diameter?: string, tinggi?: string) {
    await this.selectSpecies(species);
    if (condition) await this.selectCondition(condition);

    await this.swipeUp(0.4);
    if (diameter) {
      await this.inputDiameter.waitForDisplayed({ timeout: 10000 });
      await this.inputDiameter.click();
      await driver.pause(1000);
      await this.inputDiameter.addValue(diameter);
      if (await driver.isKeyboardShown()) await driver.hideKeyboard();
      await driver.pause(1000);
    }
    if (tinggi) {
      await this.swipeUp(0.5); 
      await this.inputTinggi.waitForDisplayed({ timeout: 10000 });
      await this.inputTinggi.click();
      await driver.pause(1000);
      await driver.keys(tinggi);
      if (await driver.isKeyboardShown()) await driver.hideKeyboard();
    }

    if (diameter || tinggi) {
      await this.swipeUp(0.5);
      await driver.pause(1000);
    }

    await this.swipeUp(0.5); 
  }

  async clickSimpan() {
    await this.swipeUp(0.3);
    const btn = this.textIndicator("Simpan");
    await btn.waitForDisplayed({ timeout: 10000 });
    await btn.click();
    await driver.pause(2000);
  }

  async openTinjauTab() {
    await this.tabTinjau.waitForDisplayed({ timeout: 10000 });
    await this.tabTinjau.click();
    await driver.pause(2000);
  }

  async confirmAndSubmitAll() {
    const btnFirst = this.textIndicator("Kirim Semua Data");
    await btnFirst.waitForDisplayed({ timeout: 10000 });
    await btnFirst.click();
    await driver.pause(2000);

    await this.checkboxPhoto.waitForDisplayed({ timeout: 5000 });
    await this.checkboxPhoto.click();
    await this.checkboxLocation.click();
    await this.checkboxComplete.click();
    await driver.pause(1000);

    await this.btnKirimSemuaDataSheet.waitForDisplayed({ timeout: 15000 });
    await this.btnKirimSemuaDataSheet.click();
    await driver.pause(5000);
  }

  async verifySuccess() {
    await this.statusBerhasil.waitForDisplayed({ timeout: 15000 });
    const text = await this.statusBerhasil.getText();
    console.log(`Submission Status: ${text}`);
    await this.btnSelesai.click();
  }
}

export default new GeotaggingPages();
