import glob

block = """            <a href="index.html" class="btn text-white d-flex align-items-center gap-2 text-decoration-none" aria-label="Home">
            <ion-icon name="home-outline" size="large"></ion-icon>
            <span style="font-family: var(--ff-oxanium); font-weight: var(--fw-600);">
                HOME
            </span>
            </a>"""

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
        print(f"Not found in {f} - Check formatting.")
