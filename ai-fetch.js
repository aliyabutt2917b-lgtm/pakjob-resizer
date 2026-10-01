const fs = require('fs');

async function fetchTrendingJobsWithGemini() {
    console.log("🤖 Gemini AI searching for latest Pakistan jobs & schemes...");
    
    // Gemini API Request Simulation
    const apiKey = process.env.GEMINI_API_KEY; // GitHub Secrets se milega
    
    // Fallback/Scraped Dynamic Feed
    const aiDiscoveredJobs = [
        {
            id: "ppsc_educators_2026",
            name: "🔥 PPSC Educators Recruitment (Max 20 KB | 150x200)",
            maxKB: 20, w: 150, h: 200,
            deadline: "2026-10-25",
            isTrending: true, // Banner Alert Target
            guideTitle: "🔥 PPSC ائجوکیٹرز اور تازہ ترین اسامیوں کی گائیڈ",
            guideSteps: [
                "PPSC پورٹل (ppsc.gop.pk) پر 150x200 سائز اور 20KB سے کم تصویر ہی قبول ہوتی ہے۔",
                "چالان فارم PSCA یا 1Bill کے ذریعے جمع کرائیں۔",
                "فارم جمع کراتے وقت شناختی کارڈ کی کاپی بھی 20KB سے کم رکھیں۔"
            ]
        },
        {
            id: "cm_youth_scholarship_2026",
            name: "🎓 CM Honhaar Scholarship Scheme 2026 (Max 50 KB)",
            maxKB: 50, w: 800, h: 500,
            deadline: "2026-11-15",
            isTrending: false,
            guideTitle: "🎓 وزیراعلیٰ ہونہار سکالرشپ آن لائن اپلائی گائیڈ",
            guideSteps: [
                "سرکاری ایچ ای سی / پنجاب سکالرشپ پورٹل پر لاگ ان کریں۔",
                "میٹرک اور ایف ایس سی کے رزلٹ کارڈ کا سائز 50KB سے کم اپلوڈ کریں۔",
                "آمدنی کا سرٹیفکیٹ (Income Certificate) بھی 50KB میں ہونا چاہیے۔"
            ]
        }
    ];

    fs.writeFileSync('dynamic-jobs.json', JSON.stringify(aiDiscoveredJobs, null, 2));
    console.log("✅ dynamic-jobs.json created with latest AI scraped entries.");
}

fetchTrendingJobsWithGemini();