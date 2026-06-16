/**
 * GOOGLE APPS SCRIPT API - SISTEM TERPADU PONDOK PESANTREN
 * Deploy sebagai Web App dengan Akses "Anyone" (Siapa saja bahkan Anonim)
 */

const SPREADSHEET_ID = "MASUKKAN_ID_SPREADSHEET_ANDA_DI_SINI";

function getSheetByName(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(name);
}

// Handler Request GET
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    if (action === "getUsers") {
      return excelToJsonResponse(fetchData("USERS"));
    } else if (action === "getIzin") {
      return excelToJsonResponse(fetchData("IZIN"));
    } else if (action === "getSarpras") {
      return excelToJsonResponse(fetchData("SARPRAS"));
    } else if (action === "getPembelajaran") {
      return excelToJsonResponse(fetchData("PEMBELAJARAN"));
    }
    
    return errorJsonResponse("Aksi GET tidak valid / tidak dikenal.");
  } catch (err) {
    return errorJsonResponse(err.toString());
  }
}

// Handler Request POST
function doPost(e) {
  let postData = {};
  if (e.postData && e.postData.contents) {
    try {
      postData = JSON.parse(e.postData.contents);
    } catch(err) {
      // Abaikan jika tidak valid JSON
    }
  }
  
  const action = e.parameter.action || postData.action;
  
  try {
    if (action === "addUser") {
      return excelToJsonResponse(insertData("USERS", postData));
    } else if (action === "addIzin") {
      return excelToJsonResponse(insertData("IZIN", postData));
    } else if (action === "addSarpras") {
      return excelToJsonResponse(insertData("SARPRAS", postData));
    } else if (action === "addPembelajaran") {
      return excelToJsonResponse(insertData("PEMBELAJARAN", postData));
    } else if (action === "updateIzin") {
      return excelToJsonResponse(updateData("IZIN", postData.id, postData));
    } else if (action === "updateSarpras") {
      return excelToJsonResponse(updateData("SARPRAS", postData.id, postData));
    } else if (action === "deleteIzin") {
      const id = e.parameter.id || postData.id;
      return excelToJsonResponse(deleteRowById("IZIN", id));
    } else if (action === "deleteSarpras") {
      const id = e.parameter.id || postData.id;
      return excelToJsonResponse(deleteRowById("SARPRAS", id));
    }
    
    return errorJsonResponse("Aksi POST tidak valid / tidak dikenal.");
  } catch (err) {
    return errorJsonResponse(err.toString());
  }
}

// HELPER: Ambil semua data dari Sheet dan ubah ke array object JSON
function fetchData(sheetName) {
  const sheet = getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = {};
    const cols = data[i];
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = cols[j];
    }
    rows.push(row);
  }
  return rows;
}

// HELPER: Insert baris data baru ke Sheet
function insertData(sheetName, item) {
  const sheet = getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const newRow = [];
  for (let j = 0; j < headers.length; j++) {
    const key = headers[j];
    newRow.push(item[key] !== undefined ? item[key] : "");
  }
  
  sheet.appendRow(newRow);
  return { status: "success", message: "Data berhasil ditambahkan ke " + sheetName };
}

// HELPER: Update status / field baris by ID
function updateData(sheetName, id, updates) {
  const sheet = getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColIdx = headers.indexOf("id");
  
  if (idColIdx === -1) throw new Error("Kolom ID tidak ditemukan di sheet " + sheetName);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idColIdx].toString() === id.toString()) {
      const excelRow = i + 1;
      for (let key in updates) {
        if (key === "id") continue;
        const colIdx = headers.indexOf(key);
        if (colIdx !== -1) {
          sheet.getRange(excelRow, colIdx + 1).setValue(updates[key]);
        }
      }
      return { status: "success", message: "Data " + id + " berhasil diperbarui." };
    }
  }
  throw new Error("Data dengan ID " + id + " tidak ditemukan.");
}

// HELPER: Hapus baris data by ID
function deleteRowById(sheetName, id) {
  const sheet = getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColIdx = headers.indexOf("id");
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idColIdx].toString() === id.toString()) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Arsip ID " + id + " berhasil dihapus." };
    }
  }
  throw new Error("Arsip dengan ID " + id + " tidak terdaftar.");
}

// FORMATTER: Mengembalikan output JSON terstruktur aman CORS
function excelToJsonResponse(data) {
  let outputPayload;
  if (data && data.status) {
    outputPayload = JSON.stringify(data);
  } else {
    outputPayload = JSON.stringify({ status: "success", data: data });
  }
  
  return ContentService.createTextOutput(outputPayload)
    .setMimeType(ContentService.MimeType.JSON);
}

function errorJsonResponse(msg) {
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
