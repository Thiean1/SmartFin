import React, { useState } from "react";
import { Brain } from "lucide-react";
import "./AIAdvisor.scss";

const tabs = [
  { key: "chat", label: "Chat với AI" },
  { key: "analysis", label: "Phân tích thông minh" },
  { key: "recommend", label: "Khuyến nghị" },
];

const suggestions = [
  "Tôi nên tiết kiệm bao nhiêu mỗi tháng?",
  "Làm thế nào để quản lý nợ hiệu quả?",
  "Khi nào tôi nên bắt đầu đầu tư?",
  "Cách lập ngân sách chi tiêu hợp lý?",
  "Tôi có nên mua bảo hiểm không?",
];

export default function AIAdvisor() {
  const [tab, setTab] = useState("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
    // TODO: Gọi API AI trả lời và push vào messages
  };

  const handleSuggestion = (text) => {
    setInput(text);
  };

  return (
    <div className="ai-advisor">
      <div className="ai-advisor__header">
        <Brain size={22} />
        <div>
          <div className="ai-advisor__title">AI Tư vấn Tài chính Thông minh</div>
          <div className="ai-advisor__desc">Nhận lời khuyên tài chính cá nhân hóa từ AI dựa trên dữ liệu của bạn</div>
        </div>
      </div>
      <div className="ai-advisor__tabs">
        {tabs.map(t => (
          <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>
      {tab === "chat" && (
        <div className="ai-advisor__chat-area">
          <div className="ai-advisor__suggestions">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleSuggestion(s)}>{s}</button>
            ))}
          </div>
          <div className="ai-advisor__chat-box">
            {messages.length === 0 ? (
              <div className="ai-advisor__chat-empty">
                <Brain size={38} />
                <div>Chào bạn! Tôi là AI Advisor của SmartFinance.<br/>Hãy đặt câu hỏi về tài chính để tôi có thể tư vấn cho bạn.</div>
              </div>
            ) : (
              <div className="ai-advisor__chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`ai-advisor__msg ai-advisor__msg--${msg.role}`}>{msg.text}</div>
                ))}
              </div>
            )}
          </div>
          <form className="ai-advisor__input-row" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Đặt câu hỏi về tài chính..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="ai-advisor__send-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      )}
      {tab !== "chat" && (
        <div className="ai-advisor__feature-coming">Tính năng đang phát triển...</div>
      )}
    </div>
  );
} 