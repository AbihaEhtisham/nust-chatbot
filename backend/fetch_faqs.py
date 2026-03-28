import requests
from bs4 import BeautifulSoup

url = "https://nust.edu.pk/faqs/"
response = requests.get(url, timeout=10)
soup = BeautifulSoup(response.text, "html.parser")

# Remove nav, footer, scripts — keep only main content
for tag in soup(["script", "style", "nav", "footer", "header"]):
    tag.decompose()

text = soup.get_text(separator="\n")

# Clean up blank lines
lines = [line.strip() for line in text.splitlines() if line.strip()]
clean_text = "\n".join(lines)

with open("data/nust_faqs.txt", "w", encoding="utf-8") as f:
    f.write(clean_text)

print(f"Saved {len(lines)} lines to data/nust_faqs.txt")