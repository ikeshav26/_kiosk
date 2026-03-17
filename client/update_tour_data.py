import json
import re
import os

tour_data_path = "/home/keshav/Desktop/JourneyTOBMW/_kiosk/client/public/virtual-tour/js/tourData.js"

if not os.path.exists(tour_data_path + ".bak"):
    with open(tour_data_path, "r", encoding="utf-8") as f:
        backup_content = f.read()
    with open(tour_data_path + ".bak", "w", encoding="utf-8") as f_out:
        f_out.write(backup_content)

with open(tour_data_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace \"contacts\":\"{...}\" with \"contacts\":\"{}\"
# Replace \"logo\":\"logo.png\" with \"logo\":\"\"
# The data is inside a JS file: var tourData = {...};

import re

# We will just do a regex replace for the logo and contacts properties directly in the text file
# Since it's a huge single-line JS variable.

# Remove logo
content = re.sub(r'("logo"\s*:\s*)"(?:[^"\\]|\\.)*"', r'\1""', content)

# Remove contacts
content = re.sub(r'("contacts"\s*:\s*)"(?:[^"\\]|\\.)*"', r'\1"{}"', content)


with open(tour_data_path, "w", encoding="utf-8") as f:
    f.write(content)

print("done")
