"use client";

import { useState } from "react";

const MEMBERS = [
  { id: 1, name: "김민준", role: "팀장", avatar: "KM", commits: 23, meetings: 5, totalMeetings: 5, tasks: 8, done: 6, risk: "low" },
  { id: 2, name: "박지호", role: "개발", avatar: "PJ", commits: 15, meetings: 4, totalMeetings: 5, tasks: 6, done: 4, risk: "low" },
  { id: 3, name: "이서연", role: "디자인", avatar: "LS", commits: 4, meetings: 2, totalMeetings: 5, tasks: 3, done: 1, risk: "medium" },
  { id: 4, name: "최예린", role: "기획", avatar: "CY", commits: 1, meetings: 1, totalMeetings: 5, tasks: 2, done: 0, risk: "high" },
];

const KANBAN = {
  todo: [
    { id: 1, title: "로그인 페이지 퍼블리싱", assignee: "이서연", due: "05.03", priority: "high" },
    { id: 2, title: "DB 스키마 설계", assignee: "박지호", due: "05.05", priority: "medium" },
    { id: 3, title: "요구사항 명세서 작성", assignee: "최예린", due: "05.01", priority: "high" },
  ],
  inProgress: [
    { id: 4, title: "API 엔드포인트 구현", assignee: "김민준", due: "05.04", priority: "high" },
    { id: 5, title: "와이어프레임 수정", assignee: "이서연", due: "05.02", priority: "medium" },
    { id: 6, title: "테스트 케이스 작성", assignee: "박지호", due: "05.06", priority: "low" },
  ],
  done: [
    { id: 7, title: "프로젝트 초기 세팅", assignee: "김민준", due: "04.28", priority: "low" },
    { id: 8, title: "기술 스택 확정", assignee: "김민준", due: "04.29", priority: "medium" },
  ],
};

const AI_ALERTS = [
  { member: "최예린", pattern: "무임승차 감지", desc: "커밋 1건, 할일 완료율 0%, 회의 참여 1/5", severity: "critical" },
  { member: "이서연", pattern: "기여도 저하", desc: "최근 7일 커밋 없음, 회의 2회 불참", severity: "warning" },
  { member: "요구사항 명세서", pattern: "마감 초과 임박", desc: "D-0 마감, 담당자 미착수 상태", severity: "critical" },
];

const INIT_CHAT = [
  { role: "ai", text: "안녕하세요 팀장님! TeamRadar AI입니다. 현재 팀 리스크 레벨은 🔴 HIGH (67점)입니다." },
  { role: "ai", text: "⚠️ 최예린 님의 기여도가 매우 낮습니다. 커밋 1건, 완료된 작업 0건으로 무임승차 패턴이 감지됩니다." },
  { role: "ai", text: "📋 '요구사항 명세서 작성' 태스크가 오늘 마감인데 아직 진행 전입니다. 확인이 필요합니다." },
];

const riskColor: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#ef4444",
  critical: "#ef4444",
  warning: "#f59e0b",
};

const priorityBadge: Record<string, string> = {
  high: "bg-red-900/50 text-red-400 border border-red-800",
  medium: "bg-yellow-900/50 text-yellow-400 border border-yellow-800",
  low: "bg-slate-800 text-slate-400 border border-slate-700",
};

