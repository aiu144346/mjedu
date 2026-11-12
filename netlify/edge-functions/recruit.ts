import { getStore } from "https://esm.sh/@netlify/blobs";
import type { Config, Context } from "@netlify/edge-functions";

const ADMIN_PIN = "533745";
const STORE_NAME = "mjedu-committee-recruit-v1";
const GOOGLE_SHEET_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwxXOHruuK6t9uzxoh5MyQKZ5TpkV3tJZRxLlu3pPwgS_UIDFQmYaZvp4UMtXTvtYyRBg/exec";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Pin",
};

export interface RecruitApplication {
  id: string;
  timestamp: string;
  createdAtMs: number;
  position: string;
  subcommittees: string;
  name: string;
  birth: string;
  phone: string;
  district: string;
  partyStatus: string;
  career: string;
  idea: string;
  duesConsent: string;
  privacyConsent: string;
  status?: string;
}

export default async (request: Request, _context: Context) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);

  // =========================================================================
  // 1. POST /api/recruit : 신규 위원 지원서 접수 (일반 당원 및 전문가 스마트폰 제출)
  // =========================================================================
  if (request.method === "POST") {
    try {
      const body = await request.json();

      const nowMs = Date.now();
      const kstDate = new Date(nowMs + 9 * 60 * 60 * 1000);
      const yyyy = kstDate.getUTCFullYear();
      const mm = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(kstDate.getUTCDate()).padStart(2, "0");
      const hh = String(kstDate.getUTCHours()).padStart(2, "0");
      const min = String(kstDate.getUTCMinutes()).padStart(2, "0");
      const sec = String(kstDate.getUTCSeconds()).padStart(2, "0");

      const formattedTime = body.timestamp || `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
      const randSuffix = String(Math.floor(1000 + Math.random() * 9000));
      const appId = body.id || `REC-${yyyy}${mm}${dd}-${randSuffix}`;

      const record: RecruitApplication = {
        id: appId,
        timestamp: formattedTime,
        createdAtMs: nowMs,
        position: String(body.position || "").trim(),
        subcommittees: String(body.subcommittees || "").trim(),
        name: String(body.name || "").trim(),
        birth: String(body.birth || "").trim(),
        phone: String(body.phone || "").trim(),
        district: String(body.district || "").trim(),
        partyStatus: String(body.partyStatus || "").trim(),
        career: String(body.career || "").trim(),
        idea: String(body.idea || "").trim(),
        duesConsent: String(body.duesConsent || "").trim(),
        privacyConsent: String(body.privacyConsent || "동의").trim(),
        status: "서류접수완료",
      };

      if (!record.name || !record.phone || !record.position) {
        return Response.json(
          { status: "error", message: "성명, 연락처, 지원부문은 필수 입력 항목입니다." },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      // 1-A. Netlify Blobs 중앙 클라우드 스토리지 영구 저장
      let blobSaved = false;
      try {
        const store = getStore({ name: STORE_NAME, consistency: "strong" });
        const blobKey = `entry/${nowMs}_${appId}`;
        await store.setJSON(blobKey, record);
        blobSaved = true;
      } catch (blobErr) {
        console.warn("Netlify Blobs save warning:", blobErr);
      }

      // 1-B. Google Apps Script (구글 스프레드시트) 실시간 백업 전송
      // 기존 7열 시트와 신규 12열 위원모집 시트 모두 완벽 호환되도록 매핑
      let sheetSynced = false;
      try {
        const sheetPayload = {
          ...record,
          formType: "COMMITTEE_RECRUIT",
          // 기존 google-apps-script.js 7개 열(timestamp, name, phone, email, district, course, note) 하위호환 매핑
          email: `[${record.partyStatus}] 생년월일: ${record.birth}`,
          course: `[위원모집: ${record.position}] 희망분과: ${record.subcommittees || "미지정"}`,
          note: `[주요경력] ${record.career} | [교육제안] ${record.idea || "없음"} | [직책당비] ${record.duesConsent}`,
        };

        const gasRes = await fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(sheetPayload),
        });
        sheetSynced = gasRes.ok;
      } catch (gasErr) {
        console.warn("Google Sheets forward warning:", gasErr);
      }

      return Response.json(
        {
          status: "success",
          message: "위원 지원서가 정상적으로 접수되었습니다.",
          id: appId,
          timestamp: formattedTime,
          cloudStored: blobSaved,
          sheetSynced,
        },
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (err) {
      return Response.json(
        { status: "error", message: "요청 처리 중 오류가 발생했습니다.", detail: String(err) },
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }

  // =========================================================================
  // 2. GET /api/recruit?pin=533745 : 관리자 전용 전체 신청 현황 조회 (비밀번호 검증 필수)
  // =========================================================================
  if (request.method === "GET") {
    const pin = url.searchParams.get("pin") || request.headers.get("X-Admin-Pin") || "";

    if (pin !== ADMIN_PIN) {
      return Response.json(
        {
          status: "unauthorized",
          message: "관리자 비밀번호가 일치하지 않습니다. 권한이 있는 관리자만 열람 및 엑셀 다운로드가 가능합니다.",
        },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    try {
      const store = getStore({ name: STORE_NAME, consistency: "strong" });
      const { blobs } = await store.list({ prefix: "entry/" });

      const records = await Promise.all(
        blobs.map(async (b) => {
          try {
            const item = (await store.get(b.key, { type: "json" })) as RecruitApplication | null;
            return item ? { ...item, _blobKey: b.key } : null;
          } catch {
            return null;
          }
        })
      );

      const validRecords = records
        .filter((r): r is RecruitApplication & { _blobKey: string } => r !== null)
        .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

      return Response.json(
        {
          status: "success",
          count: validRecords.length,
          applications: validRecords,
        },
        {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    } catch (err) {
      return Response.json(
        {
          status: "error",
          message: "클라우드 저장소 조회 중 오류가 발생했습니다.",
          detail: String(err),
          applications: [],
        },
        { status: 200, headers: CORS_HEADERS }
      );
    }
  }

  // =========================================================================
  // 3. DELETE /api/recruit?pin=533745&key=... : 관리자 전용 테스트/오류 데이터 삭제
  // =========================================================================
  if (request.method === "DELETE") {
    const pin = url.searchParams.get("pin") || request.headers.get("X-Admin-Pin") || "";
    const key = url.searchParams.get("key") || "";

    if (pin !== ADMIN_PIN) {
      return Response.json(
        { status: "unauthorized", message: "관리자 비밀번호가 올바르지 않습니다." },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    if (!key.startsWith("entry/")) {
      return Response.json(
        { status: "error", message: "유효하지 않은 데이터 키입니다." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    try {
      const store = getStore({ name: STORE_NAME, consistency: "strong" });
      await store.delete(key);
      return Response.json(
        { status: "success", message: "해당 신청 내역이 삭제되었습니다." },
        { status: 200, headers: CORS_HEADERS }
      );
    } catch (err) {
      return Response.json(
        { status: "error", message: String(err) },
        { status: 500, headers: CORS_HEADERS }
      );
    }
  }

  return Response.json({ status: "error", message: "Method Not Allowed" }, { status: 405, headers: CORS_HEADERS });
};

export const config: Config = {
  path: "/api/recruit",
};
