import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Ambil nama halaman dari argumen CLI
const fileName = process.argv[2];

if (!fileName) {
    console.error('❌ Harap masukkan nama halaman!');
    console.log('💡 Contoh penggunaan: npx tsx scripts/clean_elemental.ts "beranda"');
    process.exit(1);
}

const mcpDir = path.resolve('mcp');
// Pastikan folder mcp/ ada
if (!fs.existsSync(mcpDir)) {
    fs.mkdirSync(mcpDir, { recursive: true });
}

const xmlName = `view_${fileName}.xml`;
const destPath = path.join(mcpDir, xmlName);

try {
    console.log(`⏳ [1/3] Melakukan dump UI di perangkat Android...`);
    execSync('adb shell uiautomator dump /sdcard/window_dump.xml', { stdio: 'pipe' });

    console.log(`⏳ [2/3] Menarik file XML ke PC (mcp/${xmlName})...`);
    execSync(`adb pull /sdcard/window_dump.xml "${destPath}"`, { stdio: 'pipe' });

    console.log(`⏳ [3/3] Menyederhanakan elemen untuk AI...`);
    const xmlData = fs.readFileSync(destPath, 'utf-8');
    
    // Cari semua tag XML dengan Regex
    const tagRegex = /<([a-zA-Z0-9.-]+)([^>]*)>/g;
    let match;
    let resultList: string[] = [];
    
    while ((match = tagRegex.exec(xmlData)) !== null) {
        const tagName = match[1];
        const attributesRaw = match[2];
        
        // Lewati tag penutup atau tag hirarki standar tanpa atribut
        if (tagName.startsWith('/') || attributesRaw.trim() === '') continue;

        // Fungsi pembantu untuk mengambil atribut
        const getAttr = (name: string) => {
            const regex = new RegExp(`${name}="([^"]*)"`);
            const m = attributesRaw.match(regex);
            return m ? m[1] : null;
        };

        const id = getAttr('resource-id');
        const text = getAttr('text');
        const contentDesc = getAttr('content-desc');
        const clickable = getAttr('clickable');
        
        // Ambil elemen yang memiliki teks, deskripsi, id, atau bisa diklik
        const hasText = text && text.trim() !== '';
        const hasDesc = contentDesc && contentDesc.trim() !== '';
        const hasId = id && id.trim() !== '';
        
        if (hasText || hasDesc || hasId || clickable === 'true') {
            // Bersihkan nama ID dari package (misal: com.example:id/btn -> btn)
            const cleanId = id ? id.split('/').pop() : '';
            
            // Sederhanakan nama class (misal: android.widget.Button -> Button)
            const cleanClass = tagName.split('.').pop();
            
            let line = `<${cleanClass}`;
            if (cleanId) line += ` id="${cleanId}"`;
            if (hasText) line += ` text="${text}"`;
            if (hasDesc) line += ` desc="${contentDesc}"`;
            if (clickable === 'true') line += ` clickable="true"`;
            line += ` />`;
            
            resultList.push(line);
        }
    }
    
    // Hapus duplikat untuk lebih menghemat token
    const uniqueResults = [...new Set(resultList)];
    
    console.log("\n=== HASIL FILTER UNTUK AI (IRIT TOKEN) ===\n");
    console.log(uniqueResults.join('\n'));
    console.log("\n=============================================");
    console.log(`\n✅ Selesai! Silakan copy hasil di atas dan berikan ke AI.`);
    console.log(`📁 File XML aslinya tersimpan di: mcp/${xmlName}`);
    
} catch (error: any) {
    console.error('\n❌ Gagal menjalankan proses!');
    console.error('Error:', error.message);
    if (error.stderr) {
        console.error('Detail:', error.stderr.toString());
    }
    console.log('\n💡 Pastikan emulator/device sudah menyala dan terhubung (cek dengan: adb devices)');
}
