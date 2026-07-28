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
    const titles = [
        "Cakupan dan Penerimaan",
        "Pengumpulan Informasi",
        "Tujuan Penggunaan Data",
        "Keamanan Pembagian Data",
        "Hak Pengguna",
        "Cookie dan Pelacakan",
        "Penyimpanan dan Penghapusan Data",
        "Kontak dan Keluhan",
        "https://www.jejakin.com/privacy-policy"
    ];

    for (const title of titles) {
        await ProfilePages.scrollToText(title);
        await expect(ProfilePages.textIndicator(title)).toBeDisplayed({ wait: 5000 });
    }
});

When("user presses back button", async () => {
    await driver.back();
    await driver.pause(1000); 
});

Then("user should see terms and conditions content", async () => {
    await expect(ProfilePages.textIndicatorSyaratKetentuanIndex2).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicatorSyaratKetentuanIndex1).toBeDisplayed({ wait: 10000 });
    const titles = [
        "Gambaran Umum dan Penerimaan",
        "Pengaturan dan Keamanan Akun",
        "Layanan yang Disediakan",
        "Transaksi dan Pembayaran",
        "Aktivitas Terlarang dan Pembatasan Penggunaan",
        "Kekayaan Intelektual",
        "Batasan Tanggung Jawab dan Pernyataan Penyangkalan",
        "Hukum yang Mengatur dan Penyelesaian Sengketa",
        "Penghentian dan Perubahan"
    ];

    for (const title of titles) {
        await ProfilePages.scrollToText(title);
        await expect(ProfilePages.textIndicator(title)).toBeDisplayed({ wait: 5000 });
    }
});

Then("user should see language options", async () => {
    await expect(ProfilePages.textIndicator("Indonesia")).toBeDisplayed({ wait: 10000 });
    await expect(ProfilePages.textIndicator("Inggris")).toBeDisplayed({ wait: 10000 });
});
