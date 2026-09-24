import json,subprocess,sys,html
from bs4 import BeautifulSoup
routes=sys.argv[1:]
out={}
for r in routes:
    dom=subprocess.run(['timeout','30','google-chrome','--headless=new','--no-sandbox','--disable-gpu','--virtual-time-budget=8000','--dump-dom','http://localhost:4173'+r],capture_output=True,text=True).stdout
    s=BeautifulSoup(dom,'lxml')
    g=lambda sel,attr='content': (s.select_one(sel) or {}).get(attr,'') if s.select_one(sel) else ''
    t0=s.select_one('#json-ld-schema'); ld=t0.string if t0 and t0.string else ''
    root=s.select_one('#root')
    for bad in root.select('script,style,svg,noscript,form,button,[aria-hidden="true"]'): bad.decompose()
    parts=[];seen=set();n=0
    for el in root.find_all(['h1','h2','h3','p','li','a']):
        t=' '.join(el.get_text(' ',strip=True).split())
        if el.name=='a':
            h=el.get('href','')
            if h.startswith('/') and t and (h,t) not in seen:
                seen.add((h,t)); parts.append(f'<a href="{html.escape(h)}">{html.escape(t)}</a>')
            continue
        if not t or len(t)<3 or t in seen: continue
        if el.name in('p','li') and el.find_parent(['a']): continue
        seen.add(t); n+=len(t)
        if n>6000 and el.name!='h1': continue
        parts.append(f'<{el.name}>{html.escape(t)}</{el.name}>')
    out[r]={'title':s.title.string if s.title else '','description':g('meta[name="description"]'),'image':g('meta[property="og:image"]'),'robots':g('meta[name="robots"]'),'jsonld':ld,'body':'\n'.join(parts)}
    print(r,len(out[r]['body']),out[r]['title'][:70],file=sys.stderr)
json.dump(out,open('scripts/prerender-routes.json','w'),ensure_ascii=False,indent=1)
