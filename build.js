const fs = require('fs');
const path = require('path');

// Helper for dynamic logos
function getOrgLogoUrl(domain, orgName) {
    if (domain) {
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(orgName)}&background=0D9488&color=fff&bold=true`;
}

function buildPortal() {
    console.log("🛠️ Building Modular Portal & Individual SEO Job Pages...");

    if (!fs.existsSync('dynamic-jobs.json')) {
        console.error("❌ dynamic-jobs.json not found!");
        return;
    }

    const jobs = JSON.parse(fs.readFileSync('dynamic-jobs.json', 'utf8'));
    
    // Ensure jobs directory exists
    if (!fs.existsSync('jobs')) {
        fs.mkdirSync('jobs');
    }

    // 1. Generate Individual Job Pages inside /jobs/
    jobs.forEach(job => {
        const logoUrl = getOrgLogoUrl(job.domain, job.name);
        const stepsHtml = job.guideSteps.map((step, idx) => `
            <li class="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span class="bg-emerald-600 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">${idx + 1}</span>
                <span class="text-slate-700 font-medium text-sm leading-relaxed">${step}</span>
            </li>
        `).join('');

        const jobPageContent = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${job.name} - Photo Resizer & Guide 2026</title>
    <meta name="description" content="${job.guideTitle} - Resize photo to ${job.maxKB}KB and ${job.w}x${job.h} dimensions online for free.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .urdu-text { font-family: 'Noto Nastaliq Urdu', serif; line-height: 2.2; }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col justify-between">

    <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between" dir="ltr">
            <a href="/" class="flex items-center gap-2 font-bold text-lg text-emerald-700">
                <span class="bg-emerald-600 text-white p-1.5 rounded-lg text-xs">PJR</span>
                PakJob Resizer
            </a>
            <a href="/" class="text-sm font-medium text-emerald-600 hover:underline">← Open Image Resizer Tool</a>
        </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80">
            
            <div class="flex items-center gap-4 border-b pb-6 mb-6" dir="ltr">
                <img src="${logoUrl}" class="w-14 h-14 rounded-xl border p-1 bg-white shadow-sm object-contain" alt="Logo">
                <div>
                    <h1 class="text-xl md:text-2xl font-bold text-slate-900">${job.name}</h1>
                    <div class="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span class="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-md border border-emerald-200/60">Max ${job.maxKB} KB</span>
                        <span>Dimensions: ${job.w}x${job.h} px</span>
                        <span>Deadline: ${job.deadline}</span>
                    </div>
                </div>
            </div>

            <div class="urdu-text text-right mb-8">
                <h2 class="text-xl font-bold text-slate-900 mb-4 text-emerald-800">${job.guideTitle}</h2>
                <ul class="space-y-3">
                    ${stepsHtml}
                </ul>
            </div>

            <div class="bg-slate-900 text-white p-6 rounded-xl text-center" dir="ltr">
                <h3 class="font-bold text-lg mb-2">Need to compress your photo for this portal?</h3>
                <p class="text-slate-300 text-xs mb-4">Automatically pre-set to ${job.maxKB}KB and ${job.w}x${job.h}px in one click.</p>
                <a href="/?preset=${job.id}" class="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition">
                    Resize Photo for ${job.name} Now →
                </a>
            </div>

        </div>
    </main>

    <footer class="bg-white border-t border-slate-200 py-6" dir="ltr">
        <div class="max-w-4xl mx-auto px-4 text-center text-xs text-slate-500 space-y-2">
            <p>© 2026 PakJob Utility Portal. All rights reserved.</p>
            <div class="flex justify-center gap-4 text-slate-400">
                <a href="/pages/privacy.html" class="hover:underline">Privacy Policy</a>
                <a href="/pages/terms.html" class="hover:underline">Terms</a>
                <a href="/pages/about.html" class="hover:underline">About Us</a>
                <a href="/pages/contact.html" class="hover:underline">Contact</a>
            </div>
        </div>
    </footer>

</body>
</html>`;

        fs.writeFileSync(path.join('jobs', `${job.id}.html`), jobPageContent);
    });

    console.log(`✅ Generated ${jobs.length} dedicated job pages in /jobs/`);
}

buildPortal();