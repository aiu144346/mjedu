import sys
import os
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

md_path = r"c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.md"
with open(md_path, 'r', encoding='utf-8') as f:
    text = f.read()

print(f"Loaded markdown: {len(text):,} characters")

# Let's extract articles (조항) from 당헌, 당규, 윤리규범, 강령
articles = []

# 1. Split text into logical sections
# Main sections: # 강령, # 윤리규범, # 당헌, # 당규, # 특별당규
lines = text.split('\n')
current_h1 = "기본"
current_h2 = ""
current_h3 = ""
current_article_id = None
current_article_title = ""
current_article_lines = []

def save_article():
    global current_article_id, current_article_title, current_article_lines, current_h1, current_h2
    if current_article_title and current_article_lines:
        content = '\n'.join(current_article_lines).strip()
        if len(content) > 10:
            articles.append({
                "id": len(articles) + 1,
                "category": current_h1.replace('#', '').strip(),
                "section": current_h2.replace('#', '').strip(),
                "title": current_article_title.replace('#', '').strip(),
                "content": content
            })
    current_article_lines = []

for line in lines:
    if line.startswith('# '):
        save_article()
        current_h1 = line.strip()
        current_article_title = ""
    elif line.startswith('## '):
        save_article()
        current_h2 = line.strip()
        current_article_title = ""
    elif line.startswith('### '):
        save_article()
        current_h3 = line.strip()
        if '제' in line and '조' in line:
            current_article_title = line.strip()
        else:
            current_article_title = line.strip()
    elif line.startswith('#### '):
        save_article()
        current_article_title = line.strip()
    else:
        if current_article_title:
            current_article_lines.append(line)

save_article()
print(f"Extracted {len(articles)} raw structured article blocks!")

# Sample inspection
for a in articles[:5]:
    print(f"[{a['category']}] {a['section']} > {a['title']}: {len(a['content'])} chars")
