# BDD Automation - Pijak (Appium + WebDriverIO + Cucumber)

Proyek ini adalah kerangka (framework) otomatisasi pengujian untuk aplikasi Android Pijak (Jejakin Atlas) menggunakan pendekatan BDD (Behavior-Driven Development). Framework ini dibangun dengan **WebDriverIO (v9)**, **Appium**, **Cucumber**, dan **TypeScript**.

---

## 📋 Prasyarat (Prerequisites)

Sebelum menjalankan proyek ini, pastikan PC/Laptop Anda sudah terinstal:
1. **Node.js** (versi 18.x atau lebih baru)
2. **Java Development Kit (JDK)** (disarankan versi 11 atau 17)
3. **Android Studio** & **Android SDK** (Pastikan Environment Variable `ANDROID_HOME` dan `JAVA_HOME` sudah di-setup)
4. **Appium 2.x** (Otomatis ditangani oleh `@wdio/appium-service` jika diinstal via wdio, namun sangat disarankan untuk memiliki Appium Server terinstal secara global)
5. **Emulator Android** yang sedang berjalan (atau *Real Device* Android yang terhubung via kabel USB dengan opsi *USB Debugging* aktif).

---

## 🚀 Cara Instalasi dari Awal (From Scratch)

Jika Anda ingin membuat ulang proyek seperti ini dari nol, ini adalah tahapan instalari awalnya menggunakan *Command Line* / Terminal:

1. **Inisiasi Proyek WebDriverIO Baru:**
   ```bash
   npm init wdio .
   ```
   Saat ditanya oleh *wizard*, pilih jawaban berikut:
   - *Where is your automation backend located?* **On my local machine**
   - *Which framework do you want to use?* **Cucumber (https://cucumber.io/)**
   - *Do you want to use a compiler?* **TypeScript**
   - *Where are your feature files located?* **./features/**/*.feature**
   - *Where are your step definitions located?* **./features/step-definitions/steps.ts**
   - *Do you want WDIO to Autogenerate some test files?* **No / Yes**
   - *Which reporter do you want to use?* **spec, allure**
   - *Do you want to add a plugin to your test setup?* **wait-for**
   - *Do you want to add a service to your test setup?* **appium**

2. **Install Dependensi Tambahan (Untuk Tabel Report & Allure):**
   ```bash
   npm install --save-dev cli-table3 @wdio/allure-reporter
   ```

3. **Menyatukan File APK:**
   Siapkan file aplikasi Anda (contoh: `automation-pijak.apk`).
   Buat folder `src/test-data/` dan pindahkan `.apk` tersebut ke dalam folder ini.
   Update bagian `capabilities` di `wdio.conf.ts` menjadi:
   ```typescript
   capabilities: [{
     "appium:platformName": "Android",
     "appium:automationName": "UiAutomator2",
     "appium:deviceName": "emulator-5554", // Sesuaikan dengan list: adb devices
     "appium:app": "./src/test-data/automation-pijak.apk",
     // ...
   }]
   ```

---

## 📁 Struktur Proyek (Project Structure)

```text
bddpijak/
├── features/
│   ├── login.feature               # Skenario BDD terkait Fitur Login
│   ├── program.feature             # Skenario BDD terkait Fitur Program (Download dll)
│   ├── pages/                      # Page Object Model (POM)
│   │   ├── page.ts                 # Base Page / Helper
│   │   ├── login-pages.ts          # Locator & Aksi di aplikasi untuk halaman Login
│   │   └── program-pages.ts        # Locator & Aksi di aplikasi untuk halaman Program
│   └── step-definitions/           # Pemetaan Skenario Cucumber (Given, When, Then)
│       ├── hook.ts                 # Hooks (@resetSession, @authenticated, dll)
│       ├── login-step.ts           # Definisi implementasi langkah-langkah Login
│       └── program-step.ts         # Definisi implementasi langkah-langkah Program
├── src/test-data/                  # File pendukung (misalnya file .apk Android)
├── wdio.conf.ts                    # File Konfigurasi Induk WebDriverIO
├── package.json                    # Daftar script dan Library Node.js
└── tsconfig.json                   # Konfigurasi TypeScript
```

---

## 🛠 Aturan Tag (Tags Rules)

Framework ini memanfaatkan sistem Cucumber Tags (`@`) untuk mengatur alur state dari sesi aplikasi.

- `@resetSession` : Aplikasi akan dimatikan (terminate), dijeda (pause), dan dibangkitkan ulang (force restart) dari awal sehingga memulai sesi uji bersih (*clean state*), khususnya ke layar Login.
- `@authenticated` : Digunakan di atas skenario/feature yang *memerlukan akses lewat halaman yang mengharuskan user sudah login*. Hook akan otomatis mengecek: jika belum login maka dipaksa masuk dengan kredensial tersimpan; lalu jika sudah sukses (*skip session state*) langsung diarahkan ke layar `ProgramActivity`.
- `@noReset` : Menahan sesi dan tidak melakukan proses matikan ulang aplikasi di sela-sela skenario yang sedang berjalan.

---

## ▶️ Cara Menjalankan Test (How to Run)

1. Pastikan **Emulator Anda sudah menyala** atau hp Android sudah tercolok dan terbaca di log terminal (ketik: `adb devices`).

2. **Jalankan Semua Skenario Uji (All Features):**
   ```bash
   npx wdio run ./wdio.conf.ts
   ```

3. **Jalankan Fitur Spesifik (Contoh: hanya `program.feature`):**
   ```bash
   npx wdio run ./wdio.conf.ts --spec features/program.feature
   ```

4. **Keluaran Laporan (Terminal Reporter):**
   Setelah eksekusi seluruh skenario percobaan selesai, _script hooks_ `onComplete()` akan merapikan data dan menerbitkan "TEST EXECUTION SUMMARY" di terminal Anda:

   ```text
   ============================================================================================================
          🚀  TEST EXECUTION SUMMARY 🚀
   ============================================================================================================
   ┌──────────────────────────────┬─────────────────────────────────────────────┬───────────────┬────────────┐
   │ Feature                      │ Scenario                                    │ Status        │ Duration   │
   ├──────────────────────────────┼─────────────────────────────────────────────┼───────────────┼────────────┤
   │ Login Functionality          │ User failed to login with wrong password    │ PASSED ✅     │ 12.04s     │
   │ Login Functionality          │ User failed to login with wrong username    │ PASSED ✅     │ 9.54s      │
   │ Program Functionality        │ User can refresh the program                │ PASSED ✅     │ 15.01s     │
   └──────────────────────────────┴─────────────────────────────────────────────┴───────────────┴────────────┘
   ============================================================================================================
     📊 RESULTS:  ✅ 3 Passed  |  ❌ 0 Failed  |  TOTAL: 3
   ============================================================================================================
   ```
