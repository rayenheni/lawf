#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Rapport comparatif PDF : Nouveau site (recouv-weld.vercel.app) vs Ancien site (miraj-recouv.com)
Génère un PDF clair, illustré, compréhensible par tous.
Usage : python3 generer_rapport.py
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    Image as RLImage, PageBreak, KeepTogether,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "images")
os.makedirs(IMG, exist_ok=True)
PDF_PATH = os.path.join(HERE, "Comparatif-MIRAJ-Nouveau-vs-Ancien.pdf")

# ---------------------------------------------------------------- couleurs
NAVY      = colors.HexColor("#0E2A47")
NAVY2     = colors.HexColor("#16406B")
GOLD      = colors.HexColor("#C9A227")
GOLD_L    = colors.HexColor("#F7EED2")
GREEN     = colors.HexColor("#1E7E34")
GREEN_L   = colors.HexColor("#DFF2E3")
BLUE_L    = colors.HexColor("#DCE9F7")
GRAY_BG   = colors.HexColor("#F2F4F7")
GRAY_TX   = colors.HexColor("#5B6470")
DARK      = colors.HexColor("#1F2A37")
RED_L     = colors.HexColor("#FDE8E8")
RED       = colors.HexColor("#B42318")

SITE_A = "Nouveau site"
SITE_A_URL = "recouv-weld.vercel.app"
SITE_B = "Ancien site"
SITE_B_URL = "miraj-recouv.com"

# ---------------------------------------------------------------- polices (DejaVu -> accents + symboles)
def register_fonts():
    try:
        reg = os.path.join(os.path.dirname(font_manager.__file__), "mpl-data", "fonts", "ttf")
        pdfmetrics.registerFont(TTFont("DV", os.path.join(reg, "DejaVuSans.ttf")))
        pdfmetrics.registerFont(TTFont("DV-B", os.path.join(reg, "DejaVuSans-Bold.ttf")))
        pdfmetrics.registerFont(TTFont("DV-O", os.path.join(reg, "DejaVuSans-Oblique.ttf")))
        return "DV", "DV-B", "DV-O"
    except Exception as e:
        print("/polices DejaVu introuvables, repli Helvetica:", e)
        return "Helvetica", "Helvetica-Bold", "Helvetica-Oblique"

F, FB, FO = register_fonts()

# ---------------------------------------------------------------- styles
sTitle = ParagraphStyle("Title", fontName=FB, fontSize=30, leading=36, textColor=NAVY, alignment=TA_CENTER)
sSub = ParagraphStyle("Sub", fontName=F, fontSize=12.5, leading=18, textColor=GRAY_TX, alignment=TA_CENTER)
sH1 = ParagraphStyle("H1", fontName=FB, fontSize=17, leading=22, textColor=NAVY, spaceBefore=2, spaceAfter=8,
                     borderPadding=(0, 0, 6, 0))
sH2 = ParagraphStyle("H2", fontName=FB, fontSize=12.5, leading=16, textColor=NAVY2, spaceBefore=8, spaceAfter=4)
sBody = ParagraphStyle("Body", fontName=F, fontSize=10, leading=15, textColor=DARK, alignment=TA_JUSTIFY, spaceAfter=4)
sBodyC = ParagraphStyle("BodyC", parent=sBody, alignment=TA_CENTER)
sSmall = ParagraphStyle("Small", fontName=F, fontSize=8.5, leading=12, textColor=GRAY_TX, alignment=TA_CENTER)
sBullet = ParagraphStyle("Bullet", parent=sBody, alignment=TA_LEFT, leftIndent=14, bulletIndent=4, spaceAfter=3)
sCell = ParagraphStyle("Cell", fontName=F, fontSize=8.8, leading=12, textColor=DARK)
sCellB = ParagraphStyle("CellB", parent=sCell, fontName=FB)
sCellC = ParagraphStyle("CellC", parent=sCell, alignment=TA_CENTER)
sCellCB = ParagraphStyle("CellCB", parent=sCellB, alignment=TA_CENTER)
sHead = ParagraphStyle("Head", parent=sCellCB, textColor=colors.white)
sBadge = ParagraphStyle("Badge", fontName=FB, fontSize=10.5, leading=14, textColor=colors.white, alignment=TA_CENTER)
sQuote = ParagraphStyle("Quote", fontName=FO, fontSize=10, leading=15, textColor=NAVY2, alignment=TA_CENTER)

CRITERIA_1L = ["Clarté du message", "Design & modernité", "Parcours & conversion", "Contenu & pédagogie",
               "Preuves & chiffres", "Outils interactifs", "Confiance & garanties", "Formulaires & contact"]
SCORE_A = [9.0, 9.0, 8.5, 7.5, 8.0, 9.0, 7.5, 7.0]
SCORE_B = [6.0, 5.5, 6.5, 8.0, 7.5, 7.0, 8.5, 8.5]
AVG_A = sum(SCORE_A) / len(SCORE_A)   # 8.19
AVG_B = sum(SCORE_B) / len(SCORE_B)   # 7.19

