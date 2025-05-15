import glob
import html
import json
import os
import re
import unicodedata


def parse_filename(filename):
    # ファイル名からカテゴリ、年、問題番号を抽出
    pattern = r"([a-z]+)-(\d{4})-(\d+)\.json"
    match = re.match(pattern, os.path.basename(filename))

    if match:
        return {
            "category": match.group(1),
            "year": int(match.group(2)),
            "problem_number": int(match.group(3)),
        }
    return None


def clean_text(s: str) -> str:
    """HTMLタグ/エンティティ除去、全角→半角、前後空白削除"""
    s = html.unescape(s)  # HTMLエンティティをアンエスケープ
    s = re.sub(r"<[^>]+>", "", s)  # タグ除去
    s = unicodedata.normalize("NFKC", s)  # 全角英数記号を半角化
    return s.strip()  # 前後空白削除


def clean_item(item: dict):
    """question/select*/answer フィールドに対して一連の整形を行う"""
    keys = ["question", "select1", "select2", "select3", "select4", "select5", "answer"]
    # 基本クレンジング
    for k in keys:
        if k in item and isinstance(item[k], str):
            item[k] = clean_text(item[k])

    # selectN に番号と空白を保証
    for i in range(1, 6):
        k = f"select{i}"
        if k in item and isinstance(item[k], str):
            v = item[k]
            # 先頭に数字) がなければ付与
            if not re.match(rf"^{i}\)", v):
                v = f"{i}) {v}"
            # 数字) の直後に空白がなければ挿入
            v = re.sub(rf"^{i}\)(?!\s)", f"{i}) ", v)
            item[k] = v

    # question は "\n1)" 以降を切り捨て
    if "question" in item:
        q = item["question"]
        idx = q.find("\n1)")
        if idx >= 0:
            item["question"] = q[:idx].strip()

    # answer は数値のみカンマ区切り
    if "answer" in item:
        nums = re.findall(r"\d+", item["answer"])
        if nums:
            item["answer"] = ",".join(nums)


def merge_json_files():
    # Web/json配下のすべてのJSONファイルを取得
    json_files = glob.glob("Python/json/**/*.json", recursive=True)

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

            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                # データを処理
                if isinstance(data, dict):
                    data.update(file_info)
                    clean_item(data)
                    merged_data.append(data)
                elif isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict):
                            item.update(file_info)
                            clean_item(item)
                            merged_data.append(item)
                print(f"Processed: {file_path}")
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    # マージしたデータを新しいJSONファイルに書き出し
    output_file = "Python/merged_output.json"
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(merged_data, f, ensure_ascii=False, indent=2)
        print(f"\nMerge completed! Total {len(merged_data)} items merged.")
        print(f"Output file: {output_file}")
    except Exception as e:
        print(f"Error writing output file: {e}")


if __name__ == "__main__":
    merge_json_files()
