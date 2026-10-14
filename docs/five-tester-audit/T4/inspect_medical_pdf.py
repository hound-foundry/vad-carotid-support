import pdfplumber, pypdfium2 as pdfium
src = r'C:\Work\VAD CAD app\docs\five-tester-audit\T4\medical-card-export.pdf'
out = r'C:\Work\VAD CAD app\docs\five-tester-audit\T4'
with pdfplumber.open(src) as pdf:
    text = '\n\n'.join((p.extract_text() or '') for p in pdf.pages)
    with open(out + r'\medical-card-export-extracted.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print('pages=', len(pdf.pages))
    print(text)
doc = pdfium.PdfDocument(src)
page = doc[0]
page.render(scale=1.5).to_pil().save(out + r'\medical-card-export-page1.png')
