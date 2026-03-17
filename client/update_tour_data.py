import json
import re
import base64
import os

tour_data_path = "/home/keshav/Desktop/JourneyTOBMW/_kiosk/client/public/virtual-tour/js/tourData.js"

if not os.path.exists(tour_data_path + ".bak"):
    with open(tour_data_path, "r", encoding="utf-8") as f:
        backup_content = f.read()
    with open(tour_data_path + ".bak", "w", encoding="utf-8") as f_out:
        f_out.write(backup_content)

with open(tour_data_path, "r", encoding="utf-8") as f:
    content = f.read()

# Pattern for leadgen and config properties in the JS file
# They appear as keys in a JSON-like object, likely quoted key: "leadgen":"..." and "config":"..."
# We use flexible regex to allow quotes or no quotes around key.
leadgen_pattern = r'(?:"leadgen"|leadgen):\s*"((?:[^"\\]|\\.)*)"'
config_pattern = r'(?:"config"|config):\s*"((?:[^"\\]|\\.)*)"'

def update_leadgen(match):
    raw_str = match.group(1)
    
    # Unescape JS string for JSON parsing
    json_str_content = raw_str.replace('\\"', '"').replace('\\\\', '\\')
    
    try:
        data = json.loads(json_str_content)
        
        # Modify
        data['logo'] = None
        data['enabled'] = False
        
        # Serialize and re-escape
        new_json_str = json.dumps(data)
        escaped_for_js = new_json_str.replace('\\', '\\\\').replace('"', '\\"')
        
        # Determine original quote style for key (capture exact prefix if needed, or reconstruct)
        # We just reconstruct the matched key part based on the input match.group(0).
        # But simpler to just return hardcoded key prefix if we know it works,
        # OR we can assume quoted key since grep showed it.
        # But for safety, let's reconstruct key.
        original_match = match.group(0)
        key_part = original_match.split(':')[0]
        
        return f'{key_part}:"{escaped_for_js}"'
    except Exception as e:
        print(f"Error parse leadgen: {e}")
        return match.group(0)

def update_config(match):
    raw_str = match.group(1)
    json_str_content = raw_str.replace('\\"', '"').replace('\\\\', '\\')
    
    try:
        data = json.loads(json_str_content)
        
        # Modifications
        data['ambience'] = None
        data['audioHotspots'] = False
        data['toggleHotspots'] = False
        
        # CSS injection
        new_css = """
        /* Hide Logo */
        .cloudpano-ui-logo, .leadgen-logo, .leadgen-logo-container, img[src*="logo"], div[class*="logo"] { display: none !important; }
        
        /* Hide Buttons */
        [title="Fullscreen"], .fullscreen-btn, .cloudpano-ui-icon-fullscreen, .icon-fullscreen { display: none !important; }
        [title="Mute"], .sound-btn, .cloudpano-ui-icon-sound, .cloudpano-ui-icon-mute, .icon-sound, .icon-mute { display: none !important; }
        [title="VR"], .vr-btn, .cloudpano-ui-icon-vr, .cloudpano-ui-icon-gyro, .icon-vr, .icon-gyro { display: none !important; }
        [title="Hide Controls"], .hide-controls-btn, .cloudpano-ui-icon-hide, .icon-hide { display: none !important; }
        
        /* Generic control container if all fail (but check if this hides navigation too?) */
        /* .cloudpano-ui-controls-right { display: none !important; } */
        """
        
        existing_css_b64 = data.get('customCSS', '')
        final_css = new_css
        if existing_css_b64:
            try:
                decoded = base64.b64decode(existing_css_b64).decode('utf-8')
                # Append new CSS
                if new_css not in decoded:
                    final_css = decoded + "\n" + new_css
                else:
                    final_css = decoded # don't duplicate
            except:
                pass
        
        # Encode CSS
        encoded_css = base64.b64encode(final_css.encode('utf-8')).decode('utf-8')
        data['customCSS'] = encoded_css
        
        # Serialize and Escape
        new_json_str = json.dumps(data)
        escaped_for_js = new_json_str.replace('\\', '\\\\').replace('"', '\\"')
        
        original_match = match.group(0)
        key_part = original_match.split(':')[0]
        
        return f'{key_part}:"{escaped_for_js}"'
    except Exception as e:
        print(f"Error parse config: {e}")
        return match.group(0)

new_content = re.sub(leadgen_pattern, update_leadgen, content)
new_content = re.sub(config_pattern, update_config, new_content)

if content == new_content:
    print("Warning: No changes made. Patterns might not match.")
else:
    with open(tour_data_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully updated tourData.js")

