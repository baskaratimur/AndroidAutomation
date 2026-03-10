import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

dotenv.config();

const webhookUrl = `${process.env.webhook_teams}`;
const sendReportToTeams = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Path disesuaikan dengan log kamu
  const pathReport = path.join(
    __dirname,
    "../../reports/",
    "wdio-report.json",
  );

  if (!fs.existsSync(pathReport)) {
    console.error("❌ Report file not found!");
    return;
  }

  const reportContent = fs.readFileSync(pathReport, "utf-8");
  const wdioResults = JSON.parse(reportContent);

  // 1. Ambil Stats dari root 'state'
  const passed = wdioResults.state?.passed || 0;
  const failed = wdioResults.state?.failed || 0;
  const skipped = wdioResults.state?.skipped || 0;
  const totalTests = passed + failed + skipped;

  // 2. Ambil Nama Feature (Biasanya suite terakhir di file JSON kamu adalah nama Feature-nya)
  const allSuites = wdioResults.suites || [];
  const featureName =
    allSuites.length > 0 ? allSuites[allSuites.length - 1].name : "Mobile Test";

  // 3. Looping Scenarios untuk mencari Error
  const failedDetails: string[] = [];

  allSuites.forEach((suite: any) => {
    // Pastikan kita hanya memproses suite yang punya tests (Scenario)
    if (suite.tests && suite.tests.length > 0) {
      suite.tests.forEach((test: any) => {
        if (test.state === "failed") {
          const errMsg = test.error?.message
            ? test.error.message.split("\n")[0]
            : "Assertion Error";

          failedDetails.push(
            `- **Scenario**: ${suite.name}\n- **Step**: ${test.name}\n- **Error**: ${errMsg}`,
          );
        }
      });
    }
  });

  const failedTestList =
    failedDetails.length > 0
      ? failedDetails.join("\n\n")
      : "All scenarios passed successfully! ✅";

  const message = {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          type: "AdaptiveCard",
          body: [
            {
              type: "TextBlock",
              size: "Medium",
              weight: "Bolder",
              text: "🚀 WDIO Automation Report (Mobile)",
            },
            {
              type: "TextBlock",
              text: `📅 Execution Time: ${new Date().toLocaleString("id-ID")}`,
              isSubtle: true,
              spacing: "None",
            },
            {
              type: "FactSet",
              facts: [
                { title: "Device", value: "Android Emulator" },
                { title: "Feature", value: featureName },
                { title: "Total Steps", value: totalTests.toString() },
                { title: "Passed", value: `${passed} ✅` },
                { title: "Failed", value: `${failed} ❌` },
                { title: "PIC", value: "<at>baskara</at>" },
              ],
            },
            {
              type: "TextBlock",
              text: failed > 0 ? "❌ **Failed Details:**" : "✅ **Status:**",
              weight: "Bolder",
              color: failed > 0 ? "Attention" : "Good",
              separator: true,
            },
            {
              type: "TextBlock",
              text: failedTestList,
              wrap: true,
              fontType: "Monospace",
              size: "Small",
            },
          ],
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          version: "1.2",
          msteams: {
            entities: [
              {
                type: "mention",
                text: "<at>baskara</at>",
                mentioned: {
                  id: "baskara.timur@jejakin.com",
                  name: "QA-baskara",
                },
              },
            ],
          },
        },
      },
    ],
  };
  console.log("📊 Sending report to Microsoft Teams...");
  console.log(JSON.stringify(message, null, 2));
  try {
    await axios.post(webhookUrl, message);
    console.log(
      "✅ Report successfully sent to Microsoft Teams with actual failed data.",
    );
  } catch (error: any) {
    console.error("❌ Error sending report:", error.message);
  }
};

sendReportToTeams();
