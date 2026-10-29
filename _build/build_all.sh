#!/bin/sh
# 모든 페이지 다시 만들기: sh _build/build_all.sh
cd "$(dirname "$0")" && for f in p_index.py p_pages1.py p_plans.py p_esim.py p_faq_blog.py p_support.py; do python3 "$f" || exit 1; done
