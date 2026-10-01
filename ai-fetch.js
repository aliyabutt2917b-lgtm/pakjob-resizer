require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function fetchTrendingJobsWithGemini() {
    console.log("🤖 Asking Gemini AI for active government job photo dimensions in Pakistan...");

    const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();

   const prompt = `CRITICAL INSTRUCTION: Today's date is ${today}. The current year is strictly ${currentYear}. 

Search for CURRENTLY ACTIVE government job recruitments, admissions, or scholarship schemes in Pakistan for October ${currentYear} or upcoming deadlines in late ${currentYear}. 

STRICT RULES:
1. Do NOT return any deadlines or IDs from 2024 or 2025. All deadlines MUST be future dates relative to ${today} in ${currentYear}.
2. Ensure realistic photo compression limits (e.g. 20KB to 100KB) and dimensions (e.g. 150x200, 300x300, 500x500) matching Pakistani portals (PPSC, FPSC, NTS, HEC, ETEA).
3. GUIDE STEPS REQUIREMENT: Provide 3 to 4 short, clear, yet highly informative Urdu steps. Each step must be concise, professional, and explain the exact action (e.g., specific portal link/fee channel, document resizing, and final submission). Avoid extremely brief 2-3 word sentences.

Return ONLY a valid JSON array of objects with no markdown or extra text:
[
  {
    "id": "unique_string_${currentYear}",
    "name": "Scheme/Job Name (Max KB | WidthxHeight)",
    "maxKB": number_in_kb,
    "w": width_in_pixels,
    "h": height_in_pixels,
    "deadline": "YYYY-MM-DD",
    "isTrending": true_or_false,
    "guideTitle": "مختصر اور واضح عنوان مع ${currentYear}",
    "guideSteps": [
      "آن لائن پورٹل پر پروفائل بنائیں اور مطلوبہ اسامی منتخب کریں۔",
      "چالان فارم / 1Bill / 1Link کے ذریعے متعلقہ بینک یا ایزی پیسہ سے فیس ادا کریں۔",
      "مطلوبہ سائز (KB) اور ڈائمینشنز کے مطابق پاسپورٹ سائز تصویر اور CNIC اپ لوڈ کریں۔",
      "معلومات کی تصدیق کے بعد فارم فائنل سبمٹ کر کے پرنٹ اور نمبر محفوظ رکھیں۔"
    ]
  }
]`;

    // Priority list of Gemini models
const modelsToTry = [
    'gemini-3.8-flash',         // Primary: fast & latest
    'gemini-3.5-flash-lite',    // Light & fast fallback
    'gemini-2.5-pro'            // High accuracy fallback
];
    
    let responseText = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`📡 Trying model: ${modelName}...`);
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            responseText = response.text.trim();
            if (responseText) {
                console.log(`✅ Success response from: ${modelName}`);
                break;
            }
        } catch (err) {
            console.warn(`⚠️ Model ${modelName} failed: ${err.message}`);
        }
    }

    try {
        if (!responseText) throw new Error("All models failed or returned empty response.");

        // Clean markdown codeblocks
        let cleanJson = responseText.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();

        const jobsData = JSON.parse(cleanJson);
        fs.writeFileSync('dynamic-jobs.json', JSON.stringify(jobsData, null, 2));
        console.log("🎉 Successfully fetched and saved current jobs to dynamic-jobs.json!");

    } catch (error) {
        console.error("⚠️ Gemini API fallback activated:", error.message);
        
        const fallbackJobs = [
            {
                id: `ppsc_educators_${currentYear}`,
                name: `🔥 PPSC Recruitment ${currentYear} (Max 20 KB | 150x200)`,
                maxKB: 20, w: 150, h: 200,
                deadline: `${currentYear}-10-25`,
                isTrending: true,
                guideTitle: `🔥 PPSC ائجوکیٹرز اور اسامیوں کی گائیڈ ${currentYear}`,
                guideSteps: [
                    "PPSC پورٹل پر 150x200 سائز اور 20KB سے کم تصویر ہی قبول ہوتی ہے۔",
                    "چالان فارم PSCA یا 1Bill کے ذریعے جمع کرائیں۔",
                    "شناختی کارڈ کی کاپی بھی 20KB سے کم رکھیں۔"
                ]
            }
        ];
        fs.writeFileSync('dynamic-jobs.json', JSON.stringify(fallbackJobs, null, 2));
    }
}

fetchTrendingJobsWithGemini();