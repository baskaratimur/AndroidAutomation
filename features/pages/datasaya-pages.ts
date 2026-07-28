import { $ } from "@wdio/globals";
import Page from "./page.ts";

class DataSayaPages extends Page {
    // Nav Bottom bar
    public get navDataSaya() { return $('//android.widget.TextView[@text="Data Saya"]/parent::android.view.View'); }
    
    // Header & Actions
    public get txtExportData() { return $('//android.widget.TextView[@text="Export Data"]'); }
    public get btnPerbaruiData() { return $('//android.widget.TextView[@text="Perbarui Data"]/parent::android.view.View'); }
    public get txtHeaderDataSaya() { return $('//android.widget.TextView[@text="Data Saya"]'); }

    // Geotagging Section
    public get txtPohonLabel() { return $('//android.widget.TextView[@text="Pohon"]'); }
    public get txtPohonCount() { return $('//android.widget.TextView[@text="Pohon"]/following-sibling::android.widget.TextView[1]'); }
    public get txtBerhasilCount() { return $('//android.widget.TextView[@text="Berhasil"]/following-sibling::android.widget.TextView[1]'); }
    public get txtJambuMutiaraCount() { return $('//android.widget.TextView[@text="Jambu Mutiara"]/following-sibling::android.widget.TextView[2]'); }
    public get btnDetailGeotagging() { return $('//android.widget.TextView[@text="Detail"]/parent::android.view.View'); }

    // Species Section
    public get txtJambuMutiara() { return $('//android.widget.TextView[@text="Jambu Mutiara"]'); }
    public get txtPsidiumGuajava() { return $('//android.widget.TextView[@text="Psidium Guajava"]'); }
    public get txtMangrove() { return $('//android.widget.TextView[@text="Mangrove (bakau Kacang)"]'); }
    public get txtRhizophora() { return $('//android.widget.TextView[@text="Rhizophora Apiculata"]'); }

    public get inputSearchKode() { return $('//android.widget.TextView[@text="Cari Kode pohon"]/parent::android.widget.EditText'); }
    public get btnSelesaiDownload() { return $('//android.widget.TextView[@text="Selesai"]/parent::android.view.View[@clickable="true"]'); }

    async openDataSaya() {
        await this.navDataSaya.waitForDisplayed({ timeout: 15000 });
        await this.navDataSaya.click();
        // Wait for the header to confirm we are on the right page
        await this.txtHeaderDataSaya.waitForDisplayed({ timeout: 10000 });
        await driver.pause(2000);
    }

    async clickPerbaruiData() {
        console.log("Attempting to click 'Perbarui Data' button...");
        try {
            await this.btnPerbaruiData.waitForDisplayed({ timeout: 15000 });
            console.log("Button found, clicking...");
            await this.btnPerbaruiData.click();
            await driver.pause(2000);
        } catch (e) {
            const textEl = await $('//android.widget.TextView[@text="Perbarui Data"]');
            if (await textEl.isDisplayed()) {
                console.log("Trying to click the text directly as fallback...");
                await textEl.click();
            } else {
                throw e;
            }
        }
    }

    async validateDataSayaAnalytics() {
        await this.txtExportData.waitForDisplayed({ timeout: 10000 });
        
        // Assert basic elements
        await expect(this.txtExportData).toBeDisplayed();
        await expect(this.btnPerbaruiData).toBeDisplayed();
        await expect(this.btnDetailGeotagging).toBeDisplayed();
        
        // Assert species labels
        await expect(this.txtJambuMutiara).toBeDisplayed();
        await expect(this.txtMangrove).toBeDisplayed();

        // Assert Pohon count
        const pohonText = await this.txtPohonCount.getText();
        const pohonValue = parseInt(pohonText.replace(/,/g, ''));
        console.log(`✅ [Assert] Total Pohon: ${pohonValue}`);
        if (pohonValue <= 0) {
            throw new Error(`Assertion Failed: Pohon data count is ${pohonValue}, expected more than 0.`);
        }

        // Assert Berhasil count
        const berhasilText = await this.txtBerhasilCount.getText();
        const berhasilValue = parseInt(berhasilText.replace(/,/g, ''));
        console.log(`✅ [Assert] Total Berhasil: ${berhasilValue}`);
        if (berhasilValue <= 0) {
            throw new Error(`Assertion Failed: Berhasil data count is ${berhasilValue}, expected more than 0.`);
        }

        // Assert Jambu Mutiara count
        const jambuText = await this.txtJambuMutiaraCount.getText();
        const jambuValue = parseInt(jambuText.replace(/,/g, ''));
        console.log(`✅ [Assert] Total Jambu Mutiara: ${jambuValue}`);
        if (jambuValue <= 0) {
            throw new Error(`Assertion Failed: Jambu Mutiara count is ${jambuValue}, expected more than 0.`);
        }
    }

    async clickSelesaiDownload() {
        await this.btnSelesaiDownload.waitForDisplayed({ timeout: 10000 });
        await this.btnSelesaiDownload.click();
        await driver.pause(2000);
    }

    async clickDetailGeotagging() {
        const btnDetail = $('//android.widget.TextView[@text="Detail"]');
        await btnDetail.waitForDisplayed({ timeout: 10000 });
        await btnDetail.click();
        await driver.pause(2000);
    }

    async searchTreeCode(code: string) {
        // Fallback to searching by exact text if parent EditText is hard to find
        const searchInput = $('//*[@text="Cari Kode pohon"]');
        await searchInput.waitForDisplayed({ timeout: 10000 });
        await searchInput.click();
        await driver.pause(1000);
        await driver.keys(code);
        if (await driver.isKeyboardShown()) await driver.hideKeyboard();
        await driver.pause(2000);
    }

    async validateTreeDetails(code: string, species: string, diameter: string, height: string) {
        // Based on the XML dump, the list shows these exact texts
        const codeEl = $(`//android.widget.TextView[contains(@text, "${code}")]`);
        await expect(codeEl).toBeDisplayed({ wait: 10000 });
        console.log(`✅ [Assert] Kode pohon mengandung '${code}' ditemukan di Detail Data Saya.`);

        const speciesEl = $(`//android.widget.TextView[@text="${species}"]`);
        await expect(speciesEl).toBeDisplayed({ wait: 5000 });
        console.log(`✅ [Assert] Spesies '${species}' sesuai.`);

        const diameterEl = $(`//android.widget.TextView[@text="Diameter ${diameter} Cm"]`);
        await expect(diameterEl).toBeDisplayed({ wait: 5000 });
        console.log(`✅ [Assert] Diameter '${diameter} Cm' sesuai.`);

        const heightEl = $(`//android.widget.TextView[@text="Tinggi ${height} Cm"]`);
        await expect(heightEl).toBeDisplayed({ wait: 5000 });
        console.log(`✅ [Assert] Tinggi '${height} Cm' sesuai.`);
    }
}

export default new DataSayaPages();
