import * as fs from "node:fs";
import * as Table from "cli-table3";
import { execSync } from 'child_process';

export const config: WebdriverIO.Config = {
  maxInstances: 1,
  hostname: "127.0.0.1",
  port: 4723,
  path: "/",
  logLevel: "warn",
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,

  specs: ["./features/**/*.feature"],
  reporters: [
    [
      "spec",
      {
        symbols: {
          passed: "✅",
          failed: "❌",
          skipped: "🔘",
        },
        addConsoleLogs: false,
      },
    ],
    // ['cucumberjs-json', {
    //   jsonFolder: './reports/json/',
    //   language: 'en',
    // }],
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: true,
      },
    ],
    [
      "json",
      {
        outputDir: "./reports",
        outputFileFormat: function() {  
           return "wdio-report.json"
        }
      },
    ],
  ],
  capabilities: [
    {
      "appium:platformName": "Android",
      "appium:automationName": "UiAutomator2",
      "appium:deviceName": "emulator-5554",
      "appium:app": "./src/test-data/automation-pijak.apk",
      "appium:noReset": true,
      "appium:fullReset": false,
      "appium:newCommandTimeout": 300,
      "appium:adbExecTimeout": 60000,
      "appium:uiautomator2ServerInstallTimeout": 60000,
    },
  ],

  // settingan appium inspector
  //   "udid": "emulator-5554",
  // {
  //   "udid": "RR8M20NSXWT",
  //   "automationName": "UiAutomator2",
  //   "platformName": "Android",
  //   "appPackage": "com.jejakin.atlas.dev",
  //   "appium:appActivity": "com.jejakin.atlas.screens.program.ProgramActivity",
  //   "deviceName": "VirtualDevice",
  //   "appium:noReset": true,
  //   "appium:fullReset": false
  // }

  services: [
    [
      "appium",
      {
        args: {
          relaxedSecurity: true,
        },
        command: "appium",
      },
    ],
  ],

  framework: "cucumber",
  cucumberOpts: {
    require: ["./features/step-definitions/*.ts"],
    backtrace: false,
    requireModule: ["ts-node/register"],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tagExpression: "",
    timeout: 120000,
    ignoreUndefinedDefinitions: false,
  },

  onPrepare: function () {
    if (!fs.existsSync("./.test_results")) {
      fs.mkdirSync("./.test_results");
    } else {
      const files = fs.readdirSync("./.test_results");
      for (const file of files) {
        fs.unlinkSync(`./.test_results/${file}`);
      }
    }
  },

  afterScenario: async function (world: any, result: any) {
    const id = world.pickle.id || Math.random().toString(36).substring(7);
    const durationMs = result.duration || 0;

    const scenarioResult = {
      feature: world.gherkinDocument.feature.name,
      scenario: world.pickle.name,
      status: result.passed ? "PASSED ✅" : "FAILED ❌",
      duration: `${(durationMs / 1000).toFixed(2)}s`,
    };

    fs.writeFileSync(
      `./.test_results/result-${id}.json`,
      JSON.stringify(scenarioResult),
    );
  },

  onComplete: function () {
    if (!fs.existsSync("./.test_results")) return;

    const files = fs.readdirSync("./.test_results");
    if (files.length === 0) return;

    const results = files.map((file) =>
      JSON.parse(fs.readFileSync(`./.test_results/${file}`, "utf8")),
    );

    const TableConstructor = (Table as any).default || Table;
    const table = new TableConstructor({
      head: ["Feature", "Scenario", "Status", "Duration"],
      colWidths: [28, 48, 15, 12],
      wordWrap: true,
      style: {
        head: ["cyan", "bold"],
        border: ["grey"],
      },
    });

    let passedCount = 0;
    let failedCount = 0;

    results.forEach((res: any) => {
      table.push([res.feature, res.scenario, res.status, res.duration]);
      if (res.status.includes("PASSED")) passedCount++;
      else failedCount++;
    });

    console.log("\n" + "=".repeat(108));
    console.log("       🚀  TEST EXECUTION SUMMARY 🚀");
    console.log("=".repeat(108));
    console.log(table.toString());

    console.log("=".repeat(108));
    console.log(
      `  📊 RESULTS:  ✅ ${passedCount} Passed  |  ❌ ${failedCount} Failed  |  TOTAL: ${results.length}`,
    );
    console.log("=".repeat(108) + "\n");

    for (const file of files) {
      fs.unlinkSync(`./.test_results/${file}`);
    }
    fs.rmdirSync("./.test_results");

    try {
      console.log("\n🚀 Memproses pengiriman laporan ke Microsoft Teams...");

      execSync("npx tsx ./src/utils/send-to-teams.ts", { stdio: "inherit" });
    } catch (error) {
      console.error("❌ Gagal mengirim laporan ke Teams:", error);
    }
  },
};
