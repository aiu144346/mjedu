import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  // CORS Preflight 대응
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const url = new URL(request.url);

  // JSON API 응답 데이터 구성
  const responseData = {
    status: "success",
    code: 200,
    service: "더불어민주당 울산시당 교육연수원 (MJEdu)",
    endpoint: url.pathname,
    timestamp: new Date().toISOString(),
    client: {
      ip: context.ip ?? "Unknown",
      city: context.geo?.city ?? "Unknown",
      country: context.geo?.country?.name ?? "Unknown",
      timezone: context.geo?.timezone ?? "Unknown",
    },
    data: {
      institute: "더불어민주당 울산광역시당 교육연수원",
      dean: "정우진",
      platform: "MJEdu Digital Training Platform",
      visitorMetrics: {
        activeMonitoring: true,
        launchDate: "2026-10-21"
      },
      features: [
        "10대 핵심 교육주제 아카이브",
        "AI 혁신 당원 교육과정",
        "온라인 당원 교육 사전신청",
        "모바일 최적화 하이브리드 UI/UX"
      ]
    }
  };

  return Response.json(responseData, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};

// 엔드포인트 라우트 설정 (/api/info)
export const config: Config = {
  path: "/api/info",
};
