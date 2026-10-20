"""Build dependency-free GitHub Pages output, merging Markdown into the archive."""
from pathlib import Path
import json,shutil,hashlib,re
ROOT=Path(__file__).resolve().parents[1]

def parse(path,category):
    text=path.read_text(encoding='utf-8-sig').replace('\r\n','\n')
    if not text.startswith('---\n'):raise ValueError(f'{path}: 缺少文件头，请参考 README.md 中的元信息示例')
    parts=text.split('\n---\n',1)
    if len(parts)!=2:raise ValueError(f'{path}: 文件头缺少结束分隔线')
    meta={}
    for line in parts[0][4:].splitlines():
        if not line.strip() or line.lstrip().startswith('#'):continue
        key,sep,value=line.partition(':')
        if not sep:raise ValueError(f'{path}: 无效元信息行 {line}')
        try:meta[key.strip()]=json.loads(value.strip())
        except json.JSONDecodeError:meta[key.strip()]=value.strip()
    if not isinstance(meta.get('published',True),bool):raise ValueError(f'{path}: published 只能是 true 或 false')
    if not meta.get('published',True):return None
    for key in ['title','date']:
        if not isinstance(meta.get(key),str) or not meta[key].strip():raise ValueError(f'{path}: 缺少 {key}')
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}',meta['date']):raise ValueError(f'{path}: 日期需要 YYYY-MM-DD')
    if not parts[1].strip():raise ValueError(f'{path}: 正文为空')
    if category=='fiction':
        if not isinstance(meta.get('novelTitle'),str) or not meta['novelTitle'].strip():raise ValueError(f'{path}: 请填写 novelTitle 作品名称')
        if type(meta.get('chapterNumber')) is not int or meta['chapterNumber']<1:raise ValueError(f'{path}: chapterNumber 必须是正整数')
    meta.update(category=category,markdown=parts[1].strip(),label='FICTION / 小说' if category=='fiction' else 'BLOG / 随笔')
    meta.setdefault('id',hashlib.sha256(str(path.relative_to(ROOT)).encode()).hexdigest()[:32])
    meta.setdefault('summary','')
    return meta

def build():
    archive=json.loads((ROOT/'site/writing-base.json').read_text(encoding='utf-8'));seen=set()
    for cat in ['blog','fiction']:
        for path in sorted((ROOT/'content'/cat).glob('*.md')):
            entry=parse(path,cat)
            if entry:
                if entry['id'] in seen:raise ValueError(f'重复文章 ID: {entry["id"]}。修改已有文章时请覆盖原文件；新文章请使用新的 ID。')
                seen.add(entry['id']);archive[cat].append(entry)
        archive[cat].sort(key=lambda e:e['date'],reverse=True)
    output=ROOT/'_site'
    if output.is_symlink() or output.resolve().parent!=ROOT.resolve():raise ValueError('Unsafe generated output path')
    if output.exists():shutil.rmtree(output)
    output.mkdir()
    # Never copy source Markdown or draft files into the published artifact.
    for path in (ROOT/'site').rglob('*'):
        if path.is_file() and path.name not in ['writing-base.json','writing.json']:
            target=output/path.relative_to(ROOT/'site');target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(path,target)
    (output/'writing.json').write_text(json.dumps(archive,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Built _site:',{k:len(v) for k,v in archive.items()})
if __name__=='__main__':build()
