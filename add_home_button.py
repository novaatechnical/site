import os
import glob

files = glob.glob('public/*.html')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    modified = False
    
    # 1. Add to mobile dropdown
    dropdown_target = '<ul class="dropdown-menu mobile-dropdown text-bg-dark border-0 shadow">'
    dropdown_addition = dropdown_target + '\n            <li><a class="dropdown-item text-white" href="index.html">Home</a></li>'
    # Use exact check to avoid double-adding
    if dropdown_target in content and '<li><a class="dropdown-item text-white" href="index.html">Home</a></li>' not in content:
        content = content.replace(dropdown_target, dropdown_addition)
        modified = True
        
    # 2. Add to offcanvas sidebar
    sidebar_target = '<ul class="nav flex-column">'
    sidebar_addition = sidebar_target + '\n\n            <li class="nav-item">\n                <a class="nav-link text-white" href="index.html">Home</a>\n            </li>'
    
    # We must be careful because sidebar_target might occur elsewhere if there's multiple navs.
    # But usually <ul class="nav flex-column"> in the offcanvas is unique. Let's replace only the first occurrence just in case, or just replace all.
    # It's unique enough for the sidebar.
    if sidebar_target in content and 'href="index.html">Home</a>\n            </li>' not in content:
        # Just replace the first instance
        content = content.replace(sidebar_target, sidebar_addition, 1)
        modified = True
        
    if modified:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
    else:
        print(f"No changes needed for {f}")
