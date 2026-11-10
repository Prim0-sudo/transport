"""Builds the Media > Presentation PowerPoint files from artwork/presentations-plan.json.

Run node scripts/build-presentations.mjs first. Needs Pillow and python-pptx (pip install python-pptx).
Pictures are flattened to JPEG on the slide's own colour so each deck stays small.
Usage: python scripts/build-presentations-pptx.py
"""
import io, json, os
from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'site', 'dist')
NAVY, GOLD, CREAM, WHITE, INK = (RGBColor(0x1d, 0x4f, 0x73), RGBColor(0xd8, 0xbd, 0x7d), RGBColor(0xff, 0xfb, 0xed),
                                 RGBColor(0xff, 0xff, 0xff), RGBColor(0x18, 0x3a, 0x51))
DEEP_GOLD = RGBColor(0xb8, 0x93, 0x2f)
FONT = 'Calibri'
W, H = Inches(13.333), Inches(7.5)
cache = {}


def picture(path, bg, longest=900):
    key = (path, bg, longest)
    if key not in cache:
        im = trimmed(path)
        im.thumbnail((longest, longest), Image.LANCZOS)
        flat = Image.new('RGB', im.size, bg)
        flat.paste(im, mask=im.split()[3])
        out = io.BytesIO(); flat.save(out, 'JPEG', quality=84, optimize=True); cache[key] = out.getvalue()
    return io.BytesIO(cache[key])


def trimmed(path):
    """The picture cropped to its visible subject (cut-outs carry wide transparent margins)."""
    im = Image.open(os.path.join(DIST, path)).convert('RGBA')
    bounds = im.split()[3].point(lambda a: 255 if a > 12 else 0).getbbox()
    if bounds and bounds != (0, 0) + im.size:
        l, t, r, b = bounds; pad = round(max(r - l, b - t) * .04)
        im = im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))
    return im


