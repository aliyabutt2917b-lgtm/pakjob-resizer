require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function fetchTrendingJobsWithGemini() {
    console.log("🤖 Asking Gemini AI for active government job photo dimensions in Pakistan...");

    const today = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();

const prompt = `CRITICAL INSTRUCTION: Today's date is ${today}. The current year is strictly ${currentYear}. 

Search for CURRENTLY ACTIVE government job recruitments, admissions, or scholarship schemes in Pakistan for October ${currentYear}. 

STRICT RULES:
1. Return ONLY a valid JSON array of objects with no markdown or extra text.
2. Provide official web domains (e.g., "ppsc.gop.pk", "fpsc.gov.pk", "hec.gov.pk", "nts.org.pk") for fetching organization logos.

JSON Structure required:
[
  {
    "id": "unique_string_${currentYear}",
    "name": "Scheme/Job Name (Max KB | WidthxHeight)",
    "domain": "ppsc.gop.pk",
    "maxKB": number_in_kb,
    "w": width_in_pixels,
    "h": height_in_pixels,
    "deadline": "YYYY-MM-DD",
    "isTrending": true_or_false,
    "guideTitle": "مختصر اور واضح عنوان مع ${currentYear}",
    "guideSteps": [
      "آن لائن پورٹل پر پروفائل بنائیں اور مطلوبہ اسامی منتخب کریں۔",
      "چالان فارم / 1Bill / 1Link کے ذریعے فیس ادا کریں۔",
      "مطلوبہ سائز (KB) کے مطابق پاسپورٹ سائز تصویر اپ لوڈ کریں۔"
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