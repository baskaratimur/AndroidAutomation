import { When, Then } from "@wdio/cucumber-framework";

import ProfilePages from "../pages/profile-pages.ts";
import HomepagePages from "../pages/homepage-pages.ts";

When("user clicks on {string} footbar menu", async (menuName: string) => {
  const footbarItem = HomepagePages.textIndicator(menuName);
  await footbarItem.waitForDisplayed({ timeout: 10000 });
  await footbarItem.click();
});

Then("user is on the profile page", async () => {
    const menus = [
        "Kebijakan Privasi", 
        "Syarat & Ketentuan", 
        "Bahasa", 
        "Keluar aplikasi", 
        "Hubungi Tim Pijak"
    ];
    for (const text of menus) {
        const item = ProfilePages.textIndicator(text);
        await expect(item).toBeDisplayed({ message: `${text} tidak ditemukan di profil!`, wait: 10000 });
    }
    await expect(ProfilePages.hubungiBtn).toBeDisplayed({ message: "Button hubungi tidak ditemukan!", wait: 10000 });
});

When("user clicks button hubungi", async () => {
    await ProfilePages.clickHubungiButton();
});

Then("user should see contact support options", async () => {
    await expect(ProfilePages.textIndicator("Hubungi Tim Pijak")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Hubungi lewat Email")).toBeDisplayed({ wait: 10000 });
});

When("user closes the bottom sheet", async () => {
    await ProfilePages.closeBottomSheet();
    await driver.pause(1000); 
});

When("user clicks on {string} menu", async (menu: string) => {
    await ProfilePages.clickMenu(menu);
});

Then("user should see privacy policy content", async () => {
    await expect(ProfilePages.textIndicatorKebijakanPrivasiIndex2).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicatorKebijakanPrivasiIndex1).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Cakupan dan Penerimaan")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Pengumpulan Informasi")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Tujuan Penggunaan Data")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Keamanan Pembagian Data")).toBeDisplayed({ wait: 10000 });
    
    await ProfilePages.scrollToText("Hak Pengguna");

    await expect(ProfilePages.textIndicator("Hak Pengguna")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Cookie dan Pelacakan")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Penyimpanan dan Penghapusan Data")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Kontak dan Keluhan")).toBeDisplayed({ wait: 10000 });
    
    await ProfilePages.scrollToText("https://www.jejakin.com/privacy-policy");

    await expect(ProfilePages.textIndicator("https://www.jejakin.com/privacy-policy")).toBeDisplayed({ wait: 10000 });
});

When("user presses back button", async () => {
    await driver.back();
    await driver.pause(1000); 
});

Then("user should see terms and conditions content", async () => {
    await expect(ProfilePages.textIndicatorSyaratKetentuanIndex2).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicatorSyaratKetentuanIndex1).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Gambaran Umum dan Penerimaan")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Pengaturan dan Keamanan Akun")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Layanan yang Disediakan")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Transaksi dan Pembayaran")).toBeDisplayed({ wait: 10000 });

    await ProfilePages.scrollToText("Aktivitas Terlarang dan Pembatasan Penggunaan");

    await expect(ProfilePages.textIndicator("Aktivitas Terlarang dan Pembatasan Penggunaan")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Kekayaan Intelektual")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Batasan Tanggung Jawab dan Pernyataan Penyangkalan")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Hukum yang Mengatur dan Penyelesaian Sengketa")).toBeDisplayed({ wait: 10000 });
    
    await ProfilePages.scrollToText("Penghentian dan Perubahan");

    await expect(ProfilePages.textIndicator("Penghentian dan Perubahan")).toBeDisplayed({ wait: 10000 });
});

Then("user should see language options", async () => {
    await expect(ProfilePages.textIndicator("Indonesia")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Inggris")).toBeDisplayed({ wait: 10000 });
});
