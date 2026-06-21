# Save this as generate_links.py
# Paste your File IDs into the dictionary below.

file_ids = {
    # AUDIO
    "bg-music": "1BnIYxQX-xklSChiGlHxXs5PaJHab3N2B",
    "error": "1l1TYrUHuVDnuDXFhQFhSPXAvcW5-wfjA",
    "key-backspace": "1aUXRVQzl_CAW2-GkFMnprYcrckkPBDEN",
    "key-press": "1IU33IapoO1IUyzduPKVRTsb-nHbc29tY",
    "pop": "1fFCLrLFZxnVEeGKaWovnCpuQCwbgitYN",
    "type": "1YVGGVpibLMzvZqBO37El7ghpLyOUT_5p",
    "unlock-success": "1GdBrYHF93qkW5WbpNZrB5rJQ59BuGBHh",
    
    # VIDEOS
    "bg1-4k": "1l-6yv1kJwPHcX26cfJJOk83h092XIlGI",
    "bg1-1080p": "1G1jbNBeF2WbBfRsWXOROqhv-bhL8wJo-",
    "bg2-4k":"1DIGkH30MOd_6YLxQr9ESrvAfKLQILQMI",
    "bg2-1080p":"17Yc5utYASVNMEXC2dnJrBE18w5crbnSX",
    "cat-dance": "15yj9K3W-zza_y5oZjx4_aTZI_kt0XYTP",
    "memory1": "1ME5z_-5HC8pl21alxwpOjtzFhc1KIcL5",
    "your-3-sec-video":"1uF5MXNBG3CH6UubiZc7meGzwCSwbjH_R",
    
    # PICS (Include the 'pics' folder items here!)
    "contract": "12kDENVJNmkZPFsGdKl-TzYRC19NL_OxE",
    "final-pic": "1cOKvuFm6i1wSpkEuidHVJ2MR_Z3s9HUI",
    "message-4": "1-ZjJneWTCrPXO4FKTsZmUvAtDcUMB4yB",
    "question": "1IrA8YoFo7TllQzGw5eagu2Da1ATOCWPi",
    "toffee-run": "1gdUMA2ClGk6aMx7dBlalJ-xEWiDMuca4",

    #stickers
    "sticker1":"1lYK404addhHo-0uQiJcMRjuOboxS0FdZ",
    "sticker2":"1c57fkwNWqG3Z_HqLF4hkjnHPDegOJi4n",
    "sticker3":"1CRw3kOWvAQUD6kHTmy0DBeXGA1lABSrw",
    "sticker4":"1us--YLh8K1xNiESjNjG-0qrDqlELoqwR",
    "sticker5":"1GKVZWfH5zgUThDyn6-M4rdvJHWLJOZ6a",

}

def generate_direct_url(file_id):
    # This URL format is trusted by browsers and does not show security warnings
    return f"https://drive.usercontent.google.com/download?id={file_id}&export=download"

print("--- COPY THESE LINKS INTO MAIN.JS ---")
for name, fid in file_ids.items():
    print(f"{name}: {generate_direct_url(fid)}")