export default function Home() {
  const [chat, setChat] = useState(INIT_CHAT);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    const aiReply = { role: "ai", text: `"${input}"에 대해 분석 중... 현재 팀 상황을 종합하면 리스크 요인이 집중되어 있습니다. 최예린 님과 1:1 면담을 권장합니다.` };
    setChat((prev) => [...prev, userMsg, aiReply]);
    setInput("");
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📡</div>
          <div>
            <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>TeamRadar</span>
            <span style={{ marginLeft: 8, fontSize: 12, color: "var(--muted)" }}>팀플 기여도 · 리스크 분석</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#3b0a0a", border: "1px solid #7f1d1d", borderRadius: 20, padding: "4px 12px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 12, color: "#fca5a5" }}>리스크 HIGH · 67점</span>
          </div>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>캡스톤 팀 A · 2025.05.01</span>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 57px)" }}>
        {/* Left: Team Members */}
        <aside style={{ width: 220, background: "var(--surface)", borderRight: "1px solid var(--border)", padding: 16, overflowY: "auto", flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 12, letterSpacing: 1 }}>TEAM MEMBERS</p>
          {MEMBERS.map((m) => (
            <div key={m.id} style={{ marginBottom: 10, padding: 12, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: m.risk === "high" ? "#7f1d1d" : m.risk === "medium" ? "#78350f" : "#14532d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: riskColor[m.risk] }}>{m.avatar}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</p>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>{m.role}</p>
                </div>
                <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: riskColor[m.risk] }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, textAlign: "center" }}>
                {[["커밋", m.commits], ["회의", `${m.meetings}/${m.totalMeetings}`], ["완료", `${m.done}/${m.tasks}`]].map(([label, val]) => (
                  <div key={label as string} style={{ background: "var(--surface)", borderRadius: 6, padding: "4px 0" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{val}</p>
                    <p style={{ fontSize: 10, color: "var(--muted)" }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Center: Kanban */}
        <main style={{ flex: 1, padding: 20, overflowY: "auto" }}>
          <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 16, letterSpacing: 1 }}>KANBAN BOARD</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, height: "100%" }}>
            {[
              { key: "todo", label: "할 일", color: "#3b82f6", cards: KANBAN.todo },
              { key: "inProgress", label: "진행 중", color: "#f59e0b", cards: KANBAN.inProgress },
              { key: "done", label: "완료", color: "#22c55e", cards: KANBAN.done },
            ].map((col) => (
              <div key={col.key} style={{ background: "var(--surface)", borderRadius: 12, padding: 14, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: col.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{col.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", background: "var(--bg)", borderRadius: 12, padding: "2px 8px" }}>{col.cards.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.cards.map((card) => (
                    <div key={card.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 12, cursor: "grab" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{card.title}</p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>👤 {card.assignee}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: card.due === "05.01" ? "#ef4444" : "var(--muted)" }}>📅 {card.due}</span>
                          <span className={priorityBadge[card.priority]} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4 }}>{card.priority}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: "1px dashed var(--border)", background: "transparent", color: "var(--muted)", fontSize: 13, cursor: "pointer" }}>+ 추가</button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Right: AI Risk + Chatbot */}
        <aside style={{ width: 300, background: "var(--surface)", borderLeft: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* AI Risk */}
          <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 12, letterSpacing: 1 }}>AI 리스크 분석</p>
            <div style={{ background: "linear-gradient(135deg, #3b0764, #1e0a3c)", border: "1px solid #5b21b6", borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#c4b5fd" }}>팀 위험도</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>67</span>
              </div>
              <div style={{ height: 6, background: "#1e1b4b", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: "67%", height: "100%", background: "linear-gradient(90deg, #7c3aed, #ef4444)", borderRadius: 3 }} />
              </div>
              <p style={{ fontSize: 11, color: "#a78bfa", marginTop: 6 }}>빌런 패턴 2건 · 마감 초과 1건 감지</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {AI_ALERTS.map((alert, i) => (
                <div key={i} style={{ padding: 10, borderRadius: 8, background: "var(--bg)", border: `1px solid ${alert.severity === "critical" ? "#7f1d1d" : "#78350f"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: alert.severity === "critical" ? "#fca5a5" : "#fde68a" }}>
                      {alert.severity === "critical" ? "🚨" : "⚠️"} {alert.member}
                    </span>
                    <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: alert.severity === "critical" ? "#7f1d1d" : "#78350f", color: riskColor[alert.severity] }}>
                      {alert.pattern}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>{alert.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chatbot */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>AI 어시스턴트</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {chat.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "85%", padding: "8px 12px", borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    background: msg.role === "user" ? "var(--purple)" : "var(--bg)",
                    border: msg.role === "user" ? "none" : "1px solid var(--border)",
                    fontSize: 12, lineHeight: 1.5, color: "var(--text)"
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="팀 상황 물어보기..."
                style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "var(--text)", outline: "none" }}
              />
              <button onClick={sendMessage} style={{ padding: "8px 12px", borderRadius: 8, background: "var(--purple)", border: "none", color: "white", fontSize: 12, cursor: "pointer" }}>
                전송
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
