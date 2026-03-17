import re

with open("client/public/virtual-tour/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure we don't duplicate
if '<!-- PATCH -->' not in content:
    custom_scripts = """
    <!-- PATCH -->
    <style>
    /* Aggressively hide typical right-side controls */
    div[class*="ControlsRight" i], 
    div[class*="RightPanel" i], 
    div[class*="Fullscreen" i], 
    div[class*="VRControl" i], 
    div[class*="VrControl" i], 
    button[class*="fullscreen" i], 
    button[class*="vr-btn" i],
    a[class*="vr" i],
    [title="Fullscreen" i],
    [title="VR Mode" i],
    [title="Hide Controls" i] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }
    
    /* Aggressively hide mouse animation overlay */
    div[class*="SplashScreen" i],
    div[class*="Overlay" i],
    div[class*="Instructions" i],
    [class*="AnimatedMouse" i],
    img[src*="mouse" i],
    .icon-mouse {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }
    </style>
    <script>
    // MutationObserver to brutally remove elements matching the user criteria dynamically
    (function(){
        const observer = new MutationObserver(mutations => {
            const elements = document.querySelectorAll("div, span, p, button, a");
            elements.forEach(el => {
                const text = el.innerText ? el.innerText.toLowerCase() : "";
                if (text.includes("drag to explore") || text.includes("click and drag") || text.includes("animated mouse")) {
                    el.style.display = "none";
                }
                
                // If it's a right-side button group, they are usually in the middle right
                const rect = el.getBoundingClientRect();
                if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.className.toLowerCase().includes('icon')) {
                    if (rect.right > window.innerWidth - 60 && rect.top > window.innerHeight / 3 && rect.bottom < window.innerHeight * 0.7 && rect.width < 100) {
                        try {
                           const classN = (el.className || "").toString().toLowerCase();
                           if (classN.includes("control") || classN.includes("btn") || classN.includes("icon")) {
                               // el.style.display = "none";
                           }
                        } catch(e) {}
                    }
                }
                
                // Hide exact titles just in case
                if (["fullscreen", "hide controls", "virtual reality", "enter vr", "vr mode"].includes((el.title || "").toLowerCase())) {
                    el.style.display = "none";
                }
            });
            
            // Try to find the three right buttons based on their exact typical DOM presence
            const rightControls = document.querySelectorAll('div[class*="right" i] > div, div[class*="Right" i] > div, div[style*="right: 0"]');
            rightControls.forEach(el => {
                if(el.children.length === 3 || el.childElementCount === 3 || el.children.length === 2) {
                   const txt = el.innerHTML.toLowerCase();
                   if(txt.includes('fullscreen') || txt.includes('vr') || txt.includes('hide')) {
                       el.style.display = "none";
                   }
                }
            });
        });
        
        document.addEventListener("DOMContentLoaded", () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    })();
    </script>
    </head>
"""
    content = content.replace("</head>", custom_scripts)
    
    with open("client/public/virtual-tour/index.html", "w", encoding="utf-8") as f:
        f.write(content)
