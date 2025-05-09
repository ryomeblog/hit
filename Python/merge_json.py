import os
import json
import glob
import re

def parse_filename(filename):
    # ファイル名からカテゴリ、年、問題番号を抽出
    pattern = r'([a-z]+)-(\d{4})-(\d+)\.json'
    match = re.match(pattern, os.path.basename(filename))
    
    if match:
        return {
            'category': match.group(1),
            'year': int(match.group(2)),
            'problem_number': int(match.group(3))
        }
    return None

def merge_json_files():
    # Web/json配下のすべてのJSONファイルを取得
    json_files = glob.glob('Python/json/**/*.json', recursive=True)
    
    # マージしたデータを保存するリスト
    merged_data = []
    
    # 各JSONファイルを読み込んでマージ
    for file_path in json_files:
        try:
            # ファイル名から情報を抽出
            file_info = parse_filename(file_path)
            if not file_info:
                print(f"Warning: Could not parse filename: {file_path}")
                continue
                
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # データを処理
                if isinstance(data, dict):
                    # 既存のデータにファイル情報を追加
                    data.update(file_info)
                    merged_data.append(data)
                elif isinstance(data, list):
                    # リストの各要素にファイル情報を追加
                    for item in data:
                        if isinstance(item, dict):
                            item.update(file_info)
                            merged_data.append(item)
                print(f"Processed: {file_path}")
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
    
    # マージしたデータを新しいJSONファイルに書き出し
    output_file = 'Python/merged_output.json'
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(merged_data, f, ensure_ascii=False, indent=2)
        print(f"\nMerge completed! Total {len(merged_data)} items merged.")
        print(f"Output file: {output_file}")
    except Exception as e:
        print(f"Error writing output file: {e}")

if __name__ == '__main__':
    merge_json_files()