import os
import glob

block = """<div class="social-icons">
    <a href="https://www.linkedin.com" target="_blank" rel="noopener" class="social-icon-link" aria-label="LinkedIn">
        <ion-icon name="logo-linkedin"></ion-icon>
    </a>
    <a href="https://www.facebook.com" target="_blank" rel="noopener" class="social-icon-link" aria-label="Facebook">
        <ion-icon name="logo-facebook"></ion-icon>
    </a>
    <a href="https://www.instagram.com" target="_blank" rel="noopener" class="social-icon-link" aria-label="Instagram">
        <ion-icon name="logo-instagram"></ion-icon>
    </a>
</div>"""

files = glob.glob('public/*.html')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    if block in content:
        content = content.replace(block, "")
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Removed from {f}")
    else:
        print(f"Not found in {f}")
