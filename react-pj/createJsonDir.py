import os
import json

def get_all_json_files(base_path):
    all_files = []
    for year in os.listdir(base_path):
        year_path = os.path.join(base_path, year)
        if os.path.isdir(year_path):
            files = [f for f in os.listdir(year_path) if f.endswith('.json')]
            if files:
                all_files.append({"year": year, "files": files})
    return all_files

base_path = 'public/json'
all_json_files = get_all_json_files(base_path)

output_path = os.path.join(base_path, 'q.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(all_json_files, f, indent=2, ensure_ascii=False)

print(f"Output written to {output_path}")