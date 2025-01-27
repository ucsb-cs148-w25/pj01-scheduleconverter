import json

with open("database.json", "r", encoding="utf-8") as file:
    data = json.load(file)

def get(perm, quarter):
    return data[str(perm)][str(quarter)]

print(get("6369082", "2024F")[1]["courseTitle"])