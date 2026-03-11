import { Given, When, Then } from "@wdio/cucumber-framework";
import ProgramPages from "../pages/program-pages.ts";

Given("user is on the select program page", async () => {
  const element = ProgramPages.selectProgramIndicator;
  await expect(element).toBeDisplayed({
    message: "Halaman pilih program tidak ditemukan!",
    wait: 10000
  });
});

When("user searches for program {string} and expect to be true", async (programName: string) => {
  await ProgramPages.searchProgram(programName);

  const resultElement = ProgramPages.resultSearchedProgram;
  await expect(resultElement).toBeDisplayed({
    message: `Program pencarian '${programName}' tidak ditemukan!`,
    wait: 10000
  });
});

When("user clears the search field", async () => {
  await ProgramPages.clearSearchField();
});

When("user clicks the refresh program button", async () => {
  await ProgramPages.refreshProgramList();
});

When("user selects programs to download", async () => {
  await ProgramPages.selectProgram();
});

When("user clicks the download button", async () => {
  await ProgramPages.clickDownload();
});

Then("user should see progress download", async () => {
  const downloadProgressList = [
    'Data Program', 
    'Lokasi Area Tanam', 
    'Data Pohon Monitoring', 
    'Master Data Spesies Pohon', 
    'Data Lainnya'
  ];

  for (const [index, name] of downloadProgressList.entries()) {
    const nameElement = ProgramPages.progressNameIndicator(name);
    await expect(nameElement).toBeDisplayed({ 
      message: `The progress indicator: ${name} should be displayed`,
      wait: 10000 
    });

    const statusElement = ProgramPages.progressStatusIndicator(index + 1);
    await expect(statusElement).toBeDisplayed({ 
      message: `The status for indicator: ${name} should be completed`,
      wait: 50000 
    });
  }
});

Then("user should see download information {string}", async (message: string) => {
  const element = ProgramPages.downloadIndicator(message);
  await expect(element).toBeDisplayed({ 
      message: `The indicator: ${message} should be displayed`,
      wait: 50000 
  });
});

Then("user should see message {string}", async (message: string) => {
  const notificationElement = ProgramPages.getNotificationText(message);
  await expect(notificationElement).toBeDisplayed({
      message: `Pesan '${message}' tidak ditemukan!`,
      wait: 10000
  });
});
