const fs = require('fs');

// 1. Standard Universal Preset
const defaultPreset = {
    id: "universal_standard",
    name: "⭐ Standard Universal Size (Max 50 KB | 350x450) - عمومی سائز",
    maxKB: 50, w: 350, h: 450,
    deadline: "2099-12-31",
    isDefault: true,
    guideTitle: "🌐 عمومی / پاسپورٹ سائز اپلوڈ گائیڈ",
    guideSteps: [
        "یہ سائز تمام عام فارمز، یونیورسٹی داخلوں اور پرائیویٹ جابز کے لیے بہترین ہے۔",
        "تصویر کا پس منظر سفید یا نیلا ہونا چاہیے۔",
        "فائل فارمیٹ صرف JPG یا JPEG ہونا چاہیے۔"
    ]
};

function buildPortal() {
    console.log("🔄 Running Portal Build Routine...");

    // Read AI Dynamic Data or Fallback
    let dynamicJobs = [];
    if (fs.existsSync('dynamic-jobs.json')) {
        try {
            dynamicJobs = JSON.parse(fs.readFileSync('dynamic-jobs.json', 'utf8'));
        } catch (e) {
            console.log("Warning: Invalid dynamic-jobs.json, using local data.");
        }
    }

    const today = new Date().toISOString().split('T')[0];
    const allJobs = [defaultPreset, ...dynamicJobs].filter(item => item.deadline >= today);

    // Find Trending Item for Hot Banner
    const trendingItem = allJobs.find(item => item.isTrending) || allJobs[1] || defaultPreset;

    let dropdownHTML = ``;
    let presetsJSObj = {};
    let popupDataJSObj = {};
    let guideCardsHTML = ``;

    allJobs.forEach(item => {
        const isSelected = item.isDefault ? 'selected' : '';
        dropdownHTML += `\n            <option value="${item.id}" ${isSelected}>${item.name}</option>`;
        
        presetsJSObj[item.id] = { maxKB: item.maxKB, w: item.w, h: item.h };
        popupDataJSObj[item.id] = { title: item.guideTitle, steps: item.guideSteps, deadline: item.deadline };

        if (!item.isDefault) {
            guideCardsHTML += `
            <div class="guide-card" onclick="openGuideModal('${item.id}')">
                <div class="card-header">
                    <h4>${item.guideTitle}</h4>
                    <span class="view-btn">طریقہ دیکھئے 👁️</span>
                </div>
                <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: #64748b;">آخری تاریخ: <strong style="color:#059669;">${item.deadline}</strong></p>
            </div>`;
        }
    });

    const htmlContent = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PakJob Photo Resizer & Apply Guides</title>
    <style>
        * { box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif; }
        body { background: #f8fafc; margin: 0; padding: 12px; display: flex; flex-direction: column; align-items: center; }
        .card { background: #ffffff; max-width: 480px; width: 100%; padding: 18px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; margin-bottom: 16px; }
        
        /* Hot Banner Alert */
        .hot-banner { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 10px 14px; border-radius: 8px; margin-bottom: 14px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; animation: pulse 2s infinite; }
        .hot-banner strong { font-size: 0.85rem; }
        .hot-badge { background: #fef08a; color: #854d0e; font-size: 0.7rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }

        .title { text-align: center; color: #0f172a; margin: 0 0 4px 0; font-size: 1.3rem; }
        .subtitle { text-align: center; color: #059669; font-size: 0.85rem; font-weight: bold; margin-bottom: 16px; }
        label { display: block; margin-top: 12px; font-weight: bold; color: #334155; font-size: 0.85rem; }
        select, input[type="file"] { width: 100%; padding: 12px; margin-top: 6px; border: 2px solid #cbd5e1; border-radius: 8px; background: #f8fafc; font-size: 0.9rem; }
        .btn-upload { background: #f0f9ff; border: 2px dashed #0284c7; padding: 14px; border-radius: 8px; text-align: center; cursor: pointer; margin-top: 8px; }
        .btn-action { width: 100%; background: #059669; color: #ffffff; border: none; padding: 14px; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 16px; }
        .btn-download { width: 100%; background: #2563eb; color: #ffffff; border: none; padding: 12px; border-radius: 8px; font-size: 1rem; font-weight: bold; text-decoration: none; display: block; text-align: center; margin-top: 10px; }
        #result-box { margin-top: 16px; text-align: center; display: none; background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1px solid #bbf7d0; }
        #preview-img { max-width: 140px; border-radius: 6px; border: 1px solid #cbd5e1; margin-top: 8px; }
        
        .guide-box { border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 16px; }
        .guide-card { background: #ffffff; border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; margin-bottom: 8px; cursor: pointer; }
        .card-header { display: flex; justify-content: space-between; align-items: center; }
        .guide-card h4 { margin: 0; font-size: 0.9rem; color: #0284c7; }
        .view-btn { font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-weight: bold; }

        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; padding: 16px; z-index: 1000; }
        .modal-content { background: white; max-width: 440px; width: 100%; padding: 20px; border-radius: 12px; position: relative; }
        .close-btn { position: absolute; top: 12px; left: 16px; font-size: 1.5rem; cursor: pointer; color: #64748b; }
        .modal h3 { margin-top: 0; color: #0f172a; font-size: 1.1rem; padding-left: 20px; }
        .modal ul { padding-right: 20px; color: #334155; font-size: 0.9rem; line-height: 1.6; }
    </style>
</head>
<body>

<div class="card">
    <!-- Top Hot Alert Banner -->
    <div class="hot-banner" onclick="selectHotJob('${trendingItem.id}')">
        <div>
            <span class="hot-badge">🔥 HOT RIGHT NOW</span>
            <strong style="display:block; margin-top:2px;">${trendingItem.guideTitle}</strong>
        </div>
        <span style="font-size:0.8rem; text-decoration:underline;">کلک کریں ⚡</span>
    </div>

    <h2 class="title">⚡ PakJob Resizer & Portal</h2>
    <div class="subtitle">تمام سرکاری ملازمتوں اور سکیموں کا حل</div>

    <label>مطلوبہ سائز یا جاب منتخب کریں:</label>
    <select id="preset">
        ${dropdownHTML}
    </select>

    <label>تصویر منتخب کریں:</label>
    <div class="btn-upload" onclick="document.getElementById('fileInput').click()">
        <strong>📁 Click to Select Photo</strong>
        <span style="display:block; font-size:0.8rem; color:#0369a1; margin-top:4px;">گلیری سے تصویر منتخب کریں</span>
        <input type="file" id="fileInput" accept="image/*" style="display:none;">
    </div>
    <div id="file-name" style="font-size:0.8rem; color:#475569; margin-top:4px; text-align:center;"></div>

    <button class="btn-action" id="processBtn" disabled>تصویر کا سائز کم کریں (Resize)</button>

    <div id="result-box">
        <div id="status-text" style="color:#166534; font-weight:bold; font-size:0.85rem;"></div>
        <img id="preview-img" alt="Result">
        <a id="downloadLink" download="resized-photo.jpg" class="btn-download">📥 Download Photo (ڈاؤن لوڈ کریں)</a>
    </div>

    <div class="guide-box">
        <div style="font-size:0.95rem; color:#1e293b; font-weight:bold; margin-bottom:10px;">
            <span>📢 جدید ترین جابز اور اپلائی گائیڈز</span>
        </div>
        ${guideCardsHTML}
    </div>
</div>

<div id="guideModal" class="modal">
    <div class="modal-content">
        <span class="close-btn" onclick="closeGuideModal()">&times;</span>
        <h3 id="modalTitle"></h3>
        <p style="font-size:0.8rem; color:#059669; font-weight:bold; margin-bottom:12px;">آخری تاریخ: <span id="modalDeadline"></span></p>
        <ul id="modalSteps"></ul>
    </div>
</div>

<script>
    var fileInput = document.getElementById('fileInput');
    var processBtn = document.getElementById('processBtn');
    var fileName = document.getElementById('file-name');
    var presetSelect = document.getElementById('preset');
    var resultBox = document.getElementById('result-box');
    var previewImg = document.getElementById('preview-img');
    var statusText = document.getElementById('status-text');
    var downloadLink = document.getElementById('downloadLink');

    var selectedFile = null;
    var PRESETS = ${JSON.stringify(presetsJSObj)};
    var POPUP_DATA = ${JSON.stringify(popupDataJSObj)};

    fileInput.onchange = function(e) {
        if (e.target.files && e.target.files[0]) {
            selectedFile = e.target.files[0];
            fileName.innerText = "منتخب فائل: " + selectedFile.name;
            processBtn.disabled = false;
        }
    };

    processBtn.onclick = function() {
        if (!selectedFile) return;

        var preset = PRESETS[presetSelect.value];
        var reader = new FileReader();

        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement('canvas');
                canvas.width = preset.w;
                canvas.height = preset.h;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, preset.w, preset.h);

                var quality = 0.9;

                function attemptCompress() {
                    var dataUrl = canvas.toDataURL('image/jpeg', quality);
                    var head = 'data:image/jpeg;base64,';
                    var sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
                    var sizeInKB = sizeInBytes / 1024;

                    if (sizeInKB <= preset.maxKB || quality <= 0.1) {
                        previewImg.src = dataUrl;
                        downloadLink.href = dataUrl;
                        statusText.innerText = "✓ کامیابی سے تیار: " + sizeInKB.toFixed(1) + " KB (حد: " + preset.maxKB + " KB)";
                        resultBox.style.display = 'block';
                    } else {
                        quality -= 0.08;
                        attemptCompress();
                    }
                }

                attemptCompress();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(selectedFile);
    };

    function selectHotJob(id) {
        presetSelect.value = id;
        openGuideModal(id);
    }

    function openGuideModal(id) {
        var data = POPUP_DATA[id];
        if (!data) return;

        document.getElementById('modalTitle').innerText = data.title;
        document.getElementById('modalDeadline').innerText = data.deadline;
        
        var stepsList = document.getElementById('modalSteps');
        stepsList.innerHTML = '';
        
        data.steps.forEach(function(step) {
            var li = document.createElement('li');
            li.innerText = step;
            stepsList.appendChild(li);
        });

        document.getElementById('guideModal').style.display = 'flex';
    }

    function closeGuideModal() {
        document.getElementById('guideModal').style.display = 'none';
    }

    window.onclick = function(event) {
        var modal = document.getElementById('guideModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
</script>

</body>
</html>`;

    fs.writeFileSync('index.html', htmlContent);
    console.log("✅ Build Complete with Hot Banner Alert!");
}

buildPortal();