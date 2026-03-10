import { Before } from '@wdio/cucumber-framework';
import LoginPage from '../pages/login-pages.ts';


// Hook ini akan terpanggil jika Feature atau Scenario punya tag @noReset
Before({ tags: '@noResetSession' }, async () => {
    console.log('>>> Hook @noReset aktif: Kita tidak akan mematikan aplikasi');
    // Logika tambahan jika perlu
});

Before({ tags: '@resetSession' }, async () => {
    const appId = 'com.jejakin.atlas.dev';
    const activityId = 'com.jejakin.atlas.screens.onboarding.LoginActivity';

    console.log(`>>> Hook @resetSession: Restarting ${appId} ke ${activityId}`);

    try {
        // 1. Matikan aplikasi jika sedang berjalan
        await driver.terminateApp(appId);
        
        // 2. Tunggu sebentar agar sistem Android memproses terminasi
        await driver.pause(1000);

        // 3. Jalankan kembali langsung ke LoginActivity
        await driver.execute('mobile: startActivity', {
            component: `${appId}/${activityId}`
        });

        console.log('>>> Aplikasi berhasil di-restart ke halaman Login.');
    } catch (error) {
        console.error('>>> Gagal melakukan restart aplikasi:', error);
        // Fallback jika startActivity gagal
        await driver.activateApp(appId);
    }
});

/**
 * Hook @authenticated: Memastikan user sudah login sebelum scenario berjalan.
 * Jika belum login, akan melakukan login otomatis.
 * Setelah itu akan langsung lompat (deep linking/startActivity) ke ProgramActivity.
 */
Before({ tags: '@authenticated' }, async () => {
    const appId = 'com.jejakin.atlas.dev';
    
    console.log('>>> Hook @authenticated: Memeriksa sesi login...');

    // 1. Cek apakah kita di halaman Login
    const atLogin = await LoginPage.isAtLoginPage(5000);

    if (atLogin) {
        console.log('>>> Sesi tidak ditemukan, melakukan login otomatis...');
        
        // Login dengan kredensial valid (Storage State ala Playwright)
        await LoginPage.enterCredentials('baskaratesting4', 'Jejakin2023!');
        await LoginPage.clickLogin();
        
        // Tunggu sampai login berhasil
        const success = await LoginPage.isAtHomePage();
        if (!success) {
            console.error('>>> Gagal login otomatis, mencoba reload app...');
            await driver.terminateApp(appId);
            await driver.activateApp(appId);
            await LoginPage.enterCredentials('baskaratesting1', 'Jejakin2023!');
            await LoginPage.clickLogin();
        }
        console.log('>>> Login berhasil'); 
    }

    console.log('>>> Sesi login aktif');
    
    // 2. Langsung lompat ke Activity tujuan (ProgramActivity)
    // try {
    //     await driver.execute('mobile: startActivity', {
    //         component: `${appId}/com.jejakin.atlas.screens.program.ProgramActivity` 
    //     });
    // } catch (e) {
    //     console.warn('>>> Gagal jump ke ProgramActivity, mencoba MainActivity as fallback');
    //     await driver.execute('mobile: startActivity', {
    //         component: `${appId}/com.jejakin.atlas.screens.main.MainActivity`
    //     });
    // }
});

