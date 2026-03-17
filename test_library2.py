import json

filepath = 'client/public/virtual-tour/js/tourData.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

prefix = 'var tourData = '
if text.startswith(prefix):
    json_str = text[len(prefix):].rstrip(';')
else:
    print("Prefix not found!")
    exit(1)

data = json.loads(json_str)

initial_count = len(data.get('images', []))
data['images'] = [img for img in data.get('images', []) if img.get('title') != 'Library Entry']
final_count = len(data.get('images', []))

print(f"Removed {initial_count - final_count} scenes. Initial: {initial_count}, Final: {final_count}")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(prefix + json.dumps(data, separators=(',', ':')) + ';')

print("Updated tourData.js")
