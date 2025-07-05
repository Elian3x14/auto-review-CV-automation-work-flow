function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Câu trả lời biểu mẫu 1");
  const lastRow = sheet.getLastRow();
  const row = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

  const fullName = row[1];
  const email = row[2];
  const fileUrl = row[3];

  const fileId = getFileIdFromUrl(fileUrl);
  const text = extractTextWithOCRSpace(fileId); 

  const prompt = `Đây là nội dung CV của một ứng viên:\n\n${text}\n\nBạn hãy phân tích xem ứng viên này có phù hợp với công việc sau không:\n
Vị trí: Thực tập sinh IT – AI Automation\n
Mô tả công việc: Sử dụng Zapier, Make, Google Apps Script, Python, API, xử lý dữ liệu, làm việc nhóm và tinh thần học hỏi.\n
Đưa ra đánh giá tổng quát và mức độ phù hợp (thấp, trung bình, cao).`;

  const result = callDeepSeek(prompt);

  const resultSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Đánh giá") || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Đánh giá");
  resultSheet.appendRow([fullName, email, result]);
}

function getFileIdFromUrl(url) {
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : null;
}

function extractTextWithOCRSpace(fileId) {
  const file = DriveApp.getFileById(fileId);
  const blob = file.getBlob();

  const formData = {
    file: blob,
    language: "eng",
    isOverlayRequired: false,
    apikey: CONFIG.OCR_API_KEY
  };

  const options = {
    method: "post",
    payload: formData
  };

  const response = UrlFetchApp.fetch("https://api.ocr.space/parse/image", options);
  const result = JSON.parse(response.getContentText());

  if (result.IsErroredOnProcessing || !result.ParsedResults) {
    return "(Không thể trích xuất văn bản từ PDF)";
  }

  return result.ParsedResults[0].ParsedText;
}

function callDeepSeek(prompt) {
  const url = "https://openrouter.ai/api/v1/chat/completions";
  const payload = {
    model: "deepseek/deepseek-r1:free",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": `Bearer ${CONFIG.DEEPSEEK_API_KEY}`,
      "HTTP-Referer": "https://script.google.com"
    },
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());
  return json.choices[0].message.content;
}
