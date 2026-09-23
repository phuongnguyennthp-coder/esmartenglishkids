import { StudentRecord } from '../types/user';

export interface SheetRow {
  stt: number;
  studentId: string;
  fullName: string;
  grade: 1 | 2;
  className: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

/**
 * Converts any standard Google Sheets URL (sharing link, edit link, pub link)
 * into a live export CSV endpoint.
 */
export function convertGoogleSheetUrlToCsvUrl(inputUrl: string): string {
  if (!inputUrl) return '';
  const trimmed = inputUrl.trim();

  // Already a CSV export URL
  if (trimmed.includes('format=csv') || trimmed.includes('output=csv')) {
    return trimmed;
  }

  // Published to web format: .../pubhtml -> .../pub?output=csv
  if (trimmed.includes('/pubhtml')) {
    return trimmed.replace('/pubhtml', '/pub?output=csv');
  }

  // Standard Google Sheets link: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    // Check if there's a gid for specific sheet tab
    const gidMatch = trimmed.match(/gid=([0-9]+)/);
    const gid = gidMatch ? `&gid=${gidMatch[1]}` : '';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gid}`;
  }

  return trimmed;
}

/**
 * Normalizes string for column header comparison (lowercase, unaccented)
 */
function normalizeHeader(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Parses raw CSV content into typed Student records with flexible Vietnamese & English column mapping
 */
export function parseGoogleSheetCSV(csvText: string): SheetRow[] {
  if (!csvText) return [];
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length <= 1) return [];

  // Parse header line to dynamically locate columns
  const headerLine = lines[0];
  const headerCols = headerLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) =>
    normalizeHeader(c.replace(/^"|"$/g, ''))
  );

  let sttIdx = -1;
  let idIdx = -1;
  let nameIdx = -1;
  let gradeIdx = -1;
  let classIdx = -1;
  let parentNameIdx = -1;
  let phoneIdx = -1;
  let emailIdx = -1;
  let statusIdx = -1;

  headerCols.forEach((col, idx) => {
    if (col === 'stt' || col === 'sothutu' || col === 'no' || col === 'order' || col === 'num') {
      sttIdx = idx;
    } else if (col === 'studentid' || col === 'mahs' || col === 'mahocsinh' || col === 'id' || col === 'masohs') {
      idIdx = idx;
    } else if (col === 'fullname' || col === 'hovaten' || col === 'hoten' || col === 'tenhocsinh' || col === 'ten' || col === 'name') {
      nameIdx = idx;
    } else if (col === 'grade' || col === 'khoi' || col === 'khoilop') {
      gradeIdx = idx;
    } else if (col === 'class' || col === 'classname' || col === 'lop' || col === 'tenlop') {
      classIdx = idx;
    } else if (col.includes('parent') || col.includes('phuhuynh') || col.includes('chame')) {
      if (col.includes('phone') || col.includes('sdt') || col.includes('dienthoai')) {
        phoneIdx = idx;
      } else if (col.includes('email') || col.includes('hopthu')) {
        emailIdx = idx;
      } else {
        parentNameIdx = idx;
      }
    } else if (col === 'sdt' || col === 'sodienthoai' || col === 'dienthoai' || col === 'phone') {
      phoneIdx = idx;
    } else if (col === 'email' || col === 'hopthu') {
      emailIdx = idx;
    } else if (col === 'status' || col === 'trangthai') {
      statusIdx = idx;
    }
  });

  // Positional fallbacks if headers weren't found
  if (nameIdx === -1) nameIdx = headerCols.length > 2 ? (sttIdx === 0 ? 2 : 1) : 1;
  if (idIdx === -1) idIdx = sttIdx === 0 ? 1 : 0;
  if (gradeIdx === -1) gradeIdx = 2;
  if (classIdx === -1) classIdx = 3;

  const rows: SheetRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim());

    if (cols.length >= 2) {
      // Determine STT
      let stt = i;
      if (sttIdx >= 0 && cols[sttIdx]) {
        const parsed = parseInt(cols[sttIdx].replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) stt = parsed;
      }

      // Determine Student ID
      let studentId = idIdx >= 0 && cols[idIdx] ? cols[idIdx] : `G1-${100 + i}`;
      // Determine Name
      let fullName = nameIdx >= 0 && cols[nameIdx] ? cols[nameIdx] : `Học sinh ${i}`;

      // If id and name are swapped (e.g. column 0 is name, column 1 is id)
      if (idIdx === -1 && cols[0] && isNaN(Number(cols[0])) && cols[0].includes(' ')) {
        fullName = cols[0];
        studentId = `G1-${100 + i}`;
      }

      // Grade
      let grade: 1 | 2 = 1;
      if (gradeIdx >= 0 && cols[gradeIdx]) {
        grade = cols[gradeIdx].includes('2') ? 2 : 1;
      } else if (classIdx >= 0 && cols[classIdx] && cols[classIdx].includes('2/')) {
        grade = 2;
      }

      // Class Name
      let className = classIdx >= 0 && cols[classIdx] ? cols[classIdx] : grade === 1 ? 'Class 1/1' : 'Class 2/3';
      if (!className.toLowerCase().startsWith('class') && (className.includes('1/') || className.includes('2/'))) {
        className = `Class ${className}`;
      }

      // Parent Info
      const parentName = parentNameIdx >= 0 && cols[parentNameIdx] ? cols[parentNameIdx] : 'Phụ huynh ' + fullName;
      const parentPhone = phoneIdx >= 0 && cols[phoneIdx] ? cols[phoneIdx] : '0900000000';
      const parentEmail = emailIdx >= 0 && cols[emailIdx] ? cols[emailIdx] : 'parent@example.com';

      // Status
      let status: 'Active' | 'Inactive' | 'Pending' = 'Active';
      if (statusIdx >= 0 && cols[statusIdx]) {
        const rawStat = cols[statusIdx].toLowerCase();
        if (rawStat.includes('ngung') || rawStat.includes('inact') || rawStat.includes('nghi')) {
          status = 'Inactive';
        } else if (rawStat.includes('cho') || rawStat.includes('pend')) {
          status = 'Pending';
        }
      }

      rows.push({
        stt,
        studentId,
        fullName,
        grade,
        className,
        parentName,
        parentEmail,
        parentPhone,
        status,
      });
    }
  }

  return rows;
}

/**
 * Connects directly to Google Sheets online via backend proxy or client fetch
 */
export async function fetchGoogleSheetOnline(
  sheetUrl: string
): Promise<{ success: boolean; rows?: SheetRow[]; rawCsv?: string; error?: string }> {
  try {
    const csvUrl = convertGoogleSheetUrlToCsvUrl(sheetUrl);
    if (!csvUrl) {
      return { success: false, error: 'Đường dẫn Google Sheets không hợp lệ!' };
    }

    // Attempt 1: Call backend proxy to bypass CORS
    try {
      const serverRes = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl: csvUrl }),
      });

      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data.success && data.csvText) {
          const rows = parseGoogleSheetCSV(data.csvText);
          return { success: true, rows, rawCsv: data.csvText };
        }
      }
    } catch {
      // Backend proxy unavailable, try direct client fetch
    }

    // Attempt 2: Direct client fetch
    const response = await fetch(csvUrl, {
      method: 'GET',
      headers: { Accept: 'text/csv, text/plain, */*' },
    });

    if (!response.ok) {
      throw new Error(`Google Sheets phản hồi mã lỗi: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = parseGoogleSheetCSV(csvText);

