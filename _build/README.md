# 페이지 생성 스크립트

사이트의 HTML 페이지(index.html, plans-*.html 등)는 이 폴더의 파이썬 스크립트로 만들어요.
공통 머리말·바닥글은 `common.py` 한 곳에 있어서, 여기를 고치고 다시 만들면 모든 페이지에 반영돼요.

- 전체 다시 만들기: `sh _build/build_all.sh`
- 페이지별: `p_index.py`(메인), `p_pages1.py`(셀프개통·유심), `p_plans.py`(요금제), `p_esim.py`(eSIM), `p_faq_blog.py`(FAQ·블로그 목록), `p_support.py`(1:1 문의·센터 안내)
- `data/`: FAQ 원본(faqs.json), eSIM 원본
- `motion/`: 메인 게이지 영상 원본(gauge.html)과 녹화 스크립트

이 폴더는 `.vercelignore`로 배포에서 빠져 있어 사이트에는 올라가지 않아요.
