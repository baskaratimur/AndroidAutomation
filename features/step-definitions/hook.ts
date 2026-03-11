import { Before } from '@wdio/cucumber-framework';
import LoginPage from '../pages/login-pages.ts';

Before({ tags: '@noResetSession' }, async () => {
    console.log('>>> Hook @noReset aktif: Kita tidak akan mematikan aplikasi');
});

Before({ tags: '@resetSession' }, async () => {
    const appId = 'com.jejakin.atlas.dev';
    const activityId = 'com.jejakin.atlas.screens.onboarding.LoginActivity';

    console.log(`>>> Hook @resetSession: Restarting ${appId} ke ${activityId}`);

    try {
        await driver.terminateApp(appId);
        
        await driver.pause(1000);

        await driver.execute('mobile: startActivity', {
            component: `${appId}/${activityId}`
        });

        console.log('>>> Aplikasi berhasil di-restart ke halaman Login.');
    } catch (error) {
        console.error('>>> Gagal melakukan restart aplikasi:', error);
        await driver.activateApp(appId);
    }
});

// authenticated mastiin udah login atau belom, kalo udah lgsg eksekusi script di step
Before({ tags: '@authenticated' }, async () => {
    const appId = 'com.jejakin.atlas.dev';
    
    console.log('>>> Hook @authenticated: Memeriksa sesi login...');

    let atLogin = false;
    try {
        await LoginPage.userField.waitForDisplayed({ timeout: 5000 });
        atLogin = true;
    } catch (e) {}

    if (atLogin) {
        console.log('>>> Sesi tidak ditemukan, melakukan login otomatis...');
        
        await LoginPage.enterCredentials('baskaratesting4', 'Jejakin2023!');
        await LoginPage.clickLogin();
        
        let success = false;
        try {
            await LoginPage.homeIndicator.waitForDisplayed({ timeout: 15000 });
            success = true;
        } catch (e) {}

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
});