    if (rows.length === 0) {
      return {
        success: false,
        error: 'Tải thành công nhưng không tìm thấy dữ liệu học sinh trong sheet. Vui lòng kiểm tra định dạng cột.',
        rawCsv: csvText,
      };
    }

    return { success: true, rows, rawCsv: csvText };
  } catch (err: any) {
    return {
      success: false,
      error:
        err.message ||
        'Không thể kết nối đến Google Sheets. Hãy đảm bảo bảng tính đã được cấp quyền "Bất kỳ ai có đường liên kết đều có thể xem" (Anyone with link can view).',
    };
  }
}

/**
 * Converts student records to CSV for export
 */
export function exportStudentsToCSV(students: StudentRecord[]): string {
  const header =
    'STT,Mã Học Sinh,Họ Và Tên,Khối,Lớp,Họ Tên Phụ Huynh,Số Điện Thoại,Email,Trạng Thái,Số Sao,Số Xu,Level,Bài Hoàn Thành\n';
  const rows = students.map((s) => {
    return [
      s.stt,
      s.studentId,
      `"${s.fullName}"`,
      `Khối ${s.grade}`,
      `"${s.className}"`,
      `"${s.parentName}"`,
      s.parentPhone,
      s.parentEmail,
      s.status,
      s.stars,
      s.coins,
      s.level,
      `"${s.completedUnits.join(';')}"`,
    ].join(',');
  });
  return header + rows.join('\n');
}

/**
 * Triggers a client-side download of CSV file
 */
export function downloadCSV(filename: string, content: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates sample CSV template matching Vietnamese 2018 General Education Curriculum
 */
export function generateSampleGoogleSheetCSV(): string {
  const header =
    'STT,Mã học sinh,Họ và tên,Khối,Lớp,Phụ huynh,Số điện thoại,Email,Trạng thái\n';
  const sampleRows = [
    '1,G1-001,Nguyen Minh Anh,1,Class 1/1,Nguyen Van Minh,0912345678,minh.parent@example.com,Active',
    '2,G1-002,Tran Bao Nam,1,Class 1/1,Tran Thi Lan,0987654321,nam.parent@example.com,Active',
    '3,G1-003,Dang Thao Linh,1,Class 1/2,Dang Van Hai,0903123456,linh.parent@example.com,Active',
    '4,G1-004,Pham Duc Anh,1,Class 1/2,Pham Van Kien,0918765432,ducanh.parent@example.com,Active',
    '1,G2-001,Le Gia Han,2,Class 2/3,Le Hoang Long,0978901234,giahan.parent@example.com,Active',
    '2,G2-002,Vu Hoang Nam,2,Class 2/3,Vu Dinh Trong,0934567890,trong.parent@example.com,Active',
    '3,G2-003,Ngo Phuong Mai,2,Class 2/4,Ngo Xuan Bach,0945678901,bach.parent@example.com,Active',
    '4,G2-004,Bui Quoc Bao,2,Class 2/4,Bui Van Thang,0956789012,thang.parent@example.com,Active',
  ];
  return header + sampleRows.join('\n');
}
