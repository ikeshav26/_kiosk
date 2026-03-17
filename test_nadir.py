import json
import re

with open("client/public/virtual-tour/js/tourData.js", "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r'var tourData = (\{.*\});?$', content, re.DOTALL)
if match:
    data = json.loads(match.group(1))
    
    if 'images' in data and isinstance(data['images'], str):
        images_array = json.loads(data['images'])
        
        for img in images_array:
            if 'nadir' in img:
                print("Removing nadir from image", img['id'])
                del img['nadir']
            
            if 'config' in img and isinstance(img['config'], str) and 'nadir' in img['config']:
                print("Found nadir in config string for image", img['id'])
                config_data = json.loads(img['config'])
                if 'nadir' in config_data:
                    del config_data['nadir']
                img['config'] = json.dumps(config_data)

            if 'config' in img and isinstance(img['config'], dict) and 'nadir' in img['config']:
                print("Removing nadir from config dict for image", img['id'])
                del img['config']['nadir']
                
        data['images'] = json.dumps(images_array, separators=(',', ':'))
        
    new_json_str = json.dumps(data, separators=(',', ':'))
    new_content = 'var tourData = ' + new_json_str + ';'
    with open("client/public/virtual-tour/js/tourData.js", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Done stripping nadir from images array!")