def frnum(v):
    return f"{v:.1f}".replace(".", ",")

# ================================================================ GRAPHIQUES
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10})

def fig_radar():
    import numpy as np
    N = len(CRITERIA_1L)
    ang = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
    a = SCORE_A + SCORE_A[:1]; b = SCORE_B + SCORE_B[:1]; ang += ang[:1]
    fig, ax = plt.subplots(figsize=(7.2, 5.2), subplot_kw=dict(polar=True))
    ax.set_theta_offset(np.pi / 2); ax.set_theta_direction(-1)
    ax.set_xticks(ang[:-1]); ax.set_xticklabels(CRITERIA_1L, fontsize=9, color="#1F2A37")
    ax.set_ylim(0, 10); ax.set_yticks([2, 4, 6, 8, 10])
    ax.set_yticklabels(["2", "4", "6", "8", "10"], fontsize=8, color="#8A94A3")
    ax.grid(color="#D6DCE4", linewidth=0.7)
    ax.plot(ang, a, color="#0E2A47", linewidth=2.6, label=f"{SITE_A}  ({frnum(AVG_A)}/10)")
    ax.fill(ang, a, color="#0E2A47", alpha=0.13)
    ax.plot(ang, b, color="#C9A227", linewidth=2.6, label=f"{SITE_B}  ({frnum(AVG_B)}/10)")
    ax.fill(ang, b, color="#C9A227", alpha=0.15)
    ax.scatter(ang[:-1], SCORE_A, color="#0E2A47", s=34, zorder=5)
    ax.scatter(ang[:-1], SCORE_B, color="#C9A227", s=34, zorder=5, edgecolors="#7A6312")
    leg = ax.legend(loc="upper right", bbox_to_anchor=(1.34, 1.10), frameon=True, fontsize=9.5)
    leg.get_frame().set_edgecolor("#D6DCE4")
    p = os.path.join(IMG, "radar.png"); fig.savefig(p, dpi=200, bbox_inches="tight"); plt.close(fig)
    return p

def fig_bars():
    import numpy as np
    y = np.arange(len(CRITERIA_1L))
    fig, ax = plt.subplots(figsize=(7.4, 4.6))
    ax.barh(y + 0.2, SCORE_A, 0.38, color="#0E2A47", label=SITE_A)
    ax.barh(y - 0.2, SCORE_B, 0.38, color="#C9A227", label=SITE_B)
    ax.set_yticks(y); ax.set_yticklabels(CRITERIA_1L, fontsize=9.5, color="#1F2A37")
    ax.set_xlim(0, 10.4); ax.set_xticks(range(0, 11)); ax.set_xlabel("Note sur 10", fontsize=10, color="#5B6470")
    ax.invert_yaxis()
    ax.xaxis.grid(color="#E3E7ED", linewidth=0.7); ax.set_axisbelow(True)
    for v, yy in zip(SCORE_A, y + 0.2):
        ax.text(v + 0.08, yy, frnum(v), va="center", fontsize=9, fontweight="bold", color="#0E2A47")
    for v, yy in zip(SCORE_B, y - 0.2):
        ax.text(v + 0.08, yy, frnum(v), va="center", fontsize=9, fontweight="bold", color="#7A6312")
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    leg = ax.legend(frameon=True, fontsize=9.5, loc="upper left", bbox_to_anchor=(1.0, 1.0))
    leg.get_frame().set_edgecolor("#D6DCE4")
    p = os.path.join(IMG, "barres.png"); fig.savefig(p, dpi=200, bbox_inches="tight"); plt.close(fig)
    return p

def fig_duel():
    fig, ax = plt.subplots(figsize=(7.4, 2.4))
    ax.barh([1, 0], [AVG_A, AVG_B], 0.52, color=["#0E2A47", "#C9A227"])
    ax.set_yticks([1, 0]); ax.set_yticklabels([f"{SITE_A}\n{SITE_A_URL}", f"{SITE_B}\n{SITE_B_URL}"], fontsize=8.5)
    ax.set_xlim(0, 10.6); ax.set_xticks(range(0, 11)); ax.set_xlabel("Note globale sur 10", fontsize=10, color="#5B6470")
    ax.xaxis.grid(color="#E3E7ED", linewidth=0.7); ax.set_axisbelow(True)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.text(AVG_A + 0.08, 1, f"{frnum(AVG_A)} / 10  ★", va="center", fontsize=13, fontweight="bold", color="#0E2A47")
    ax.text(AVG_B + 0.08, 0, f"{frnum(AVG_B)} / 10", va="center", fontsize=13, fontweight="bold", color="#7A6312")
    fig.subplots_adjust(left=0.30, right=0.97, top=0.92, bottom=0.20)
    p = os.path.join(IMG, "duel.png"); fig.savefig(p, dpi=200, bbox_inches="tight"); plt.close(fig)
    return p

