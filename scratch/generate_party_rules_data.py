import sys
import os
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

md_path = r"c:\GL-AG-PJT\MJEdu\2026.08.11. 더불어민주당 강령당헌당규.md"
with open(md_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Parse into clean categories
lines = text.split('\n')

articles = []
current_cat = "강령"
current_sec = ""
current_title = ""
current_lines = []

def clean_text(t):
    return re.sub(r'\s+', ' ', t).strip()

def determine_category(line):
    if 'Ⅰ. 강 령' in line or '강령' in line and ('#' in line):
        return "강령"
    if 'Ⅱ. 윤리규범' in line or '윤리규범' in line and ('#' in line):
        return "윤리규범"
    if 'Ⅲ. 당 헌' in line or '당헌' in line and ('#' in line):
        return "당헌"
    if 'Ⅳ. 당 규' in line or '당규' in line and ('#' in line):
        return "당규"
    if '특별당규' in line and ('#' in line):
        return "특별당규"
    if '별표' in line and ('#' in line):
        return "별표기준"
    return None

for line in lines:
    new_cat = determine_category(line)
    if new_cat:
        current_cat = new_cat

    if line.startswith('### ') or line.startswith('#### '):
        # Save previous
        if current_title and current_lines:
            content = '\n'.join(current_lines).strip()
            if len(content) > 15:
                articles.append({
                    "id": len(articles) + 1,
                    "category": current_cat,
                    "section": current_sec,
                    "title": current_title,
                    "content": content
                })
            current_lines = []
        
        current_title = line.replace('###', '').replace('####', '').strip()
    elif line.startswith('## '):
        current_sec = line.replace('##', '').strip()
    else:
        if current_title:
            current_lines.append(line)

# Save final
if current_title and current_lines:
    content = '\n'.join(current_lines).strip()
    if len(content) > 15:
        articles.append({
            "id": len(articles) + 1,
            "category": current_cat,
            "section": current_sec,
            "title": current_title,
            "content": content
        })

print(f"Total articles extracted: {len(articles)}")
from collections import Counter
cat_counts = Counter(a['category'] for a in articles)
for c, cnt in cat_counts.items():
    print(f"- {c}: {cnt} items")
