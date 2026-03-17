import json
import os

tour_data_path = "client/public/virtual-tour/js/tourData.js"

with open(tour_data_path, "r", encoding="utf-8") as f:
    content = f.read()

if content.startswith("var tourData ="):
    prefix = "var tourData ="
    json_str = content[len(prefix):].strip()
    suffix = ""
    if json_str.endswith(";"):
        suffix = ";"
        json_str = json_str[:-1]

    data = json.loads(json_str)
    
    # Process config
    if "config" in data:
        config_data = json.loads(data["config"])
        config_data["showSplashScreen"] = False
        data["config"] = json.dumps(config_data, separators=(',', ':'))

    new_content = f"{prefix} {json.dumps(data, separators=(',', ':'))}{suffix}"

    with open(tour_data_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully updated tourData.js showSplashScreen to false.")
else:
    print("Could not find start of tourData.")
