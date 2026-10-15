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
 * Normalizes string for column header comparison (lowercase, unaccented, alphanumeric only)
 */
export function normalizeHeader(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Converts string into Vietnamese Title Case (e.g. "NGUYỄN BÙI KHẢ VY" -> "Nguyễn Bùi Khả Vy")
 */
export function toVietnameseTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Robust CSV Line Splitter that respects quotation marks and escaped commas
 */
export function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map((c) => c.replace(/^["']|["']$/g, '').trim());
}

/**
 * Standardizes Class Names into "Class 1/1", "Class 1/2", "Class 2/3", "Class 2/4"
 */
function standardizeClassName(raw: string, defaultGrade: 1 | 2 = 1): string {
  if (!raw) return defaultGrade === 1 ? 'Class 1/1' : 'Class 2/3';
  const clean = raw.trim();

  // Pattern matches 1/1, 1/2, 2/3, 2/4, 1.1, 1A, etc.
  const classMatch = clean.match(/(?:lớp\s*|class\s*)?([12][\/._-][1-4]|[12][a-dA-D])/i);
  if (classMatch && classMatch[1]) {
    const formatted = classMatch[1].replace(/[._-]/, '/').toUpperCase();
    return `Class ${formatted}`;
  }

  if (clean.toLowerCase().startsWith('class')) {
    return clean;
  }
  if (clean.includes('1/') || clean.includes('2/')) {
    return `Class ${clean.replace(/.*?(1\/[1-9]|2\/[1-9]).*/, '$1')}`;
  }

  return defaultGrade === 1 ? 'Class 1/1' : 'Class 2/3';
}

/**
 * Intelligent Vietnamese School Roster CSV Parser
 * Handles:
 * 1. Title/Administrative rows at the top of the spreadsheet
 * 2. Merged or split Name columns (Họ và chữ đệm + Tên)
 * 3. Gender / Nữ columns marked with 'x' (prevents taking 'x' as Class)
 * 4. Section headers for classes (e.g. "LỚP 1/1", "LỚP 1/2", "LỚP 2/3", "LỚP 2/4")
 * 5. Continuous STT (1 to 140) across classes
 * 6. Multi-format Google Sheets / Excel exports
 */
export function parseGoogleSheetCSV(csvText: string): SheetRow[] {
  if (!csvText) return [];
  const rawLines = csvText.trim().split(/\r?\n/);
  if (rawLines.length === 0) return [];

  // Filter out completely blank lines
  const lines = rawLines.map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length === 0) return [];

  // Step 1: Detect True Header Row (scan lines 0 to 20)
  let headerRowIdx = -1;
  let sttIdx = -1;
  let lastNameIdx = -1; // Họ và chữ đệm / Họ đệm
  let firstNameIdx = -1; // Tên
  let fullNameIdx = -1; // Họ và tên gộp
  let genderIdx = -1; // Nữ / Giới tính
  let classIdx = -1; // Lớp
  let gradeIdx = -1; // Khối
  let dobIdx = -1; // Ngày sinh
  let phoneIdx = -1;
  let emailIdx = -1;
  let parentNameIdx = -1;
  let statusIdx = -1;

  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const cols = splitCsvLine(lines[i]).map(normalizeHeader);
    let matchedKeywords = 0;
    let localStt = -1;
    let localLastName = -1;
    let localFirstName = -1;
    let localFullName = -1;
    let localGender = -1;
    let localClass = -1;

    cols.forEach((col, idx) => {
      if (col === 'stt' || col === 'sothutu' || col === 'sott' || col === 'tt' || col === 'no' || col === 'order') {
        localStt = idx;
        matchedKeywords++;
      } else if (col === 'hovachudem' || col === 'hovatenlot' || col === 'hodem' || col === 'hochudem' || col === 'ho') {
        localLastName = idx;
        matchedKeywords++;
      } else if (col === 'ten' || col === 'firstname' || col === 'tenhs' || col === 'tenhocsinh') {
        localFirstName = idx;
        matchedKeywords++;
      } else if (col === 'hovaten' || col === 'hoten' || col === 'fullname' || col === 'tenvaho') {
        localFullName = idx;
        matchedKeywords++;
      } else if (col === 'nu' || col === 'gioitinh' || col === 'gender' || col === 'sex') {
        localGender = idx;
        matchedKeywords++;
      } else if (col === 'lop' || col === 'classname' || col === 'class' || col === 'tenlop' || col === 'khoilop') {
        localClass = idx;
        matchedKeywords++;
      }
    });

    // A valid header must have at least STT + Name or LastName + FirstName or Name + (Gender/Class/DOB)
    if (
      (localStt >= 0 && (localFullName >= 0 || (localLastName >= 0 && localFirstName >= 0))) ||
      (localLastName >= 0 && localFirstName >= 0) ||
      (localFullName >= 0 && (localGender >= 0 || localClass >= 0)) ||
      matchedKeywords >= 3
    ) {
      headerRowIdx = i;
      sttIdx = localStt;
      lastNameIdx = localLastName;
      firstNameIdx = localFirstName;
      fullNameIdx = localFullName;
      genderIdx = localGender;
      classIdx = localClass;
      break;
    }
  }

  // Also check if the header is split across two rows (e.g. Row 6 has "Họ và tên" and Row 7 has "Họ đệm" + "Tên")
  if (headerRowIdx >= 0 && headerRowIdx + 1 < lines.length) {
    const nextCols = splitCsvLine(lines[headerRowIdx + 1]).map(normalizeHeader);
    nextCols.forEach((col, idx) => {
      if (col === 'hovachudem' || col === 'hovatenlot' || col === 'hodem' || col === 'ho') {
        lastNameIdx = idx;
      } else if (col === 'ten' || col === 'firstname') {
        firstNameIdx = idx;
      } else if (col === 'nu' || col === 'gioitinh') {
        genderIdx = idx;
      } else if (col === 'lop' || col === 'class') {
        classIdx = idx;
      }
    });
    // If the next row specifically contained sub-headers, advance headerRowIdx by 1
    if (lastNameIdx >= 0 || firstNameIdx >= 0) {
      headerRowIdx++;
    }
  }

  // Check additional columns if headerRowIdx was found
  if (headerRowIdx >= 0) {
    const headerCols = splitCsvLine(lines[headerRowIdx]).map(normalizeHeader);
    headerCols.forEach((col, idx) => {
      if (col.includes('grade') || col.includes('khoi')) gradeIdx = idx;
      else if (col.includes('ngaysinh') || col.includes('dob') || col.includes('namsinh')) dobIdx = idx;
      else if (col.includes('phone') || col.includes('sdt') || col.includes('dienthoai')) phoneIdx = idx;
      else if (col.includes('email') || col.includes('hopthu')) emailIdx = idx;
      else if (col.includes('phuhuynh') || col.includes('parent') || col.includes('chame')) parentNameIdx = idx;
      else if (col.includes('status') || col.includes('trangthai')) statusIdx = idx;
    });
  }

  // Step 2: Heuristic Positional Fallback if header was completely obscured
  if (headerRowIdx === -1) {
    // Detect columns from sample data lines
    headerRowIdx = 0;
    sttIdx = 0;
    lastNameIdx = 1;
    firstNameIdx = 2;
    genderIdx = 3;
    dobIdx = 4;
    classIdx = 5;
  }

  const rows: SheetRow[] = [];
  let currentStickyClass = 'Class 1/1';
  let currentStickyGrade: 1 | 2 = 1;
  let autoStt = 1;

  // Step 3: Iterate through data rows
  for (let i = headerRowIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const cols = splitCsvLine(line);
    const lineLower = line.toLowerCase();

    // Check if line is a Section Header for a Class (e.g. "LỚP 1/1", "LỚP 1/2", "DANH SÁCH LỚP 2/3", "LỚP 2/4")
    const sectionMatch = line.match(/(?:danh\s*sách\s*học\s*sinh\s*)?(?:lớp|class)\s*([12][\/._-][1-4]|[12][a-dA-D])/i);
    if (sectionMatch && sectionMatch[1]) {
      const clsFormatted = sectionMatch[1].replace(/[._-]/, '/').toUpperCase();
      currentStickyClass = `Class ${clsFormatted}`;
      currentStickyGrade = clsFormatted.startsWith('2') ? 2 : 1;
      continue; // Skip section header line
    }

    // Skip repeated header rows
    if (
      lineLower.includes('họ và tên') ||
      lineLower.includes('họ và chữ đệm') ||
      lineLower.includes('tên học sinh') ||
      lineLower.includes('họ tên')
    ) {
      continue;
    }

    // Skip summary / report / signature rows
    if (
      lineLower.includes('tổng số') ||
      lineLower.includes('người lập') ||
      lineLower.includes('hiệu trưởng') ||
      lineLower.includes('giáo viên chủ nhiệm') ||
      lineLower.includes('năm học')
    ) {
      continue;
    }

    // Extract STT
    let stt = 0;
    if (sttIdx >= 0 && cols[sttIdx]) {
      const parsed = parseInt(cols[sttIdx].replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) {
        stt = parsed;
      }
    }

    // Extract Full Name
    let rawFullName = '';
    if (lastNameIdx >= 0 && firstNameIdx >= 0 && cols[lastNameIdx] && cols[firstNameIdx]) {
      // Merged Họ đệm + Tên
      rawFullName = `${cols[lastNameIdx]} ${cols[firstNameIdx]}`.trim();
    } else if (fullNameIdx >= 0 && cols[fullNameIdx]) {
      rawFullName = cols[fullNameIdx].trim();
    } else if (cols[1] && cols[2] && isNaN(Number(cols[1])) && isNaN(Number(cols[2])) && cols[2].length <= 15) {
      // Heuristic: col 1 is last name, col 2 is first name
      rawFullName = `${cols[1]} ${cols[2]}`.trim();
    } else if (cols[1] && isNaN(Number(cols[1]))) {
      rawFullName = cols[1].trim();
    } else if (cols[0] && isNaN(Number(cols[0]))) {
      rawFullName = cols[0].trim();
    }

    // Clean Full Name
    const cleanFullName = rawFullName
      .replace(/\(nữ\)|\(nam\)|\(x\)/gi, '')
      .replace(/["']/g, '')
      .trim();

    // If no valid student name found or name is a header artifact, skip this line
    if (!cleanFullName || cleanFullName.length < 2 || normalizeHeader(cleanFullName).includes('hovaten')) {
      continue;
    }

    const formattedFullName = toVietnameseTitleCase(cleanFullName);

    // If STT wasn't provided or was 0, use autoStt
    if (stt <= 0) {
      stt = autoStt;
    }
    autoStt = Math.max(autoStt + 1, stt + 1);

    // Extract Class & Grade
    let className = currentStickyClass;
    let grade: 1 | 2 = currentStickyGrade;

    // Check if there is an explicit Class column that is NOT gender ('x')
    if (classIdx >= 0 && cols[classIdx]) {
      const rawClassVal = cols[classIdx].trim();
      const rawClassLower = rawClassVal.toLowerCase();
      // Only consider if not gender marker
      if (rawClassLower !== 'x' && rawClassLower !== 'nam' && rawClassLower !== 'nữ' && rawClassLower !== 'nu') {
        const std = standardizeClassName(rawClassVal, grade);
        if (std) {
          className = std;
          grade = className.includes('2/') ? 2 : 1;
        }
      }
    } else {
      // Check any column for class pattern (e.g. '1/1', '1/2', '2/3', '2/4')
      for (let c = 0; c < cols.length; c++) {
        if (c === genderIdx) continue;
        const val = cols[c].trim();
        if (val.match(/^[12][\/._-][1-4]$/)) {
          const std = standardizeClassName(val, grade);
          className = std;
          grade = className.includes('2/') ? 2 : 1;
          break;
        }
      }
    }

    // If class was not found in columns, infer from STT ranges for standard 140-student school roster
    if (className === 'Class 1/1' && stt > 35) {
      if (stt <= 70) {
        className = 'Class 1/2';
        grade = 1;
      } else if (stt <= 105) {
        className = 'Class 2/3';
        grade = 2;
      } else {
        className = 'Class 2/4';
        grade = 2;
      }
    }

    // Determine Student ID (e.g. G1-001 ... G2-140)
    const studentId = `G${grade}-${String(stt).padStart(3, '0')}`;

    // Parent Contact Information
    const parentName =
      parentNameIdx >= 0 && cols[parentNameIdx]
        ? toVietnameseTitleCase(cols[parentNameIdx])
        : `Phụ huynh em ${formattedFullName}`;
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
      fullName: formattedFullName,
      grade,
      className,
      parentName,
      parentEmail,
      parentPhone,
      status,
    });
  }

  // Sort rows consistently by STT
  rows.sort((a, b) => a.stt - b.stt);

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
 * Generates sample CSV template matching Vietnamese 2018 General Education Curriculum (140 students)
 */
export function generateSampleGoogleSheetCSV(): string {
  const header =
    'STT,Họ và chữ đệm,Tên,Nữ,Ngày sinh,Lớp,Họ tên phụ huynh,Số điện thoại,Email\n';
  const sampleRows = [
    '1,Nguyễn Bùi Khả,Vy,x,15/05/2018,1/1,Bùi Văn Hùng,0912345678,hung.parent@example.com',
    '2,Nguyễn Bảo,An,x,20/08/2018,1/1,Nguyễn Văn An,0987654321,an.parent@example.com',
    '3,Nguyễn Ngọc Quỳnh,Anh,x,11/02/2018,1/1,Nguyễn Ngọc Long,0903123456,long.parent@example.com',
    '4,Lưu Bảo,Ngọc,x,05/09/2018,1/1,Lưu Văn Sơn,0918765432,son.parent@example.com',
    '5,Nguyễn Trần Diệp,Anh,x,18/07/2018,1/1,Trần Thị Mai,0923456789,mai.parent@example.com',
    '6,Nguyễn Mai Thiên,Kim,x,22/01/2018,1/1,Nguyễn Mai Hưng,0934567890,hung2.parent@example.com',
    '7,Đặng Nhật,Minh,,12/03/2018,1/1,Đặng Văn Nam,0945678901,nam.parent@example.com',
    '8,Lê Khánh,Ngân,x,30/11/2018,1/1,Lê Hoàng Quân,0956789012,quan.parent@example.com',
    '9,Đặng Mạnh,Dũng,,04/04/2018,1/1,Đặng Văn Dũng,0967890123,dung.parent@example.com',
    '10,Nguyễn Ngọc Thiên,Kim,x,19/06/2018,1/1,Nguyễn Thiên Bình,0978901234,binh.parent@example.com',
    '36,Đỗ Gia,Huy,,10/01/2018,1/2,Đỗ Văn Thành,0901234567,thanh.parent@example.com',
    '37,Vũ Thùy,Linh,x,15/02/2018,1/2,Vũ Đình Trọng,0912345679,trong.parent@example.com',
    '71,Phạm Hồng,Ánh,x,12/03/2017,2/3,Phạm Văn Hòa,0923456780,hoa.parent@example.com',
    '72,Hoàng Minh,Khôi,,18/04/2017,2/3,Hoàng Tuấn Kiệt,0934567891,kiet.parent@example.com',
    '106,Bùi Quốc,Bảo,,22/05/2017,2/4,Bùi Văn Thắng,0945678902,thang.parent@example.com',
    '140,Trần Nguyên,Vũ,,30/12/2017,2/4,Trần Văn Toàn,0956789013,toan.parent@example.com',
  ];
  return header + sampleRows.join('\n');
}
