#!/usr/bin/env python3
"""Convert a WakaTime raw heartbeat export into privacy-safe daily aggregates."""
import argparse, json, math
from collections import defaultdict
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from pathlib import Path

p=argparse.ArgumentParser()
p.add_argument('input', help='Path to the private WakaTime JSON export')
p.add_argument('--output', default='data/coding-activity.json')
a=p.parse_args()
decoder=json.JSONDecoder()
# Only known, non-identifying dimension names can leave the export.
langs={x.lower():x for x in ['TypeScript','JavaScript','Python','JSON','HTML','CSS','SCSS','Sass','Markdown','SQL','Java','Go','Rust','C','C++','C#','Ruby','PHP','Shell','Bash','YAML','XML','Docker','Dockerfile','Kotlin','Swift','Dart','Vue.js','TSX','JSX','GraphQL','Text','Git Config','Other']}
cats={x.lower():x for x in ['Coding','AI Coding','Debugging','Writing Docs','Writing Tests','Building','Code Reviewing','Browsing','Learning','Designing','Communicating','Meeting','Researching','Other']}
with open(a.input,encoding='utf-8') as f:
    prefix=''
    while '"days": [' not in prefix:
        part=f.read(65536)
        if not part: raise ValueError('No days array found')
        prefix+=part
    user=decoder.raw_decode(prefix[prefix.index('"user":')+7:].lstrip())[0]
    timeout=float(user.get('timeout') or 15)*60
    tz=ZoneInfo(user.get('timezone') or 'UTC')
    buf=prefix.split('"days": [',1)[1]
    records={}; count=0; day_count=0; last_date=''; prev=None
    def dayrec(date):
        if date not in records: records[date]={'date':date,'seconds':0,'languages':defaultdict(float),'categories':defaultdict(float),'heartbeats':0,'writes':0}
        return records[date]
    def add_interval(start,end,language,category):
        while start < end:
            dt=datetime.fromtimestamp(start,tz)
            boundary=datetime.combine(dt.date()+timedelta(days=1),datetime.min.time(),tz).timestamp()
            stop=min(end,boundary); seconds=stop-start
            d=dayrec(dt.date().isoformat()); d['seconds']+=seconds; d['languages'][language]+=seconds; d['categories'][category]+=seconds
            start=stop
    while True:
        buf=buf.lstrip()
        if buf.startswith(','): buf=buf[1:].lstrip()
        if buf.startswith(']'): break
        try: day,n=decoder.raw_decode(buf)
        except json.JSONDecodeError:
            chunk=f.read(1024*1024)
            if not chunk: raise ValueError('Incomplete or invalid days array')
            buf+=chunk; continue
        buf=buf[n:]; day_count+=1
        date=day['date']
        if date < last_date: raise ValueError('Days are not ordered chronologically')
        last_date=date
        events=sorted(day.get('heartbeats',[]),key=lambda x:x.get('time',0))
        for h in events:
            timestamp=h.get('time')
            if not isinstance(timestamp,(int,float)) or not math.isfinite(timestamp): raise ValueError('Invalid heartbeat timestamp')
            if prev and timestamp < prev[0]: raise ValueError('Heartbeats cross day boundaries out of order')
            lang=langs.get(str(h.get('language') or '').lower(),'Other')
            cat=cats.get(str(h.get('category') or '').lower(),'Other')
            if prev and 0 < timestamp-prev[0] <= timeout: add_interval(prev[0],timestamp,prev[1],prev[2])
            actual_date=datetime.fromtimestamp(timestamp,tz).date().isoformat()
            d=dayrec(actual_date); d['heartbeats']+=1; d['writes']+=bool(h.get('is_write'))
            prev=(timestamp,lang,cat); count+=1
        dayrec(date)
    # Never include the raw user, heartbeat, file, project, branch, machine or dependency fields.
    for d in records.values():
        d['seconds']=round(d['seconds'],2)
        for k in ('languages','categories'): d[k]={name:round(value,2) for name,value in sorted(d[k].items()) if value>0}
    out={'version':1,'timezone':str(tz),'timeoutSeconds':timeout,'eventCount':count,'exportDayCount':day_count,'days':sorted(records.values(),key=lambda x:x['date'])}
    target=Path(a.output); target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(out,separators=(',',':'))+'\n',encoding='utf-8')
    print(f"Processed {count:,} heartbeats across {day_count:,} export days into {len(records):,} daily records ({out['days'][0]['date']} to {out['days'][-1]['date']}).")
