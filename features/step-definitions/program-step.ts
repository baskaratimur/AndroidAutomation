import { Given, When, Then } from "@wdio/cucumber-framework";
import ProgramPages from "../pages/program-pages.ts";

let isProgramFound: boolean;

Given("user is on the select program page", async () => {
  const isAtProgram = await ProgramPages.isAtSelectProgram();
  expect(isAtProgram).toBe(true);
});

When("user searches for program {string} and expect to be true", async (programName) => {
  isProgramFound = await ProgramPages.searchProgram(programName);
  expect(isProgramFound).toBe(true);
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

Then("user should see download complete", async () => {
  const isAtDownloadCompleted = await ProgramPages.isAtDownloadCompleted();
  expect(isAtDownloadCompleted).toBe(true);
});

Then("user should see program message {string}", async (message) => {
  const actualMsg = await ProgramPages.verifyMessage(message);
  await expect(actualMsg).toBe(message);
});