def fig_counts():
    import numpy as np
    labels = ["Questions\nFAQ", "Formulaires\nde contact", "Garanties\nclients", "Logos\nclients", "Guides\ntéléchargeables"]
    va = [5, 1, 0, 4, 3]; vb = [7, 3, 6, 0, 3]
    x = np.arange(len(labels)); w = 0.36
    fig, ax = plt.subplots(figsize=(7.4, 3.6))
    ax.bar(x - w / 2, va, w, color="#0E2A47", label=SITE_A)
    ax.bar(x + w / 2, vb, w, color="#C9A227", label=SITE_B)
    ax.set_xticks(x); ax.set_xticklabels(labels, fontsize=9, color="#1F2A37")
    ax.set_ylabel("Nombre", fontsize=10, color="#5B6470"); ax.set_ylim(0, 8)
    ax.yaxis.grid(color="#E3E7ED", linewidth=0.7); ax.set_axisbelow(True)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    for i, (a, b) in enumerate(zip(va, vb)):
        ax.text(i - w / 2, a + 0.12, str(a), ha="center", fontsize=10, fontweight="bold", color="#0E2A47")
        ax.text(i + w / 2, b + 0.12, str(b), ha="center", fontsize=10, fontweight="bold", color="#7A6312")
    leg = ax.legend(frameon=True, fontsize=9.5)
    leg.get_frame().set_edgecolor("#D6DCE4")
    fig.tight_layout()
    p = os.path.join(IMG, "contenus.png"); fig.savefig(p, dpi=200, bbox_inches="tight"); plt.close(fig)
    return p

# ================================================================ HELPERS PDF
def badge(text, bg, width=340):
    t = Table([[Paragraph(f"<font color='white'>{text}</font>", sBadge)]], colWidths=[width])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t

def info_box(title, body, bg=GOLD_L, border=GOLD):
    inner = [
        [Paragraph(f"<b>{title}</b>", ParagraphStyle("ib_t", parent=sBody, textColor=NAVY, alignment=TA_LEFT))],
        [Paragraph(body, ParagraphStyle("ib_b", parent=sBody, alignment=TA_LEFT))],
    ]
    t = Table(inner, colWidths=[468])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 1.2, border),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return t

def h1numbered(num, text):
    t = Table([
        [Paragraph(f"<font color='white'><b>{num}</b></font>",
                   ParagraphStyle("n", parent=sBadge, fontSize=13)),
         Paragraph(f"{text}", sH1)]
    ], colWidths=[30, 440])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), GOLD),
        ("ROUNDEDCORNERS", [5, 5, 5, 5]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (1, 0), (1, 0), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return t

def styled_table(header, rows, col_widths, zebra=True):
    data = [[Paragraph(h, sHead) for h in header]]
    for r in rows:
        data.append([Paragraph(c, sCell) if isinstance(c, str) else c for c in r])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.6, colors.HexColor("#CBD3DD")),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]
    if zebra:
        for i in range(1, len(data)):
            if i % 2 == 0:
                style.append(("BACKGROUND", (0, i), (-1, i), colors.HexColor("#F5F7FA")))
    t.setStyle(TableStyle(style))
    return t

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(GOLD); canvas.setLineWidth(1.2)
    canvas.line(20 * mm, 14 * mm, 190 * mm, 14 * mm)
    canvas.setFont(F, 7.5); canvas.setFillColor(GRAY_TX)
    canvas.drawString(20 * mm, 10.5 * mm, "Comparatif MIRAJ Recouvrement  —  Nouveau site vs Ancien site  •  Septembre 2026")
    canvas.drawRightString(190 * mm, 10.5 * mm, f"Page {doc.page}")
    canvas.restoreState()

def cover_footer(canvas, doc):
    if doc.page == 1:
        canvas.saveState()
        canvas.setFont(F, 8); canvas.setFillColor(colors.white)
        canvas.drawCentredString(105 * mm, 16 * mm, "Document préparé le 16 septembre 2026  •  Analyse des pages d'accueil des deux sites")
        canvas.restoreState()
    else:
        footer(canvas, doc)

