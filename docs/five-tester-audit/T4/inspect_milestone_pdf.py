import pdfplumber, pypdfium2 as pdfium
src = r'C:\Work\VAD CAD app\docs\five-tester-audit\T4\milestone-card-export.pdf'
out = r'C:\Work\VAD CAD app\docs\five-tester-audit\T4'
with pdfplumber.open(src) as pdf:
    text = '\n\n'.join((p.extract_text() or '') for p in pdf.pages)
    with open(out + r'\milestone-card-pdf-extracted.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print('pages=', len(pdf.pages))
    print(text)
doc = pdfium.PdfDocument(src)
doc[0].render(scale=1.5).to_pil().save(out + r'\milestone-card-pdf-page1.png')
