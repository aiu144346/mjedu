/**
 * ============================================================================
 * 더불어민주당 울산광역시당 교육연수위원회 - 통합 수신 및 관리자 엑셀 연동 스크립트 (V2.0)
 * ============================================================================
 * [지원 기능]
 * 1. 교육연수위원회 임원·위원 공개모집(부위원장/자문교수단/분과위원장/일반위원) 12개 열 자동 기록
 *    - 시트 탭 이름: "교육연수위원_모집명단" (없으면 자동 생성 및 헤더 자동 세팅)
 * 2. AI 아카데미 강좌 사전신청 7개 열 자동 기록 (기존 시트1 호환 유지)
 * 3. 관리자 전용 비밀번호(533745) 인증 기반 JSON 데이터 조회 API 제공
 * ============================================================================
 */

var ADMIN_PIN = "533745";
var RECRUIT_SHEET_NAME = "교육연수위원_모집명단";

function ensureRecruitSheet(ss) {
  var sheet = ss.getSheetByName(RECRUIT_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(RECRUIT_SHEET_NAME);
    var headers = [
      "접수번호",
      "접수일시",
      "지원부문",
      "희망분과",
      "성명",
      "생년월일",
      "연락처",
      "거주지역(연고)",
      "당원구분",
      "주요경력 및 전문분야",
      "제안 교육 아이디어",
      "직책당비/개인정보동의"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#004EA2")
      .setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm:ss");

    // 1) 교육연수위원회 위원 공개모집 데이터인 경우
    if (data.formType === "COMMITTEE_RECRUIT" || data.position) {
      var recruitSheet = ensureRecruitSheet(ss);
      var appId = data.id || ("REC-" + Utilities.formatDate(new Date(), "Asia/Seoul", "yyyyMMdd-HHmmss"));
      var consentSummary = "직책당비: " + (data.duesConsent || "확인") + " / 개인정보: " + (data.privacyConsent || "동의");

      recruitSheet.appendRow([
        appId,
        timestamp,
        data.position || "",
        data.subcommittees || "",
        data.name || "",
        data.birth || "",
        data.phone || "",
        data.district || "",
        data.partyStatus || "",
        data.career || "",
        data.idea || "",
        consentSummary
      ]);
    }

    // 2) 기본 활성 시트(기존 7열 시트)에도 통합 백업 기록
    var defaultSheet = ss.getSheets()[0];
    var name = data.name || "";
    var phone = data.phone || "";
    var email = data.email || "";
    var district = data.district || "";
    var course = data.course || "";
    var note = data.note || "";

    defaultSheet.appendRow([timestamp, name, phone, email, district, course, note]);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "성공적으로 접수되었습니다.",
      timestamp: timestamp
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};

  // 관리자 비밀번호(533745) 인증 조회 요청 처리
  if (params.action === "list") {
    if (params.pin !== ADMIN_PIN) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "unauthorized",
        message: "관리자 비밀번호가 일치하지 않습니다."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(RECRUIT_SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        count: 0,
        applications: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var rows = sheet.getDataRange().getValues();
    var list = [];
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      list.push({
        id: r[0],
        timestamp: r[1],
        position: r[2],
        subcommittees: r[3],
        name: r[4],
        birth: r[5],
        phone: r[6],
        district: r[7],
        partyStatus: r[8],
        career: r[9],
        idea: r[10],
        duesConsent: r[11]
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: list.length,
      applications: list.reverse()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(
    "더불어민주당 울산시당 교육연수위원회 통합 접수 및 관리자 API가 정상 작동 중입니다."
  );
}
