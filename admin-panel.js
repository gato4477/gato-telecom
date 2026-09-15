// 가토통신 관리자 화면
// 이 파일은 관리자가 로그인 화면을 열 때만 브라우저가 불러옵니다.
// 검색엔진 차단: robots.txt + vercel.json 의 X-Robots-Tag 헤더
export const ADMIN_HTML = `
  <!-- 로그인 -->
  <div id="admin-login" style="max-width:440px;margin:60px auto;padding:0 24px;">
    <div style="background:#fff;border-radius:20px;padding:40px;box-shadow:0 8px 40px rgba(0,0,0,.1);border:1px solid #f0f0f0;text-align:center;">
      <div style="font-size:40px;margin-bottom:16px;">🔐</div>
      <h2 style="font-size:22px;font-weight:900;color:#1a1a1a;margin-bottom:6px;">관리자 로그인</h2>
      <p style="font-size:14px;color:#9ca3af;margin-bottom:28px;">가토통신 관리자 전용</p>
      <div style="display:flex;flex-direction:column;gap:12px;text-align:left;">
        <input id="admin-email" type="email" placeholder="이메일" style="border:1.5px solid #e5e9f5;border-radius:11px;padding:13px 16px;font-size:15px;font-family:inherit;outline:none;">
        <input id="admin-pw" type="password" placeholder="비밀번호" style="border:1.5px solid #e5e9f5;border-radius:11px;padding:13px 16px;font-size:15px;font-family:inherit;outline:none;" onkeydown="if(event.key==='Enter')adminLogin()">
        <button onclick="adminLogin()" style="background:var(--sky);color:#fff;font-weight:800;padding:14px;border-radius:11px;border:none;cursor:pointer;font-size:15px;font-family:inherit;">로그인</button>
      </div>
    </div>
  </div>

  <!-- 대시보드 -->
  <div id="admin-dashboard" style="display:none;">
    <div style="background:linear-gradient(135deg,#1a3a4a,#2d5a72);padding:20px 32px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100;">
      <div style="display:flex;align-items:center;gap:20px;">
        <button onclick="closeAdmin()" style="background:rgba(255,255,255,.1);color:#fff;border:1.5px solid rgba(255,255,255,.2);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;">← 사이트로</button>
        <div>
          <div style="font-size:11px;color:rgba(255,255,255,.6);letter-spacing:2px;">ADMIN</div>
          <h2 style="font-size:20px;font-weight:900;color:#fff;">가토통신 관리자</h2>
        </div>
      </div>
      <button onclick="adminLogout()" style="background:rgba(255,255,255,.15);color:#fff;border:1.5px solid rgba(255,255,255,.3);border-radius:9px;padding:9px 18px;font-size:14px;font-weight:700;cursor:pointer;">로그아웃</button>
    </div>

    <div style="max-width:960px;margin:0 auto;padding:32px 24px;">

      <!-- 배너 관리 -->
      <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 24px rgba(0,0,0,.07);border:1px solid #f0f0f0;margin-bottom:28px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <h3 style="font-size:18px;font-weight:900;color:#1a1a1a;">메인 배너 관리</h3>
          <button onclick="loadAdminBanners()" style="background:#f3f4f6;color:#6b7280;border:none;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">새로고침</button>
        </div>
        <p style="font-size:13px;color:#9ca3af;margin-bottom:20px;">순서가 작은 배너부터 먼저 보여요. 이미지는 올릴 때 자동으로 줄여서 저장돼요.</p>

        <input type="hidden" id="banner-edit-id">
        <input type="hidden" id="banner-edit-url">

        <div style="display:flex;flex-direction:column;gap:14px;">
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <div style="flex:2;min-width:200px;">
              <label class="ab-lb" for="banner-title">배너 이름 (관리용)</label>
              <input id="banner-title" class="ab-in" type="text" placeholder="예) 9월 유심 이벤트">
            </div>
            <div style="flex:1;min-width:110px;">
              <label class="ab-lb" for="banner-order">노출 순서</label>
              <input id="banner-order" class="ab-in" type="number" value="1" min="1">
            </div>
          </div>

          <div>
            <label class="ab-lb" for="banner-link">클릭했을 때 이동할 주소 (비우면 클릭 안 됨)</label>
            <input id="banner-link" class="ab-in" type="url" placeholder="https://알뜰개통.kr">
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <div style="flex:1;min-width:150px;">
              <label class="ab-lb" for="banner-start">노출 시작일 (비우면 바로)</label>
              <input id="banner-start" class="ab-in" type="date">
            </div>
            <div style="flex:1;min-width:150px;">
              <label class="ab-lb" for="banner-end">노출 종료일 (비우면 계속)</label>
              <input id="banner-end" class="ab-in" type="date">
            </div>
          </div>

          <div>
            <label class="ab-lb" for="banner-file">배너 이미지 (1200 &times; 460 권장 · 올리면 자동으로 줄여줘요)</label>
            <input id="banner-file" class="ab-in" type="file" accept="image/png,image/jpeg,image/webp" onchange="previewBanner(event)" style="padding:10px 12px;">
            <div class="ab-bar" id="banner-bar"><i></i></div>
            <div id="banner-size" style="font-size:12.5px;color:#1a9c6b;font-weight:700;margin-top:6px;"></div>
            <div id="banner-preview" style="display:none;margin-top:10px;border:1.5px dashed #e5e9f5;border-radius:11px;padding:10px;background:#fafbfe;">
              <img id="banner-preview-img" alt="" style="max-width:100%;max-height:190px;border-radius:7px;display:block;">
            </div>
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button id="banner-save-btn" onclick="saveBanner()" style="background:var(--sky);color:#fff;font-weight:800;padding:13px 0;border-radius:11px;border:none;cursor:pointer;font-size:15px;font-family:inherit;flex:1;min-width:120px;">배너 등록</button>
            <button onclick="resetBannerForm()" style="background:#f3f4f6;color:#6b7280;font-weight:700;padding:13px 16px;border-radius:11px;border:none;cursor:pointer;font-size:15px;font-family:inherit;">초기화</button>
          </div>
        </div>

        <div id="admin-banner-list" style="margin-top:24px;"></div>
      </div>

      <!-- 블로그 글쓰기 -->
      <div id="blog-write-section" style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 24px rgba(0,0,0,.07);border:1px solid #f0f0f0;margin-bottom:28px;">
        <h3 id="blog-form-title" style="font-size:18px;font-weight:900;color:#1a1a1a;margin-bottom:20px;">새 글 작성</h3>
        <input type="hidden" id="blog-edit-id">
        <div style="display:flex;flex-direction:column;gap:12px;">
          <input id="blog-title" type="text" placeholder="제목" style="border:1.5px solid #e5e9f5;border-radius:11px;padding:13px 16px;font-size:15px;font-family:inherit;outline:none;">
          <input type="hidden" id="blog-category" value="일반">
          <!-- 에디터 탭 -->
          <div style="display:flex;gap:0;border:1.5px solid #e5e9f5;border-radius:11px 11px 0 0;overflow:hidden;">
            <button id="tab-wysiwyg" type="button" onclick="switchEditorTab('wysiwyg')" style="flex:1;padding:10px;font-size:13px;font-weight:700;background:var(--sky);color:#fff;border:none;cursor:pointer;">✏️ 일반 편집</button>
            <button id="tab-html" type="button" onclick="switchEditorTab('html')" style="flex:1;padding:10px;font-size:13px;font-weight:700;background:#f3f4f6;color:#6b7280;border:none;cursor:pointer;">&lt;/&gt; HTML 붙여넣기</button>
          </div>

          <!-- 일반 편집 영역 -->
          <div id="editor-wysiwyg" style="border:1.5px solid #e5e9f5;border-top:none;border-radius:0 0 11px 11px;overflow:hidden;">
            <div style="background:#f8faff;border-bottom:1.5px solid #e5e9f5;padding:8px 12px;display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
              <button type="button" onclick="execCmd('bold')" title="굵게" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-weight:900;font-size:14px;">B</button>
              <button type="button" onclick="execCmd('italic')" title="기울게" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-style:italic;font-size:14px;">I</button>
              <button type="button" onclick="execCmd('underline')" title="밑줄" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;text-decoration:underline;font-size:14px;">U</button>
              <div style="width:1px;height:22px;background:#e5e9f5;margin:0 2px;"></div>
              <select onchange="execCmd('fontSize', this.value);this.selectedIndex=0;" style="border:1px solid #e5e9f5;border-radius:6px;padding:4px 6px;font-size:13px;background:#fff;cursor:pointer;">
                <option value="">크기</option>
                <option value="1">작게</option>
                <option value="3">보통</option>
                <option value="5">크게</option>
                <option value="7">매우 크게</option>
              </select>
              <label title="글씨 색상" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:4px;">
                🎨<input type="color" onchange="execCmd('foreColor', this.value)" style="width:20px;height:20px;border:none;cursor:pointer;padding:0;background:none;">
              </label>
              <div style="width:1px;height:22px;background:#e5e9f5;margin:0 2px;"></div>
              <button type="button" onclick="execCmd('justifyLeft')" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:14px;">≡</button>
              <button type="button" onclick="execCmd('justifyCenter')" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:14px;">☰</button>
              <button type="button" onclick="execCmd('justifyRight')" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:14px;">▤</button>
              <div style="width:1px;height:22px;background:#e5e9f5;margin:0 2px;"></div>
              <button type="button" onclick="execCmd('insertUnorderedList')" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:14px;">• 목록</button>
              <button type="button" onclick="execCmd('insertOrderedList')" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:14px;">1. 목록</button>
              <div style="width:1px;height:22px;background:#e5e9f5;margin:0 2px;"></div>
              <button type="button" onclick="insertLink()" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:14px;">🔗</button>
              <button type="button" onclick="insertImage()" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:14px;">🖼️</button>
              <div style="width:1px;height:22px;background:#e5e9f5;margin:0 2px;"></div>
              <button type="button" onclick="execCmd('insertHorizontalRule')" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:14px;">— 구분선</button>
              <button type="button" onclick="insertQuote()" style="background:#fff;border:1px solid #e5e9f5;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:14px;">❝ 인용</button>
            </div>
            <div id="blog-content-editor" contenteditable="true" style="min-height:220px;padding:16px;font-size:15px;font-family:inherit;outline:none;line-height:1.7;" placeholder="내용을 입력하세요..."></div>
          </div>

          <!-- HTML 붙여넣기 영역 -->
          <div id="editor-html" style="display:none;border:1.5px solid #e5e9f5;border-top:none;border-radius:0 0 11px 11px;overflow:hidden;">
            <div style="background:#1a1a2e;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
              <span style="color:#4DBDE8;font-size:12px;font-weight:700;font-family:monospace;">&lt;HTML&gt; 코드를 붙여넣거나 파일을 업로드하세요</span>
              <div style="display:flex;gap:6px;">
                <label style="background:#2899c4;color:#fff;border:none;border-radius:6px;padding:5px 12px;font-size:12px;font-weight:700;cursor:pointer;">
                  📁 파일 업로드
                  <input type="file" accept=".html" onchange="uploadHtmlFile(event)" style="display:none;">
                </label>
                <button type="button" onclick="applyHtml()" style="background:#4DBDE8;color:#fff;border:none;border-radius:6px;padding:5px 12px;font-size:12px;font-weight:700;cursor:pointer;">✓ 적용</button>
              </div>
            </div>
            <textarea id="blog-html-input" placeholder="여기에 HTML 코드를 붙여넣거나 위의 파일 업로드 버튼을 이용하세요" style="width:100%;min-height:220px;padding:16px;font-size:13px;font-family:monospace;border:none;outline:none;background:#0f0f1a;color:#e2e8f0;line-height:1.6;resize:vertical;box-sizing:border-box;"></textarea>
          </div>
          <textarea id="blog-content" style="display:none;"></textarea>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button onclick="saveBlogPost('일반')" style="background:var(--sky);color:#fff;font-weight:800;padding:13px 0;border-radius:11px;border:none;cursor:pointer;font-size:15px;font-family:inherit;flex:1;min-width:120px;">저장 · 발행</button>
            <button onclick="saveBlogPost('공지')" style="background:#FF6B35;color:#fff;font-weight:800;padding:13px 0;border-radius:11px;border:none;cursor:pointer;font-size:15px;font-family:inherit;flex:1;min-width:120px;">📌 공지로 올리기</button>
            <button onclick="resetBlogForm()" style="background:#f3f4f6;color:#6b7280;font-weight:700;padding:13px 16px;border-radius:11px;border:none;cursor:pointer;font-size:15px;font-family:inherit;">초기화</button>
          </div>
        </div>
      </div>

      <!-- 블로그 글 목록 -->
      <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 24px rgba(0,0,0,.07);border:1px solid #f0f0f0;margin-bottom:28px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="font-size:18px;font-weight:900;color:#1a1a1a;">블로그 글 목록</h3>
          <button onclick="loadAdminBlog()" style="background:#f3f4f6;color:#6b7280;border:none;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:700;cursor:pointer;">새로고침</button>
        </div>
        <div id="admin-blog-list"></div>
      </div>

      <!-- 창업문의 목록 -->
      <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 24px rgba(0,0,0,.07);border:1px solid #f0f0f0;margin-bottom:28px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="font-size:18px;font-weight:900;color:#1a1a1a;">창업문의 목록</h3>
          <button onclick="loadAdminInquiries()" style="background:#f3f4f6;color:#6b7280;border:none;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:700;cursor:pointer;">새로고침</button>
        </div>
        <div id="admin-inquiry-list"></div>
      </div>

      <!-- 후기 관리 -->
      <div style="background:#fff;border-radius:20px;padding:28px;box-shadow:0 4px 24px rgba(0,0,0,.07);border:1px solid #f0f0f0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="font-size:18px;font-weight:900;color:#1a1a1a;">후기 관리</h3>
          <button onclick="loadAdminReviews()" style="background:#f3f4f6;color:#6b7280;border:none;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:700;cursor:pointer;">새로고침</button>
        </div>
        <div id="admin-review-list"></div>
      </div>

    </div>
  </div>
`;
