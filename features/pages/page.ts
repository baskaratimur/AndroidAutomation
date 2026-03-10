export default class Page {
  // Selector dinamis untuk TextView berdasarkan text
  getNotificationText(message: string) {
    return $(`//android.widget.TextView[@text="${message}"]`);
  }

  // Fungsi helper untuk validasi pesan
  async getMessage(message: string) {
    const element = this.getNotificationText(message);
    await element.waitForDisplayed({
      timeout: 5000,
      timeoutMsg: `Gagal: Pesan '${message}' tidak muncul setelah 5 detik`,
    });
    return await element.getText();
  }
}
