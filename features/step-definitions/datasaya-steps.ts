import { When, Then } from "@wdio/cucumber-framework";
import DataSayaPages from "../pages/datasaya-pages.ts";
import { GlobalState } from "../support/state.ts";

When(/^user navigates to Data Saya page$/, async () => {
    await DataSayaPages.openDataSaya();
});

When(/^user clicks Perbarui Data button in Data Saya page$/, async () => {
    await DataSayaPages.clickPerbaruiData();
});

Then(/^user validates Geotagging data stats$/, async () => {
    await DataSayaPages.validateDataSayaAnalytics();
});

When(/^user clicks Selesai button in Data Saya$/, async () => {
    await DataSayaPages.clickSelesaiDownload();
});

When(/^user clicks Detail button in Data Saya page$/, async () => {
    await DataSayaPages.clickDetailGeotagging();
});

When(/^user searches for stored tree code$/, async () => {
    const code = GlobalState.treeCode;
    if (!code) throw new Error("No tree code found in global state!");
    await DataSayaPages.searchTreeCode(code);
});

Then(/^user verifies tree code details with species "([^"]*)", diameter "([^"]*)", height "([^"]*)"$/, 
async (species: string, diameter: string, height: string) => {
    const code = GlobalState.treeCode;
    await DataSayaPages.validateTreeDetails(code, species, diameter, height);
});
