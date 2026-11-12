import sys
import os
import re
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

CIRCLED_NUMS = set('①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳')

def is_footer(text, y1):
    if y1 < 750:
        return False
    t = text.strip()
    words = t.split()
    if any(w.isdigit() for w in words):
        if any(k in t for k in ['강령', '윤리규범', '당헌', '당규', '대통령선거', '국회의원선거']):
            return True
    return False

def is_new_item_start(line):
    l = line.strip()
    if not l:
        return False
    # Circled number
    if l[0] in CIRCLED_NUMS:
        return True
    # Article
    if re.match(r'^제\d+조(?:\([^\)]+\))?', l):
        return True
    # Chapter / Section
    if re.match(r'^제\d+[장절관]\s+', l):
        return True
    # Number item: 1. 2.
    if re.match(r'^\d+\.\s+', l):
        return True
    # Hangul item: 가. 나. 다.
    if re.match(r'^[가-하]\.\s+', l):
        return True
    # Korean numbers: 하나, 둘, 셋
    if re.match(r'^(?:하나|둘|셋|넷|다섯|여섯|일곱|여덟|아홉|열|열하나|열둘|열셋),\s+', l):
        return True
    # Addenda
    if re.match(r'^부칙\s*<', l):
        return True
    # Revision history
    if re.match(r'^\[(?:제|개|전면개)정\s+', l):
        return True
    # Attached tables / forms
    if re.match(r'^<별[지표]\s*제?\d+.*>', l) or re.match(r'^\[별[지표]\s*제?\d+.*\]', l):
        return True
    # Bullets
    if l.startswith('◈') or l.startswith('◇') or l.startswith('◦') or l.startswith('※') or l.startswith('‧') or l.startswith('•'):
        return True
    return False

print("Helper functions ready")
