const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function fetchTrendingJobsWithGemini() {
    console.log("🤖 Asking Gemini AI for active government job photo dimensions in Pakistan...");

    try {
        const prompt = `Search the internet for the most popular and currently active government job recruitments, university admissions, or scholarship schemes in Pakistan for this month. 
Return ONLY a valid JSON array of objects with no extra text or markdown codeblocks. 
Each object must follow this structure:
[
  {
    "id": "unique_string_id",
    "name": "Scheme Name (Max KB | WidthxHeight)",
    "maxKB": number_in_kb,
    "w": width_in_pixels,
    "h": height_in_pixels,
    "deadline": "YYYY-MM-DD",
    "isTrending": true_for_top_most_popular_one_else_false,
    "guideTitle": "Urdu title",
    "guideSteps": ["Urdu step 1", "Urdu step 2", "Urdu step 3"]
  }
]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let text = response.text.trim();
        // Clean markdown codeblocks if returned
        if (text.startsWith("```json")) {
            text = text.replace(/^```json/, '').replace(/```$/, '').trim();
        } else if (text.startsWith("```")) {
            text = text.replace(/^```/, '').replace(/```$/, '').trim();
        }

        const jobsData = JSON.parse(text);
        fs.writeFileSync('dynamic-jobs.json', JSON.stringify(jobsData, null, 2));
        console.log("✅ Successfully fetched and saved current jobs to dynamic-jobs.json");

    } catch (error) {
        console.error("⚠️ Gemini API fetch failed or key missing, falling back to cached/default jobs:", error.message);
        
        // Fallback data so build never breaks
        const fallbackJobs = [
            {
                id: "ppsc_educators_2026",
                name: "🔥 PPSC Recruitment (Max 20 KB | 150x200)",
                maxKB: 20, w: 150, h: 200,
                deadline: "2026-10-25",
                isTrending: true,
                guideTitle: "🔥 PPSC ائجوکیٹرز اور اسامیوں کی گائیڈ",
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