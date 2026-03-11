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

Then("user should see progress download", async () => {
  const progress = await ProgramPages.progressDownload();
  expect(progress).toBe(true)
});

Then("user should see download information {string}", async (message: string) => {
  const isAtDownloadCompleted = await ProgramPages.isAtDownloadCompleted(message);
  expect(isAtDownloadCompleted).toBe(true);
});

Then("user should see message {string}", async (message: string) => {
  const actualMsg = await ProgramPages.verifyMessage(message);
  await expect(actualMsg).toBe(message);
});
