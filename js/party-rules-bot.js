/**
 * 민주당헌 365 - 더불어민주당 강령·당헌·당규 자동응답 AI 엔진 (v2.0 고도화)
 * 기획·제작: 정우진
 * 버전: 2026.08.11 최신 개정판
 */

(function () {
  'use strict';

  class PartyRulesBotApp {
    constructor() {
      this.data = (typeof window !== 'undefined' && window.PARTY_RULES_DATA)
        || (typeof globalThis !== 'undefined' && globalThis.PARTY_RULES_DATA)
        || (typeof PARTY_RULES_DATA !== 'undefined' ? PARTY_RULES_DATA : { scenarios: [], articles: [] });

      this.isProcessing = false;
      this.activeTab = 'activeCite'; // 'activeCite' | 'fullLawbook'
      this.lastCitations = [];

      this.initDom();
      this.bindEvents();
      this.renderQuickChips();
      this.populateActiveCitationWelcome();
    }

    initDom() {
      // Containers
      this.dualContainer = document.getElementById('dualContainer');
      this.chatStream = document.getElementById('chatStream');
      this.quickChipsTrack = document.getElementById('quickChipsTrack');

      // Input elements
      this.chatForm = document.getElementById('chatForm');
      this.chatInput = document.getElementById('chatInput');
      this.btnSend = document.getElementById('btnSend');
      this.btnVoiceInput = document.getElementById('btnVoiceInput');
      this.btnResetChat = document.getElementById('btnResetChat');
      this.btnFontScale = document.getElementById('btnFontScale');

      // Viewer elements
      this.viewerPanel = document.getElementById('viewerPanel');
      this.btnCloseViewer = document.getElementById('btnCloseViewer');
      this.btnToggleViewerHeader = document.getElementById('btnToggleViewerHeader');
      this.bottomSheetBackdrop = document.getElementById('bottomSheetBackdrop');
      this.bottomSheetHandle = document.getElementById('bottomSheetHandle');
      this.chatInputWrap = document.querySelector('.chat-input-wrap');
      this.tabActiveCite = document.getElementById('tabActiveCite');
      this.tabFullLawbook = document.getElementById('tabFullLawbook');
      this.viewerSearchBar = document.getElementById('viewerSearchBar');
      this.viewerSearchInput = document.getElementById('viewerSearchInput');
      this.viewerArticlesList = document.getElementById('viewerArticlesList');
    }

    bindEvents() {
      // Font scale mode toggle
      if (this.btnFontScale) {
        this.btnFontScale.addEventListener('click', () => {
          document.body.classList.toggle('large-text');
          const isLarge = document.body.classList.contains('large-text');
          this.btnFontScale.textContent = isLarge ? '가- 보통글씨' : '가+ 큰글씨 모드';
        });
      }

      // Viewer open/close toggle
      if (this.btnCloseViewer) {
        this.btnCloseViewer.addEventListener('click', () => {
          this.closeViewer();
        });
      }
      if (this.btnToggleViewerHeader) {
        this.btnToggleViewerHeader.addEventListener('click', () => {
          this.toggleViewer();
        });
      }

      // Viewer Tabs (현재 근거 조항 vs 전체 법전)
      if (this.tabActiveCite && this.tabFullLawbook) {
        this.tabActiveCite.addEventListener('click', () => {
          this.activeTab = 'activeCite';
          this.tabActiveCite.classList.add('active');
          this.tabFullLawbook.classList.remove('active');
          this.viewerSearchBar.style.display = 'none';
          this.renderActiveCitations(this.lastCitations);
        });

        this.tabFullLawbook.addEventListener('click', () => {
          this.activeTab = 'fullLawbook';
          this.tabFullLawbook.classList.add('active');
          this.tabActiveCite.classList.remove('active');
          this.viewerSearchBar.style.display = 'block';
          this.populateFullLawbook();
        });
      }

      // Chat submit
      if (this.chatForm) {
        this.chatForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSendMessage();
        });
      }

      // Reset chat
      if (this.btnResetChat) {
        this.btnResetChat.addEventListener('click', () => {
          if (confirm('채팅 내용을 초기화하고 처음으로 돌아가시겠습니까?')) {
            location.reload();
          }
        });
      }

      // Voice recognition (Web Speech API)
      if (this.btnVoiceInput) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.lang = 'ko-KR';
          recognition.continuous = false;

          this.btnVoiceInput.addEventListener('click', () => {
            this.btnVoiceInput.classList.add('active');
            recognition.start();
          });

          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.chatInput.value = transcript;
            this.btnVoiceInput.classList.remove('active');
            this.handleSendMessage();
          };

          recognition.onerror = () => {
            this.btnVoiceInput.classList.remove('active');
          };
          recognition.onend = () => {
            this.btnVoiceInput.classList.remove('active');
          };
        } else {
          this.btnVoiceInput.style.display = 'none';
        }
      }

      // Viewer Search
      if (this.viewerSearchInput) {
        this.viewerSearchInput.addEventListener('input', (e) => {
          const term = e.target.value.trim().toLowerCase();
          this.filterViewerArticles(term);
        });
      }

      // Global click delegate for citation chips & actions
      document.addEventListener('click', (e) => {
        // DeepSeek Hero Quick Chip click
        const heroChip = e.target.closest('.deepseek-chip');
        if (heroChip) {
          const q = heroChip.getAttribute('data-query');
          if (q) {
            this.chatInput.value = q;
            this.handleSendMessage();
          }
          return;
        }

        // Citation chip click [당헌 제5조 ↗]
        const chip = e.target.closest('.citation-chip');
        if (chip) {
          const citeId = chip.getAttribute('data-cite');
          const artKeyword = chip.textContent.replace(/[\[\]📘📗⚖️📜🏛️↗]/g, '').trim();
          this.openViewerAndLocate(citeId, artKeyword);
          return;
        }

        // Grounding toggle header
        const groundHeader = e.target.closest('.grounding-header');
        if (groundHeader) {
          const box = groundHeader.closest('.grounding-box');
          if (box) box.classList.toggle('open');
          return;
        }

        // Bubble Action: Copy
        const copyBtn = e.target.closest('.btn-copy-bubble');
        if (copyBtn) {
          const bubble = copyBtn.closest('.chat-bubble');
          if (bubble) {
            const clone = bubble.cloneNode(true);
            const actions = clone.querySelector('.bubble-actions');
            if (actions) actions.remove();
            const textToCopy = clone.innerText.trim();
            if (navigator.vibrate) navigator.vibrate(30);
            navigator.clipboard.writeText(textToCopy).then(() => {
              const orig = copyBtn.innerHTML;
              copyBtn.innerHTML = '✅ 복사 완료!';
              setTimeout(() => { copyBtn.innerHTML = orig; }, 2000);
            });
          }
          return;
        }

        // Bubble Action: TTS Speak
        const speakBtn = e.target.closest('.btn-speak-bubble');
        if (speakBtn) {
          const bubble = speakBtn.closest('.chat-bubble');
          if (bubble) {
            const textToSpeak = bubble.innerText.replace(/\[.*?\]/g, '').replace(/https?:\/\/\S+/g, '');
            this.speakText(textToSpeak, speakBtn);
          }
          return;
        }

        // Follow up question button
        const followUpBtn = e.target.closest('.btn-follow-up');
        if (followUpBtn) {
          const qText = followUpBtn.textContent.replace('👉 ', '').trim();
          this.chatInput.value = qText;
          this.handleSendMessage();
          return;
        }
      });

      // Backdrop click to close bottom sheet
      if (this.bottomSheetBackdrop) {
        this.bottomSheetBackdrop.addEventListener('click', () => {
          this.closeViewer();
        });
      }

      // Gesture Swipe Down to close bottom sheet
      if (this.bottomSheetHandle) {
        let touchStartY = 0;
        this.bottomSheetHandle.addEventListener('touchstart', (e) => {
          touchStartY = e.touches[0].clientY;
        }, { passive: true });

        this.bottomSheetHandle.addEventListener('touchmove', (e) => {
          const currentY = e.touches[0].clientY;
          if (currentY - touchStartY > 60) {
            this.closeViewer();
          }
        }, { passive: true });
      }

      // Mobile Visual Viewport: Virtual Keyboard Adaptation
      if (window.visualViewport && this.chatInputWrap) {
        const onViewportChange = () => {
          const offset = window.innerHeight - window.visualViewport.height;
          if (offset > 50) {
            this.chatInputWrap.style.transform = `translateY(-${offset}px)`;
          } else {
            this.chatInputWrap.style.transform = 'translateY(0)';
          }
          this.scrollToBottom();
        };

        window.visualViewport.addEventListener('resize', onViewportChange);
        window.visualViewport.addEventListener('scroll', onViewportChange);
      }
    }


    resetChat() {
      if (confirm('채팅 내용을 초기화하고 처음으로 돌아가시겠습니까?')) {
        location.reload();
      }
    }
    renderQuickChips() {
      if (!this.quickChipsTrack || !this.data.scenarios) return;

      this.quickChipsTrack.innerHTML = this.data.scenarios
        .map(
          (sc) => `
        <button type="button" class="quick-chip-btn" data-scenario-id="${sc.id}">
          <span class="tag-icon">${sc.tag.split(' ')[0]}</span>
          <span>${sc.title}</span>
        </button>
      `
        )
        .join('');

      this.quickChipsTrack.querySelectorAll('.quick-chip-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const scId = btn.getAttribute('data-scenario-id');
          const sc = this.data.scenarios.find((s) => s.id === scId);
          if (sc) {
            this.submitUserQuestion(sc.question, sc);
          }
        });
      });
    }

    populateActiveCitationWelcome() {
      if (!this.viewerArticlesList) return;
      this.viewerArticlesList.innerHTML = `
        <div style="text-align: center; padding: 30px 16px; color: #64748B;">
          <div style="font-size: 2.2rem; margin-bottom: 10px;">🏛️</div>
          <strong style="color: #004EA2; font-size: 0.95rem; display: block; margin-bottom: 6px;">
            실시간 원문 대조 준비 완료
          </strong>
          <p style="font-size: 0.84rem; line-height: 1.6;">
            질문하시거나 추천 질문을 클릭하시면,<br />
            답변의 근거가 되는 <strong>실제 당헌·당규 조문</strong>이 이곳에 자동으로 정렬됩니다.
          </p>
        </div>
      `;
    }

    renderActiveCitations(citations) {
      if (!this.viewerArticlesList) return;
      if (!citations || citations.length === 0) {
        this.populateActiveCitationWelcome();
        return;
      }

      this.viewerArticlesList.innerHTML = citations
        .map((c) => {
          let quoteHtml = this.escapeHtml(c.quote);
          (c.highlights || []).forEach((hl) => {
            const re = new RegExp(hl, 'g');
            quoteHtml = quoteHtml.replace(re, `<span class="highlight-text">${hl}</span>`);
          });

          return `
          <div class="viewer-article-card active-target">
            <span class="card-category-badge ${c.lawHierarchy}">${c.lawHierarchy}</span>
            <h4 class="card-article-title">${c.articleTitle}</h4>
            <div style="font-size: 0.76rem; font-weight: 800; color: #004EA2; margin-bottom: 6px;">
              [인용 조항: ${c.clause}]
            </div>
            <div class="card-article-text">${quoteHtml}</div>
            <div style="margin-top: 10px; text-align: right;">
              <button type="button" class="bubble-btn" onclick="navigator.clipboard.writeText('${this.escapeHtml(c.quote)}').then(()=>alert('조항 전문이 복사되었습니다.'))">
                📋 조항 복사
              </button>
            </div>
          </div>
        `;
        })
        .join('');
    }

    populateFullLawbook() {
      if (!this.viewerArticlesList || !this.data.articles) return;
      const sample = this.data.articles.slice(0, 60);
      this.renderViewerList(sample);
    }

    renderViewerList(articles) {
      this.viewerArticlesList.innerHTML = articles
        .map(
          (art) => `
        <div class="viewer-article-card" id="artCard_${art.id}">
          <span class="card-category-badge ${art.category}">${art.category}</span>
          <h4 class="card-article-title">${art.title}</h4>
          <div class="card-article-text">${this.escapeHtml(art.content)}</div>
        </div>
      `
        )
        .join('');
    }

    filterViewerArticles(term) {
      if (!term) {
        this.populateFullLawbook();
        return;
      }
      const matched = this.data.articles.filter((art) => {
        return (
          art.title.toLowerCase().includes(term) ||
          art.content.toLowerCase().includes(term) ||
          art.category.toLowerCase().includes(term)
        );
      }).slice(0, 40);

      this.renderViewerList(matched);
    }

    handleSendMessage() {
      const q = this.chatInput.value.trim();
      if (!q || this.isProcessing) return;

      this.chatInput.value = '';
      this.submitUserQuestion(q);
    }

    submitUserQuestion(questionText, matchedScenario = null) {
      this.isProcessing = true;

      // 1. User message
      if (navigator.vibrate) navigator.vibrate(35);
      this.appendUserMessage(questionText);

      // 2. Typing indicator
      const typingIndicator = this.appendTypingIndicator();

      // 3. Process answer
      setTimeout(() => {
        if (typingIndicator) typingIndicator.remove();

        const scenario = matchedScenario || this.matchScenario(questionText);
        if (scenario) {
          this.lastCitations = scenario.citations || [];
          this.appendScenarioBotResponse(scenario);
          if (this.activeTab === 'activeCite') {
            this.renderActiveCitations(this.lastCitations);
          }
        } else {
          this.appendSearchBasedBotResponse(questionText);
        }

        this.isProcessing = false;
        this.scrollToBottom();
      }, 500);
    }

    matchScenario(query) {
      const q = query.toLowerCase();
      const COMMON_STOPWORDS = ['당원', '권리당원', '민주당', '절차', '방법', '등록', '어떤', '어떻게', '가능', '알려', '문의'];

      const scored = (this.data.scenarios || []).map((sc) => {
        let score = 0;

        // Exact question match
        if (sc.question.toLowerCase().includes(q) || q.includes(sc.question.toLowerCase())) {
          score += 15;
        }

        // Variants match
        if (sc.questionVariants) {
          sc.questionVariants.forEach((v) => {
            const vl = v.toLowerCase();
            if (q.includes(vl) || vl.includes(q)) score += 10;
          });
        }

        // Intent check gate: if requiredIntentKeywords exist, at least one MUST match
        if (sc.requiredIntentKeywords && sc.requiredIntentKeywords.length > 0) {
          const hasIntent = sc.requiredIntentKeywords.some((ik) => q.includes(ik.toLowerCase()));
          if (!hasIntent) {
            return { sc, score: 0 };
          }
          score += 5;
        }

        // Keywords scoring
        (sc.keywords || []).forEach((k) => {
          const kl = k.toLowerCase();
          if (q.includes(kl)) {
            if (COMMON_STOPWORDS.includes(kl)) {
              score += 0.5; // low weight for ubiquitous words
            } else {
              score += 4.0; // high weight for distinctive intent terms
            }
          }
        });

        return { sc, score };
      });

      scored.sort((a, b) => b.score - a.score);
      // Only match if top score meets the strict threshold
      if (scored.length > 0 && scored[0].score >= 4.0) {
        return scored[0].sc;
      }
      return null;
    }

    appendUserMessage(text) {
      const row = document.createElement('div');
      row.className = 'message-row user';
      row.innerHTML = `
        <div class="message-content">
          <div class="chat-bubble">
            ${this.escapeHtml(text)}
          </div>
        </div>
      `;
      this.chatStream.appendChild(row);
      this.scrollToBottom();
    }

    appendTypingIndicator() {
      const row = document.createElement('div');
      row.className = 'message-row bot';
      row.id = 'botTypingIndicator';
      row.innerHTML = `
        <div class="message-avatar scanning">
          <img src="assets/images/bot/bot_avatar.png" alt="AI 자문관" onerror="this.src='정우진1.jpg'" />
        </div>
        <div class="message-content">
          <div class="message-sender">민주당헌 365 AI 자문관 (기획·제작 정우진)</div>
          <div class="chat-bubble">
            <span style="font-size: 0.82rem; color: #004EA2; font-weight: 700; margin-right: 6px;">
              🔍 410쪽 강령·당헌·당규 조항 정밀 탐색 중...
            </span>
            <div class="typing-dots">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>
      `;
      this.chatStream.appendChild(row);
      this.scrollToBottom();
      return row;
    }

    appendScenarioBotResponse(sc) {
      const row = document.createElement('div');
      row.className = 'message-row bot';

      const citationsHtml = (sc.citations || [])
        .map((c) => {
          let quoteHtml = this.escapeHtml(c.quote);
          (c.highlights || []).forEach((hl) => {
            const re = new RegExp(hl, 'g');
            quoteHtml = quoteHtml.replace(re, `<span class="highlight-text">${hl}</span>`);
          });

          return `
          <div style="margin-bottom: 8px; padding: 10px; background: #FFFFFF; border-radius: 8px; border-left: 3px solid #004EA2;">
            <span class="source-meta-tag">[${c.lawHierarchy}] ${c.articleNo} · ${c.clause}</span>
            <div style="font-size: 0.86rem; line-height: 1.65; color: #1E293B;">
              ${quoteHtml}
            </div>
          </div>
        `;
        })
        .join('');

      const followUpsHtml = (sc.followUps || [])
        .map((fu) => `<button type="button" class="btn-header-link btn-follow-up" style="margin: 2px;">👉 ${fu}</button>`)
        .join('');

      row.innerHTML = `
        <div class="message-avatar">
          <img src="assets/images/bot/bot_avatar.png" alt="AI 자문관" onerror="this.src='정우진1.jpg'" />
        </div>
        <div class="message-content">
          <div class="message-sender">민주당헌 365 AI 자문관 (기획·제작 정우진)</div>
          
          <div class="chat-bubble">
            <!-- 1단계: 신호등 결론 배지 -->
            <div class="verdict-banner ${sc.verdict}">
              ${sc.verdictText}
            </div>

            <!-- 핵심 요약 -->
            <div style="font-weight: 800; font-size: 0.98rem; color: #0F172A; margin-bottom: 10px; line-height: 1.5;">
              ${sc.summary}
            </div>

            <!-- 2단계: 눈높이 해설 -->
            <ul class="explanation-bullets">
              ${sc.explanation.map((item) => `<li>${item}</li>`).join('')}
            </ul>

            <!-- 3단계: 공식 근거 원문 대조 카드 -->
            <div class="grounding-box open">
              <div class="grounding-header">
                <span class="grounding-title">
                  <span>🏛️ 공식 근거 원문 (조·항·호) 대조</span>
                  <span style="font-size: 0.72rem; color: #004EA2; background: #E0F2FE; padding: 1px 6px; border-radius: 4px;">2026.08.11 개정판</span>
                </span>
                <span class="grounding-toggle-icon">▼</span>
              </div>
              <div class="grounding-content">
                ${citationsHtml}
                <div style="text-align: right; margin-top: 6px;">
                  <button type="button" class="btn-header-link" onclick="window.partyRulesBotApp.openViewerForScenario('${sc.id}')" style="font-size: 0.78rem;">
                    📖 우측 법전 원문 대조기로 보기 ➔
                  </button>
                </div>
              </div>
            </div>

            <!-- 연관 질문 추천 -->
            ${followUpsHtml ? `
              <div style="margin-top: 12px; padding-top: 8px; border-top: 1px dashed #CBD5E1;">
                <div style="font-size: 0.75rem; font-weight: 800; color: #64748B; margin-bottom: 4px;">💡 관련 추천 질문:</div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${followUpsHtml}
                </div>
              </div>
            ` : ''}

            <!-- 메시지 액션 바 -->
            <div class="bubble-actions">
              <button type="button" class="bubble-btn btn-copy-bubble">
                📋 근거 포함 답변 복사
              </button>
              <button type="button" class="bubble-btn btn-speak-bubble">
                🔊 음성 듣기
              </button>
              <a href="2026.08.11. 더불어민주당 강령당헌당규.md" target="_blank" class="bubble-btn" style="text-decoration: none;">
                📄 410쪽 전문(MD) 보기
              </a>
            </div>

          </div>
        </div>
      `;

      this.chatStream.appendChild(row);
      this.scrollToBottom();
    }

    appendSearchBasedBotResponse(query) {
      const q = query.toLowerCase();
      const scoredArticles = this.data.articles
        .map((art) => {
          let score = 0;
          if (art.title.toLowerCase().includes(q)) score += 10;
          const words = q.split(' ').filter((w) => w.length >= 2);
          words.forEach((w) => {
            if (art.title.toLowerCase().includes(w)) score += 5;
            if (art.content.toLowerCase().includes(w)) score += 1;
          });
          return { art, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);

      const topItem = scoredArticles.length > 0 ? scoredArticles[0].art : null;

      const row = document.createElement('div');
      row.className = 'message-row bot';

      if (!topItem) {
        row.innerHTML = `
          <div class="message-avatar">
            <img src="assets/images/bot/bot_avatar.png" alt="AI 자문관" onerror="this.src='정우진1.jpg'" />
          </div>
          <div class="message-content">
            <div class="message-sender">민주당헌 365 AI 자문관 (기획·제작 정우진)</div>
            <div class="chat-bubble">
              <div class="verdict-banner info">
                📘 [안내] 관련 조항 탐색
              </div>
              <p>
                입력하신 <strong>"${this.escapeHtml(query)}"</strong> 관련 조항을 바로 찾지 못했습니다.<br />
                정확한 검색을 위해 <em>'권리당원 투표권', '음주운전 공천', '비대위', '기본사회', '탈당 복당'</em> 등의 핵심 단어로 다시 질문해 주세요.
              </p>
            </div>
          </div>
        `;
      } else {
        this.lastCitations = [{
          lawHierarchy: topItem.category,
          articleNo: topItem.title,
          articleTitle: topItem.title,
          clause: "조항 전문",
          quote: topItem.content,
          highlights: [query]
        }];
        if (this.activeTab === 'activeCite') {
          this.renderActiveCitations(this.lastCitations);
        }

        row.innerHTML = `
          <div class="message-avatar">
            <img src="assets/images/bot/bot_avatar.png" alt="AI 자문관" onerror="this.src='정우진1.jpg'" />
          </div>
          <div class="message-content">
            <div class="message-sender">민주당헌 365 AI 자문관 (기획·제작 정우진)</div>
            <div class="chat-bubble">
              <div class="verdict-banner info">
                📘 [조항 안내] 2026.08.11 기준 관련 조항
              </div>
              <div style="font-weight: 800; font-size: 0.98rem; color: #0F172A; margin-bottom: 8px;">
                질문하신 사안은 [${topItem.category}] <strong>${topItem.title}</strong>에 규정되어 있습니다.
              </div>

              <!-- 원문 근거 박스 -->
              <div class="grounding-box open">
                <div class="grounding-header">
                  <span class="grounding-title">
                    <span>🏛️ ${topItem.category} · ${topItem.title}</span>
                  </span>
                  <span class="grounding-toggle-icon">▼</span>
                </div>
                <div class="grounding-content">
                  <div style="white-space: pre-line; line-height: 1.65; font-size: 0.86rem;">
                    ${this.escapeHtml(topItem.content.slice(0, 450))}${topItem.content.length > 450 ? '...' : ''}
                  </div>
                  <div style="text-align: right; margin-top: 8px;">
                    <button type="button" class="btn-header-link" onclick="window.partyRulesBotApp.locateArticleById(${topItem.id})" style="font-size: 0.78rem;">
                      📖 우측 법전 대조기에서 보기 ➔
                    </button>
                  </div>
                </div>
              </div>

              <div class="bubble-actions">
                <button type="button" class="bubble-btn btn-copy-bubble">
                  📋 근거 복사
                </button>
                <button type="button" class="bubble-btn btn-speak-bubble">
                  🔊 음성 듣기
                </button>
              </div>
            </div>
          </div>
        `;
      }

      this.chatStream.appendChild(row);
      this.scrollToBottom();
    }

    openViewerAndLocate(citeId, keyword) {
      this.openViewer();
      if (this.lastCitations && this.lastCitations.length > 0) {
        this.tabActiveCite.click();
      } else if (keyword) {
        this.tabFullLawbook.click();
        this.viewerSearchInput.value = keyword;
        this.filterViewerArticles(keyword.toLowerCase());
      }
    }

    openViewerForScenario(scId) {
      this.openViewer();
      const sc = this.data.scenarios.find((s) => s.id === scId);
      if (sc) {
        this.lastCitations = sc.citations || [];
        this.tabActiveCite.click();
      }
    }

    locateArticleById(artId) {
      this.openViewer();
      this.tabFullLawbook.click();
      const art = this.data.articles.find((a) => a.id === artId);
      if (art) {
        this.viewerSearchInput.value = art.title;
        this.renderViewerList([art]);
        const card = document.getElementById(`artCard_${artId}`);
        if (card) {
          card.classList.add('active-target');
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    openViewer() {
      this.dualContainer.classList.remove('viewer-closed');
      this.viewerPanel.classList.add('open-mobile');
      if (this.bottomSheetBackdrop) this.bottomSheetBackdrop.classList.add('active');
    }

    closeViewer() {
      this.dualContainer.classList.add('viewer-closed');
      this.viewerPanel.classList.remove('open-mobile');
      if (this.bottomSheetBackdrop) this.bottomSheetBackdrop.classList.remove('active');
    }

    toggleViewer() {
      if (this.dualContainer.classList.contains('viewer-closed')) {
        this.openViewer();
      } else {
        this.closeViewer();
      }
    }

    speakText(text, btnElement) {
      if (!('speechSynthesis' in window)) {
        alert('현재 브라우저에서는 음성 재생(TTS)을 지원하지 않습니다.');
        return;
      }

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if (btnElement) btnElement.classList.remove('active');
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      if (btnElement) {
        btnElement.classList.add('active');
        utterance.onend = () => btnElement.classList.remove('active');
        utterance.onerror = () => btnElement.classList.remove('active');
      }

      window.speechSynthesis.speak(utterance);
    }

    scrollToBottom() {
      setTimeout(() => {
        this.chatStream.scrollTop = this.chatStream.scrollHeight;
      }, 50);
    }

    escapeHtml(str) {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    window.partyRulesBotApp = new PartyRulesBotApp();
  });
})();
