import { Given, When, Then } from "@wdio/cucumber-framework";
import { expect } from "@wdio/globals";

import GeotaggingPages from "../pages/geotagging-pages.ts";
import HomepagePages from "../pages/homepage-pages.ts";
import { GlobalState } from "../support/state.ts";

Given(/^user ensures geotagging button is visible$/, async () => {
    await expect(HomepagePages.btnGeotagging).toBeDisplayed({
        message: "Halaman dashboard tidak menampilkan menu Geotagging!",
        wait: 10000
    });
});

When(/^user clicks on Geotagging menu$/, async () => {
  await HomepagePages.btnGeotagging.waitForDisplayed({ timeout: 10000 });
  await HomepagePages.btnGeotagging.click();
});

When(/^user selects block "([^"]*)"$/, async (blockName: string) => {
  await GeotaggingPages.selectBlock(blockName);
});

When(/^user clicks Kunci Lokasi button$/, async () => {
  await GeotaggingPages.clickKunciLokasi();
});

Then(/^user should see Informasi tab with block "([^"]*)" and owner "([^"]*)"$/, async (block: string, owner: string) => {
  const tabInformasi = GeotaggingPages.textIndicator("Informasi");
  await tabInformasi.click();
  
  const blockVal = GeotaggingPages.textIndicator(block);
  await expect(blockVal).toBeDisplayed({ wait: 5000 });
  console.log(`✅ [Assert] Blok '${block}' ditemukan di tab Informasi`);
  
  const ownerVal = GeotaggingPages.textIndicator(owner);
  await expect(ownerVal).toBeDisplayed({ wait: 5000 });
  console.log(`✅ [Assert] Pemilik Lahan '${owner}' ditemukan di tab Informasi`);
});

Then(/^user should see Lokasi tab with text "([^"]*)"$/, async (text: string) => {
  const tabLokasi = GeotaggingPages.textIndicator("Lokasi");
  await tabLokasi.click();
  
  const lokVal = GeotaggingPages.textIndicator(text);
  await expect(lokVal).toBeDisplayed({ wait: 5000 });
  console.log(`✅ [Assert] Teks '${text}' ditemukan di tab Lokasi`);
});

Then(/^user should see GPS tab with valid coordinates$/, async () => {
  const tabGPS = GeotaggingPages.textIndicator("GPS");
  await tabGPS.click();
  
  const gpsMobile = GeotaggingPages.textIndicator("GPS Mobile");
  await expect(gpsMobile).toBeDisplayed({ wait: 5000 });
  
  const gpsRtk = GeotaggingPages.textIndicator("GPS RTK");
  await expect(gpsRtk).toBeDisplayed({ wait: 5000 });
  console.log(`✅ [Assert] GPS Mobile dan GPS RTK ditemukan di tab GPS`);
  
  let isNotZero = false;
  for (let i = 0; i < 30; i++) {
    const akurasi = await $('//android.widget.TextView[@text="Akurasi"]/following-sibling::android.widget.TextView[1]').getText();
    const latlong = await $('//android.widget.TextView[@text="Lat, Long"]/following-sibling::android.widget.TextView[1]').getText();
    const elevasi = await $('//android.widget.TextView[@text="Elevasi"]/following-sibling::android.widget.TextView[1]').getText();
    
    // Asumsi default adalah "0.0 Meter", jika beda, berarti sudah ada koordinat
    if (!akurasi.includes("0.0") && !latlong.includes("0.0, 0.0")) {
      console.log(`✅ [Assert] Koordinat GPS Valid! LatLong: ${latlong}, Akurasi: ${akurasi}, Elevasi: ${elevasi}`);
      isNotZero = true;
      break;
    }
    await driver.pause(1000);
  }
  
  if (!isNotZero) {
    throw new Error("❌ Koordinat GPS (Lat, Long, Akurasi) masih 0 setelah menunggu 30 detik!");
  }
});

When(/^user fills geotagging form with species "([^"]*)", condition "([^"]*)", diameter "([^"]*)" and height "([^"]*)"$/, 
async (species: string, condition: string, diameter: string, height: string) => {
  await GeotaggingPages.fillForm(species, condition, diameter, height);
});

When(/^user just fills geotagging form with species "([^"]*)"$/, 
async (species: string) => {
  await GeotaggingPages.fillForm(species);
});

When(/^user clicks Simpan button$/, async () => {
  await GeotaggingPages.clickSimpan();
});

When(/^user takes a photo of the tree$/, async () => {
  await GeotaggingPages.handlePhotoTaking();
});

Then(/^user should see data review with status "([^"]*)"$/, async (status: string) => {
  const element = GeotaggingPages.textIndicator(status);
  await expect(element).toBeDisplayed({ wait: 10000 });
});

When(/^user opens the Tinjau tab$/, async () => {
  await GeotaggingPages.openTinjauTab();
});

When(/^user confirms checkboxes and submits all data$/, async () => {
  await GeotaggingPages.confirmAndSubmitAll();
});

Then(/^user verifies Tinjau card contains block "([^"]*)", species "([^"]*)", diameter "([^"]*)" and height "([^"]*)"$/, 
async (block: string, species: string, diameter: string, height: string) => {
  const elementsToVerify = [block, species, diameter, height];
  for (const text of elementsToVerify) {
    const element = $(`//android.widget.TextView[contains(@text, "${text}")]`);
    await expect(element).toBeDisplayed({ wait: 5000 });
    console.log(`✅ [Assert] Data Tinjau: '${text}' sesuai`);
  }

  // Get dynamic tree code
  const codeElement = $(`//android.widget.TextView[@text="${species}"]/parent::*/android.widget.TextView[2]`);
  await codeElement.waitForDisplayed({ timeout: 5000 });
  const treeCode = await codeElement.getText();
  GlobalState.treeCode = treeCode;
  console.log(`✅ [Assert] Kode Pohon yang disimpan ke state global: ${treeCode}`);
});

Then(/^user should see success notification and click Selesai$/, async () => {
  await GeotaggingPages.verifySuccess();
});

Then(/^user should return to the dashboard$/, async () => {
  await expect(HomepagePages.btnGeotagging).toBeDisplayed({ wait: 10000 });
});

When(/^user performs looping geotagging (\d+) times with species "([^"]*)", condition "([^"]*)", diameter "([^"]*)" and height "([^"]*)"$/, 
async (count: string, species: string, condition: string, diameter: string, height: string) => {
  const iterations = parseInt(count);
  for (let i = 1; i <= iterations; i++) {
    console.log(`>>> Looping Geotagging ke-${i} dari ${iterations}`);
    
    // 1. Klik Kunci Lokasi
    await GeotaggingPages.clickKunciLokasi();
    
    // 2. Isi Form
    await GeotaggingPages.fillForm(species, condition, diameter, height);
    
    // 3. Ambil Foto
    await GeotaggingPages.handlePhotoTaking();

    // 4. Klik Simpan
    await GeotaggingPages.clickSimpan();
    
    // Tambahan: Tunggu sebentar agar kembali ke posisi map/ready untuk looping berikutnya
    await driver.pause(2000);
  }
});
