import json
import re

with open('client/public/virtual-tour/js/tourData.js', 'r') as f:
    content = f.read()

# the file content is something like `var tourData = {...};`
m = re.search(r'var\s+tourData\s*=\s*(\{.*?\});\n?', content, re.DOTALL)
if m:
    data = json.loads(m.group(1))
    images = json.loads(data['images'])
    
    found = 0
    for img in images:
        if 'hotspots' in img:
            new_hotspots = []
            for hotspot in img['hotspots']:
                if ('image' in hotspot and hotspot['image'] and 'title' in hotspot['image']) or 'title' in hotspot:
                    title = hotspot.get('title', '')
                    img_title = hotspot.get('image', {}).get('title', '') if hotspot.get('image') else ''
                    if title == 'Library Entry' or img_title == 'Library Entry':
                        found += 1
                        continue # remove it
                new_hotspots.append(hotspot)
            img['hotspots'] = new_hotspots

    print(f"Removed {found} hotspots pointing to Library Entry.")
    
    data['images'] = json.dumps(images)
    new_content = content[:m.start()] + 'var tourData = ' + json.dumps(data, separators=(',', ':')) + ';' + content[m.end():]
    with open('client/public/virtual-tour/js/tourData.js', 'w') as f:
        f.write(new_content)
        print("Updated tourData.js")