# ================================================================ CONTENU
def build():
    p_radar = fig_radar(); p_bars = fig_bars(); p_duel = fig_duel(); p_counts = fig_counts()
    doc = SimpleDocTemplate(PDF_PATH, pagesize=A4,
                            leftMargin=20 * mm, rightMargin=20 * mm,
                            topMargin=16 * mm, bottomMargin=18 * mm,
                            title="Comparatif MIRAJ — Nouveau site vs Ancien site",
                            author="Rapport comparatif")
    S = []

    # ---------------- COUVERTURE ----------------
    S.append(Spacer(1, 22))
    S.append(Paragraph("MIRAJ RECOUVREMENT", ParagraphStyle("cov1", parent=sSub, fontName=FB, fontSize=13,
                                                            textColor=GOLD, spaceAfter=6)))
    S.append(Paragraph("Nouveau site <font color='#C9A227'>vs</font> Ancien site", sTitle))
    S.append(Spacer(1, 4))
    S.append(Paragraph("Le match expliqué simplement, avec des graphiques —<br/>pour que tout le monde comprenne, même sans être informaticien.", sSub))
    S.append(Spacer(1, 10))
    card_a = [[Paragraph("<b><font color='#0E2A47'>SITE A — Le nouveau</font></b><br/><font color='#5B6470'>recouv-weld.vercel.app</font><br/><br/>La refonte moderne,<br/>rapide et claire.", sBodyC)]]
    card_b = [[Paragraph("<b><font color='#7A6312'>SITE B — L'ancien</font></b><br/><font color='#5B6470'>miraj-recouv.com</font><br/><br/>Le site actuel,<br/>riche en contenu.", sBodyC)]]
    tA = Table(card_a, colWidths=[150]); tA.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BLUE_L), ("BOX", (0, 0), (-1, -1), 1.4, NAVY),
        ("ROUNDEDCORNERS", [8, 8, 8, 8]), ("TOPPADDING", (0, 0), (-1, -1), 12), ("BOTTOMPADDING", (0, 0), (-1, -1), 12)]))
    tB = Table(card_b, colWidths=[150]); tB.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GOLD_L), ("BOX", (0, 0), (-1, -1), 1.4, GOLD),
        ("ROUNDEDCORNERS", [8, 8, 8, 8]), ("TOPPADDING", (0, 0), (-1, -1), 12), ("BOTTOMPADDING", (0, 0), (-1, -1), 12)]))
    vs = Paragraph("<b><font color='#C9A227' size=22>VS</font></b>", sBodyC)
    S.append(Table([[tA, vs, tB]], colWidths=[155, 50, 155],
                   style=TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("ALIGN", (0, 0), (-1, -1), "CENTER")])))
    S.append(Spacer(1, 12))
    S.append(badge("VERDICT : le nouveau site gagne  8,2  contre  7,2", NAVY))
    S.append(Spacer(1, 6))
    S.append(Paragraph("…mais l'ancien site contient des trésors à récupérer : garanties, formulaires détaillés, textes pédagogiques.", sBodyC))
    S.append(Spacer(1, 10))
    S.append(info_box("» Comment lire ce rapport ?",
                      "<b>Page 2 :</b> l'essentiel en 1 minute. &nbsp;<b>Pages 3-4 :</b> les notes et graphiques. &nbsp;"
                      "<b>Pages 5-6 :</b> le face-à-face rubrique par rubrique. &nbsp;<b>Pages suivantes :</b> qui gagne quoi, et le plan d'action."))
    S.append(Spacer(1, 8))
    S.append(Paragraph("Concerne : la page d'accueil de chaque site (vitrine principale vue par les clients).", sSmall))
    S.append(PageBreak())

    # ---------------- 1. L'ESSENTIEL ----------------
    S.append(h1numbered("1", "L'essentiel en 1 minute"))
    S.append(Spacer(1, 4))
    S.append(RLImage(p_duel, width=440, height=142))
    S.append(Spacer(1, 4))
    S.append(info_box("» En une phrase",
                      "Le <b>nouveau site accueille mieux le visiteur</b> (message clair en 5 secondes, boutons d'action visibles, "
                      "preuves clients) tandis que l'<b>ancien site explique et rassure davantage</b> (6 garanties, formulaires très complets, "
                      "textes détaillés). <b>Le site idéal = le design du nouveau + le contenu de l'ancien.</b>"))
    S.append(Spacer(1, 6))
    cols = [
        [Paragraph("<b><font color='#0E2A47'>✓ 3 forces du NOUVEAU site</font></b>", sCell),
         Paragraph("<b><font color='#7A6312'>✓ 3 forces de l'ANCIEN site</font></b>", sCell)],
        [Paragraph("1. On comprend l'offre en <b>5 secondes</b> : « Vos impayés recouvrés, honoraires au résultat ».<br/>"
                   "2. <b>Boutons d'action partout</b> : audit gratuit, appeler, WhatsApp.<br/>"
                   "3. <b>Preuves visibles</b> : logos clients, chiffres clés, courbe d'urgence.", sCell),
         Paragraph("1. <b>6 garanties clients</b> détaillées (sur-mesure, pilotage temps réel…).<br/>"
                   "2. <b>Formulaire ultra-complet</b> : vous + débiteur + montant + pièces jointes.<br/>"
                   "3. <b>Textes pédagogiques riches</b> : chaque expertise est vraiment expliquée.", sCell)],
    ]
    t = Table(cols, colWidths=[232, 232])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), BLUE_L), ("BACKGROUND", (1, 0), (1, 0), GOLD_L),
        ("BACKGROUND", (0, 1), (0, 1), colors.white), ("BACKGROUND", (1, 1), (1, 1), colors.white),
        ("BOX", (0, 0), (0, 1), 1.2, NAVY), ("BOX", (1, 0), (1, 1), 1.2, GOLD),
        ("LINEBELOW", (0, 0), (-1, 0), 1, colors.HexColor("#CBD3DD")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    S.append(t)
    S.append(Spacer(1, 6))
    S.append(info_box("! Le point de vigilance",
                      "Le nouveau site a <b>simplifié un peu trop</b> : les garanties et le formulaire détaillé de l'ancien site "
                      "ont disparu. Ce sont pourtant eux qui transforment un visiteur en client. <b>Il faut les réintégrer</b> (voir plan d'action).",
                      bg=RED_L, border=RED))
    S.append(PageBreak())

    # ---------------- 2. MÉTHODE ----------------
    S.append(h1numbered("2", "Comment avons-nous comparé ? (la méthode)"))
    S.append(Spacer(1, 2))
    S.append(Paragraph("Nous avons noté chaque site de <b>0 à 10</b> sur <b>8 critères simples</b>. Voici ce que chaque critère veut dire, en langage courant :", sBody))
    methode = [
        ["<b>1. Clarté du message</b>", "En 5 secondes, comprend-on ce que fait MIRAJ et pour qui ?"],
        ["<b>2. Design &amp; modernité</b>", "Le site donne-t-il envie ? Fait-il professionnel et actuel ?"],
        ["<b>3. Parcours &amp; conversion</b>", "Est-il facile de passer à l'action (appeler, demander un devis) ?"],
        ["<b>4. Contenu &amp; pédagogie</b>", "Le site explique-t-il bien les services, simplement ?"],
        ["<b>5. Preuves &amp; chiffres</b>", "Y a-t-il des chiffres, des clients, des preuves de réussite ?"],
        ["<b>6. Outils interactifs</b>", "Simulateur de coût, graphiques : aident-ils le visiteur à se décider ?"],
        ["<b>7. Confiance &amp; garanties</b>", "Le visiteur se sent-il rassuré (garanties, méthode, transparence) ?"],
        ["<b>8. Formulaires &amp; contact</b>", "Peut-on contacter MIRAJ facilement, et transmettre un dossier complet ?"],
    ]
    S.append(styled_table(["Critère", "Ça veut dire quoi, concrètement ?"], methode, [150, 318]))
    S.append(Spacer(1, 6))
    S.append(Paragraph("Le graphique « radar » ci-dessous superpose les deux sites : <b>plus la surface est grande, meilleur est le site</b>. "
                       "Le bleu marine = nouveau site, l'or = ancien site.", sBody))
    S.append(Spacer(1, 2))
    S.append(RLImage(p_radar, width=440, height=317))
    S.append(Paragraph("Lecture : le nouveau site domine à gauche et en haut (clarté, design, outils) ; l'ancien résiste à droite (contenu, confiance, formulaires).", sSmall))
    S.append(PageBreak())

    # ---------------- 3. DÉTAIL DES NOTES ----------------
    S.append(h1numbered("3", "Les notes en détail"))
    S.append(Spacer(1, 2))
    S.append(RLImage(p_bars, width=440, height=273))
    S.append(Spacer(1, 4))
    details = [
        ("Clarté du message — <b>9,0 vs 6,0</b>",
         "Nouveau : un seul titre choc « Vos impayés, recouvrés » + « Honoraires uniquement au résultat ». "
         "Ancien : 3 slogans qui défilent (« Prenez un temps d'avance… »), trop vagues. <b>Le visiteur pressé préfère le nouveau.</b>"),
        ("Design &amp; modernité — <b>9,0 vs 5,5</b>",
         "Nouveau : mise en page aérée, photos d'équipe, cartes numérotées. Ancien : présentation datée, illustrations génériques. "
         "<b>La première impression profite au nouveau.</b>"),
        ("Parcours &amp; conversion — <b>8,5 vs 6,5</b>",
         "Nouveau : boutons « Audit gratuit » et « Parler à un juriste » dès le premier écran + boutons d'appel permanents. "
         "Ancien : il faut descendre loin pour trouver « Demandez un devis »."),
        ("Contenu &amp; pédagogie — <b>7,5 vs 8,0</b>",
         "Premier point pour l'ancien : chaque expertise est expliquée en profondeur (amiable / judiciaire / suivi…). "
         "Le nouveau va parfois trop vite : des cartes courtes qui donnent faim."),
        ("Preuves &amp; chiffres — <b>8,0 vs 7,5</b>",
         "Les deux affichent 75 % de réussite et +15 ans d'expérience. Le nouveau ajoute des <b>logos clients</b> "
         "(Finex Groupe, Atlas Med…) et une courbe d'urgence qui marque les esprits."),
        ("Outils interactifs — <b>9,0 vs 7,0</b>",
         "Les deux ont un simulateur (« ma facture impayée de 25 000 DT me coûte 166 667 DT de chiffre d'affaires ») "
         "et la courbe « 80 % à 2 mois → 20 % à 12 mois ». Celle du nouveau, avec curseurs et résultat immédiat, est plus percutante."),
        ("Confiance &amp; garanties — <b>7,5 vs 8,5</b>",
         "Point fort de l'ancien : <b>6 garanties explicites</b> (sur-mesure, qualité, pilotage temps réel, honoraires au succès…). "
         "Le nouveau n'a qu'une citation philosophique : c'est beau, mais ça ne rassure pas autant."),
        ("Formulaires &amp; contact — <b>7,0 vs 8,5</b>",
         "Le nouveau affiche bien le téléphone, l'e-mail et l'adresse, avec un formulaire simple. "
         "Mais l'ancien permet de <b>transmettre un vrai dossier</b> (coordonnées du débiteur, montant, pièces jointes) : imbattable."),
    ]
    for title, txt in details:
        S.append(KeepTogether([
            Paragraph(f"› {title}", sH2),
            Paragraph(txt, sBody),
        ]))
    S.append(Spacer(1, 6))

    # ---------------- 4. FACE-À-FACE ----------------
    S.append(h1numbered("4", "Face-à-face, rubrique par rubrique"))
    S.append(Spacer(1, 2))
    S.append(Paragraph("Les 12 rubriques de la page d'accueil, comparées une par une. La dernière colonne dit qui gagne et pourquoi.", sBody))
    S.append(Spacer(1, 2))
    rows = [
        ["Accroche d'accueil", "1 titre clair + preuve + 2 boutons", "3 slogans vagues qui défilent", "<b>A ✓</b>"],
        ["Chiffres clés", "75 % / 48 h / +15 ans / 100 %", "+15 ans / +75 % / 100 %", "<b>Égalité</b>"],
        ["Présentation du cabinet", "Texte court + 4 atouts", "Texte complet (B2B + B2C, secteurs)", "<b>B ✓</b>"],
        ["Les 4 expertises", "Cartes courtes + bouton contact", "Textes détaillés + illustrations", "<b>B</b> (fond) / <b>A</b> (forme)"],
        ["Simulateur du coût", "Curseurs + résultat instantané", "Champs vides à remplir (défaut 0 DT)", "<b>A ✓</b>"],
        ["Taux selon ancienneté", "Courbe 80 % → 20 % + alerte", "Même courbe, bien expliquée", "<b>Égalité</b>"],
        ["Méthode de travail", "4 étapes numérotées, visuelles", "4 puces de texte « démarche »", "<b>A ✓</b>"],
        ["Garanties clients", "— Absentes (à ajouter !)", "6 garanties détaillées", "<b>B ✓</b>"],
        ["Guides gratuits (3)", "Accès direct, 1 clic", "Via formulaire (collecte de contacts)", "<b>A</b> (simple) / <b>B</b> (prospects)"],
        ["Questions fréquentes", "5 questions", "7 questions", "<b>B ✓</b>"],
        ["Contact &amp; formulaires", "Tél + e-mail + adresse + 1 formulaire", "2 formulaires détaillés + envoi de fichiers", "<b>B</b> (fond) / <b>A</b> (rapidité)"],
        ["Preuves clients", "4 logos d'entreprises clientes", "Aucun logo affiché", "<b>A ✓</b>"],
    ]
    S.append(styled_table(["Rubrique", "A — Nouveau", "B — Ancien", "Qui gagne ?"], rows, [105, 125, 125, 113]))
    S.append(Spacer(1, 6))
    S.append(info_box("» Le compte des points",
                      "<b>Nouveau site : 4 victoires franches</b> (accroche, simulateur, méthode, preuves clients) + 3 partages. &nbsp;"
                      "<b>Ancien site : 3 victoires franches</b> (présentation, garanties, FAQ) + 3 partages. &nbsp;"
                      "<b>2 égalités totales.</b> Le nouveau mène, mais sans écraser : l'ancien se défend par son contenu."))
    S.append(PageBreak())

    # ---------------- 5. CONTENU CHIFFRÉ ----------------
    S.append(h1numbered("5", "Les chiffres du contenu (preuves factuelles)"))
    S.append(Spacer(1, 2))
    S.append(Paragraph("Pas d'avis ici, que des comptages : ce graphique montre ce que chaque page d'accueil contient réellement.", sBody))
    S.append(Spacer(1, 2))
    S.append(RLImage(p_counts, width=440, height=214))
    S.append(Spacer(1, 4))
    S.append(Paragraph("› Que faut-il en retenir ?", sH2))
    S.append(Paragraph("<b>FAQ (5 contre 7) :</b> l'ancien répond à 2 questions importantes de plus — « que se passe-t-il si la créance n'est pas récupérée ? » "
                       "et « le débiteur est-il informé ? ». Ce sont exactement les craintes des prospects.", sBullet, bulletText="•"))
    S.append(Paragraph("<b>Formulaires (1 contre 3) :</b> le nouveau va à l'essentiel (nom, téléphone, message), parfait sur mobile. "
                       "Mais seul l'ancien permet d'envoyer un <b>dossier complet avec pièces jointes</b> : c'est un aimant à clients sérieux.", sBullet, bulletText="•"))
    S.append(Paragraph("<b>Garanties (0 contre 6) :</b> le plus gros manque du nouveau site. Les garanties « honoraires au succès » et "
                       "« pilotage temps réel » sont des arguments de vente majeurs.", sBullet, bulletText="•"))
    S.append(Paragraph("<b>Logos clients (4 contre 0) :</b> la plus belle prise du nouveau site. Voir de vrais noms d'entreprises "
                       "rassure instantanément : « s'ils leur font confiance, je peux aussi ».", sBullet, bulletText="•"))
    S.append(Paragraph("<b>Guides (3 contre 3) :</b> égalité sur le nombre, mais stratégies opposées : accès libre (nouveau) contre "
                       "échange e-mail (ancien). L'idéal : accès libre pour 1 guide, formulaire pour les 2 autres.", sBullet, bulletText="•"))
    S.append(PageBreak())

    # ---------------- 6. FORCES DU NOUVEAU ----------------
    S.append(h1numbered("6", "Ce que le nouveau site fait mieux (à garder absolument)"))
    S.append(Spacer(1, 2))
    forces_a = [
        ("1. Une accroche comprise en 5 secondes",
         "« Vos impayés, <i>recouvrés</i>. Votre trésorerie, protégée. » + « Honoraires uniquement au résultat. » "
         "Pourquoi c'est important : <b>8 visiteurs sur 10 ne lisent que le premier écran</b>. Si le message n'est pas clair immédiatement, ils partent.",
         "Ancien site : 3 slogans abstraits (« Prenez un temps d'avance… ») qui n'expliquent rien."),
        ("2. Des boutons d'action partout",
         "« Demander un audit gratuit », « Parler à un juriste », boutons Appeler / Devis toujours visibles. "
         "Pourquoi c'est important : chaque écran donne une <b>occasion de devenir client</b>, sans chercher le contact.",
         "Ancien site : le bouton « Demandez un devis » est enterré en bas de page."),
        ("3. Des preuves qui rassurent vite",
         "Logos de 4 entreprises clientes + bandeau « 75 % de réussite / prise en charge sous 48 h ». "
         "Pourquoi c'est important : un prospect croit plus facilement <b>ce que d'autres clients ont vécu</b> que de belles promesses.",
         "Ancien site : aucun nom de client visible."),
        ("4. Un simulateur qui fait peur (dans le bon sens)",
         "Curseurs simples : « 25 000 DT d'impayés à 15 % de marge = 166 667 DT de chiffre d'affaires à refaire ». "
         "Pourquoi c'est important : le visiteur <b>ressent le coût de l'inaction</b> et veut agir tout de suite.",
         "Ancien site : mêmes calculs, mais champs vides peu engageants."),
        ("5. Un parcours en 4 étapes limpide",
         "Audit → Amiable → Judiciaire → Suivi. Pourquoi c'est important : le client <b>se projette</b> (« voilà ce qui va m'arriver ») "
         "au lieu de se perdre dans du jargon juridique.",
         "Ancien site : informations équivalentes mais noyées dans du texte."),
    ]
    for title, txt, vs_txt in forces_a:
        S.append(Paragraph(f"› {title}", sH2))
        S.append(Paragraph(txt, sBody))
        S.append(Paragraph(f"<i>{vs_txt}</i>", ParagraphStyle("vs", parent=sBody, textColor=GRAY_TX, fontSize=9.5)))
        S.append(Spacer(1, 2))
    S.append(PageBreak())

    # ---------------- 7. TRÉSORS DE L'ANCIEN ----------------
    S.append(h1numbered("7", "Ce qu'il faut récupérer de l'ancien site (les trésors)"))
    S.append(Spacer(1, 2))
    S.append(Paragraph("Le nouveau site est plus beau, mais en simplifiant, il a jeté des pépites. Voici les 5 contenus de l'ancien site "
                       "à réintégrer en priorité — expliqués pour des non-spécialistes :", sBody))
    tresors = [
        ("1. Les 6 garanties clients — LA priorité",
         "Sur-mesure, Qualité, Pilotage en temps réel, Honoraires au succès, Tact dans la négociation, Expertise. "
         "En langage simple : <b>« voilà tout ce que nous vous promettons, par écrit »</b>. C'est la rubrique qui transforme un hésitant en client.",
         "Comment faire : ajouter une section « Nos 6 garanties » avec 6 cartes, juste après la méthode."),
        ("2. Le formulaire « Confiez-nous votre recouvrement »",
         "Il demande : qui êtes-vous, qui est le débiteur, quel montant, et permet de <b>joindre les factures</b>. "
         "En langage simple : au lieu d'un simple « contactez-nous », le client <b>dépose directement son dossier</b>. Moins d'allers-retours, plus de dossiers sérieux.",
         "Comment faire : garder le formulaire simple actuel + ajouter un bouton « Déposer un dossier complet » qui ouvre ce formulaire."),
        ("3. Les textes détaillés des 4 expertises",
         "L'ancien explique vraiment chaque service (ex. : relance préventive vs curative, amiable vs judiciaire). "
         "En langage simple : c'est la différence entre un menu qui dit « poisson » et un menu qui décrit le plat. <b>Le détail vend.</b>",
         "Comment faire : sous chaque carte expertise, un lien « En savoir plus » qui déplie le texte complet de l'ancien site."),
        ("4. Les 2 questions FAQ manquantes",
         "« Que se passe-t-il si la créance n'est pas récupérée ? » et « Le débiteur est-il informé ? ». "
         "En langage simple : ce sont <b>les deux peurs n°1 des prospects</b>. Y répondre d'avance, c'est déjà à moitié vendre.",
         "Comment faire : passer la FAQ de 5 à 7 questions en reprenant ces réponses."),
        ("5. Le formulaire avant téléchargement des guides",
         "L'ancien demande nom, téléphone, entreprise et e-mail avant d'offrir les guides. "
         "En langage simple : <b>chaque guide téléchargé = un nouveau contact commercial</b> à rappeler. Offrir sans rien demander, c'est perdre des prospects.",
         "Comment faire : 1 guide en accès libre (pour la confiance) + formulaire pour les 2 autres (pour les contacts)."),
    ]
    for title, txt, how in tresors:
        S.append(Paragraph(f"› {title}", sH2))
        S.append(Paragraph(txt, sBody))
        S.append(Paragraph(f"<b>→ {how}</b>", ParagraphStyle("how", parent=sBody, textColor=NAVY2, fontSize=9.5)))
        S.append(Spacer(1, 2))
    S.append(PageBreak())

    # ---------------- 8. PLAN D'ACTION + CONCLUSION ----------------
    S.append(h1numbered("8", "Plan d'action : le site idéal en 8 étapes"))
    S.append(Spacer(1, 2))
    S.append(Paragraph("Concrètement, que faire ? Voici les actions classées par priorité, avec l'effort estimé (Facile / Moyen) :", sBody))
    S.append(Spacer(1, 2))
    plan = [
        ["<b>Haute</b>", "Ajouter les 6 garanties de l'ancien site", "C'est l'argument de vente n°1 qui manque.", "Facile"],
        ["<b>Haute</b>", "Ajouter le formulaire « dossier complet » + pièces jointes", "Capte des clients sérieux, prêts à signer.", "Moyen"],
        ["<b>Haute</b>", "Bouton « En savoir plus » sous chaque expertise", "Le détail des textes de l'ancien site, sans alourdir.", "Facile"],
        ["<b>Moyenne</b>", "Passer la FAQ de 5 à 7 questions", "Répond aux 2 grandes peurs des prospects.", "Facile"],
        ["<b>Moyenne</b>", "Formulaire avant 2 guides sur 3", "Chaque téléchargement devient un prospect.", "Facile"],
        ["<b>Moyenne</b>", "Numéro cliquable + WhatsApp partout", "En Tunisie, beaucoup préfèrent appeler ou WhatsApp.", "Facile"],
        ["<b>Basse</b>", "Page « Honoraires au succès » détaillée", "Expliquer les % par palier, en toute transparence.", "Moyen"],
        ["<b>Basse</b>", "Version arabe + anglaise de l'essentiel", "Marché tunisien et clients internationaux.", "Moyen"],
    ]
    S.append(styled_table(["Priorité", "Action", "Pourquoi ?", "Effort"], plan, [70, 165, 175, 58]))
    S.append(Spacer(1, 8))
    S.append(h1numbered("9", "Conclusion"))
    S.append(Spacer(1, 2))
    S.append(Paragraph("« Faut-il remplacer l'ancien site par le nouveau ? » <b>Oui — à condition de ne pas partir les mains vides.</b>", sBody))
    S.append(Paragraph("Le nouveau site (8,2/10) est un bien meilleur <b>accueil</b> : il accroche, prouve et convertit. "
                       "L'ancien site (7,2/10) est un bien meilleur <b>argumentaire</b> : il explique, rassure et collecte des dossiers complets. "
                       "Le gagnant du match n'est donc ni A ni B : c'est le <b>site fusionné</b> — la carrosserie du nouveau, le moteur de l'ancien.",
                       sBody))
    S.append(Spacer(1, 4))
    S.append(Paragraph("« Une stratégie efficace repose sur l'équilibre entre fermeté et flexibilité. » — La philosophie Miraj s'applique aussi à son site web : "
                       "la fermeté d'un design moderne, la flexibilité d'un contenu riche.", sQuote))
    S.append(Spacer(1, 8))
    S.append(info_box("» Prochaines étapes proposées",
                      "1. Valider ce rapport avec l'équipe. &nbsp;2. Réintégrer les 3 actions <b>Haute</b> en priorité. &nbsp;"
                      "3. Re-tester le site auprès de 3 clients (« comprends-tu en 5 secondes ? »). &nbsp;4. Mettre en ligne et mesurer les demandes de devis.",
                      bg=BLUE_L, border=NAVY))
    S.append(Spacer(1, 6))
    S.append(Paragraph("Sources : page d'accueil de recouv-weld.vercel.app et de miraj-recouv.com, consultées le 16 septembre 2026. "
                       "Notes indicatives établies par analyse comparative du contenu, de la structure et du parcours utilisateur.",
                       sSmall))

    doc.build(S, onFirstPage=cover_footer, onLaterPages=cover_footer)
    print("PDF généré :", PDF_PATH)

if __name__ == "__main__":
    build()