def fit(slide, path, bg, x, y, w, h, longest=900):
    """Place a picture inside the box, keeping its proportions, centred."""
    iw, ih = trimmed(path).size
    scale = min(w / iw, h / ih)
    pw, ph = int(iw * scale), int(ih * scale)
    return slide.shapes.add_picture(picture(path, bg, longest), x + (w - pw) // 2, y + (h - ph) // 2, pw, ph)


def background(slide, colour):
    fill = slide.background.fill; fill.solid(); fill.fore_color.rgb = colour


def box(slide, x, y, w, h, fill, line=None, radius=.08, shape=MSO_SHAPE.ROUNDED_RECTANGLE):
    s = slide.shapes.add_shape(shape, x, y, w, h)
    s.fill.solid(); s.fill.fore_color.rgb = fill
    if line: s.line.color.rgb = line; s.line.width = Pt(3)
    else: s.line.fill.background()
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE: s.adjustments[0] = radius
    s.shadow.inherit = False
    return s


def text(slide, x, y, w, h, value, size, colour, bold=False, italic=False, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    t = slide.shapes.add_textbox(x, y, w, h).text_frame
    t.word_wrap = True; t.vertical_anchor = anchor; t.auto_size = MSO_AUTO_SIZE.NONE
    t.margin_left = t.margin_right = Inches(.05)
    lines = value if isinstance(value, list) else [value]
    for i, line in enumerate(lines):
        p = t.paragraphs[0] if i == 0 else t.add_paragraph()
        p.alignment = align
        if len(lines) > 1: p.space_after = Pt(size * .6)
        runs = line if isinstance(line, list) else [(line, bold)]
        for chunk, b in runs:
            r = p.add_run(); r.text = chunk
            r.font.size = Pt(size); r.font.color.rgb = colour; r.font.bold = b; r.font.italic = italic; r.font.name = FONT
    return t


def heading(slide, title, dark=False):
    text(slide, Inches(.6), Inches(.35), Inches(12.1), Inches(.9), title, 36, CREAM if dark else NAVY, bold=True)
    bar = box(slide, Inches(.62), Inches(1.18), Inches(1.4), Inches(.09), GOLD, radius=.5)


def tiles(slide, items, show_names):
    cols = 6 if len(items) > 6 else 3 if len(items) <= 6 else 4
    cols = min(cols, len(items)) or 1
    rows = (len(items) + cols - 1) // cols
    area_w, area_h = Inches(12.1), Inches(5.7)
    gap = Inches(.25)
    tw = (area_w - gap * (cols - 1)) // cols
    th = min((area_h - gap * (rows - 1)) // rows, int(tw * (1.25 if show_names else 1.05)))
    top = Inches(1.5) + (area_h - (th * rows + gap * (rows - 1))) // 2
    for i, item in enumerate(items):
        r, c = divmod(i, cols)
        in_row = min(cols, len(items) - r * cols)
        left = Inches(.6) + (area_w - (tw * in_row + gap * (in_row - 1))) // 2  # centre a short last row
        x, y = left + c * (tw + gap), top + r * (th + gap)
        box(slide, x, y, tw, th, WHITE, GOLD)
        label_h = int(th * .2) if show_names else 0
        pad = int(min(tw, th) * .08)
        fit(slide, item['image'], (255, 255, 255), x + pad, y + pad, tw - 2 * pad, th - 2 * pad - label_h, 500)
        if show_names:
            text(slide, x, y + th - label_h - pad // 2, tw, label_h, item['name'], 20 if cols > 4 else 26, INK, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        elif 'name' not in item:
            pass


def slide_title(prs, s, kicker):
    slide = prs.slides.add_slide(prs.slide_layouts[6]); background(slide, NAVY)
    text(slide, Inches(.7), Inches(.6), Inches(5.6), Inches(.5), kicker, 20, GOLD, bold=True)
    text(slide, Inches(.7), Inches(2.3), Inches(5.6), Inches(2.4), s['title'], 54, CREAM, bold=True, anchor=MSO_ANCHOR.MIDDLE)
    text(slide, Inches(.7), Inches(4.8), Inches(5.6), Inches(.8), s['subtitle'], 26, GOLD)
    box(slide, Inches(6.55), Inches(.75), Inches(6.1), Inches(6.0), CREAM, GOLD)
    fit(slide, s['image'], (0xff, 0xfb, 0xed), Inches(6.75), Inches(.95), Inches(5.7), Inches(5.6), 1100)


def build(deck):
    prs = Presentation(); prs.slide_width, prs.slide_height = W, H
    blank = prs.slide_layouts[6]
    for s in deck['slides']:
        kind = s['type']
        if kind == 'title': slide_title(prs, s, 'TRANSPORT TOWN')
        elif kind == 'section': slide_title(prs, {**s, 'subtitle': s['subtitle']}, 'NEXT UP')
        elif kind in ('grid', 'quiz', 'answers'):
            slide = prs.slides.add_slide(blank); background(slide, CREAM); heading(slide, s['title'])
            tiles(slide, s['items'], kind != 'quiz')
        elif kind == 'word':
            slide = prs.slides.add_slide(blank); background(slide, CREAM)
            box(slide, Inches(.6), Inches(.6), Inches(6.2), Inches(6.3), WHITE, GOLD)
            fit(slide, s['image'], (255, 255, 255), Inches(.9), Inches(.9), Inches(5.6), Inches(5.7), 900)
            text(slide, Inches(7.2), Inches(.9), Inches(5.6), Inches(1.6), s['name'], 66, NAVY, bold=True, anchor=MSO_ANCHOR.BOTTOM)
            box(slide, Inches(7.26), Inches(2.6), Inches(1.4), Inches(.09), GOLD, radius=.5)
            text(slide, Inches(7.2), Inches(2.95), Inches(5.6), Inches(2.0), s['meaning'], 28, INK)
            if s.get('example'):
                box(slide, Inches(7.2), Inches(5.05), Inches(5.6), Inches(1.6), RGBColor(0xfc, 0xf1, 0xda), GOLD)
                text(slide, Inches(7.45), Inches(5.15), Inches(5.1), Inches(1.4), s['example'], 24, INK, italic=True, anchor=MSO_ANCHOR.MIDDLE)
        elif kind == 'scene':
            slide = prs.slides.add_slide(blank); background(slide, NAVY); heading(slide, s['title'], dark=True)
            box(slide, Inches(.6), Inches(1.55), Inches(7.9), Inches(5.35), WHITE)
            fit(slide, s['image'], (255, 255, 255), Inches(.7), Inches(1.65), Inches(7.7), Inches(5.15), 1500)
            lines = [[(name + '  ', True), (desc, False)] for name, desc in s['labels']]
            if lines: text(slide, Inches(8.8), Inches(1.55), Inches(4.1), Inches(5.35), lines[:4], 18, CREAM, anchor=MSO_ANCHOR.MIDDLE)
        elif kind == 'end':
            slide = prs.slides.add_slide(blank); background(slide, NAVY)
            fit(slide, s['image'], (0x1d, 0x4f, 0x73), Inches(4.67), Inches(.7), Inches(4.0), Inches(4.0), 800)
            text(slide, Inches(1), Inches(4.9), Inches(11.3), Inches(1.1), s['title'], 54, CREAM, bold=True, align=PP_ALIGN.CENTER)
            text(slide, Inches(1), Inches(6.0), Inches(11.3), Inches(.8), s['subtitle'], 26, GOLD, align=PP_ALIGN.CENTER)
        else: raise ValueError(kind)
    out = os.path.join(DIST, deck['pptx']); prs.save(out)
    return os.path.getsize(out)


plan = json.load(open(os.path.join(ROOT, 'artwork', 'presentations-plan.json'), encoding='utf-8'))
sizes = {}
for deck in plan:
    sizes[deck['id']] = build(deck)
    print(deck['id'], deck['slideCount'], 'slides', sizes[deck['id']] // 1024, 'KB')
# Record each file size in the runtime data for the Media rows.
runtime = os.path.join(DIST, 'presentations', 'decks.js')
src = open(runtime, encoding='utf-8').read()
data = json.loads(src[src.index('=') + 1:].strip().rstrip(';'))
for deck in data: deck['bytes'] = sizes[deck['id']]
open(runtime, 'w', encoding='utf-8', newline='\n').write('// Generated by scripts/build-presentations.mjs and build-presentations-pptx.py.\nglobalThis.TransportPresentations = ' + json.dumps(data, separators=(',', ':')) + ';\n')
