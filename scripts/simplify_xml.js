import fs from 'fs';
import path from 'path';

// Ambil argumen file dari command line (misal: node simplify.js mcp/view_form.xml)
const filePath = process.argv[2];

if (!filePath) {
    console.log('Gunakan perintah: node scripts/simplify_xml.js <path_ke_file_xml>');
    process.exit(1);
}

const absolutePath = path.resolve(filePath);

try {
    const xmlData = fs.readFileSync(absolutePath, 'utf-8');
    
    // Cari semua tag XML dengan Regex
    const tagRegex = /<([a-zA-Z0-9.-]+)([^>]*)>/g;
    let match;
    let resultList = [];
    
    while ((match = tagRegex.exec(xmlData)) !== null) {
        const tagName = match[1];
        const attributesRaw = match[2];
        
        // Lewati tag penutup atau tag hirarki standar tanpa atribut
        if (tagName.startsWith('/') || attributesRaw.trim() === '') continue;

        // Ambil atribut penting
        const getAttr = (name) => {
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
    
    console.log("=== HASIL FILTER UNTUK AI (IRIT TOKEN) ===\n");
    console.log(uniqueResults.join('\n'));
    console.log("\n=============================================");
    console.log(`\nSilakan copy hasil di atas dan berikan ke AI!`);
    console.log(`Jumlah tag asli: Ribuan, setelah difilter: ${uniqueResults.length} tag penting saja.`);
    
} catch (error) {
    console.error('Gagal membaca file:', error.message);
}
