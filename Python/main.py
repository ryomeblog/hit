import requests
import re
import json
import os


def create_json(url, year, num, file_name):
    question = str(num).zfill(2)

    try:
        response = requests.get(url)
        print(str(year) + '-' + str(question) + '-' + str(file_name))
        try:
            text = response.text[0:re.search('解説】.*</span></div>', response.text).start()]
        except:
            try:
                text = response.text[0:re.search('<div>.*解説】.*</div>', response.text).start()]
            except:
                text = response.text

        if not response.text.find('削除問題') < 0:
            print(str(year) + '-' + str(question) + '-' + str(file_name) + 'skip')
            return

        if not response.text.find('が見つかりませんでした。') < 0:
            print(str(year) + '-' + str(question) + '-' + str(file_name) + 'skip')
            return

        # タイトル
        title = re.findall('<title>.*</title>', text)[0].replace('<title>', '').replace('</title>', '')

        # 問題
        start = text.find('<div><span style="font-weight: bold;">問', 0)
        try:
            end = text.find('<div>5)', 0) + len(re.findall('<div>5\).*</div>\n<br />', text)[0])
        except:
            try:
                end = text.find('5)', 0) + len(re.findall('5\).*</pre>', text)[0])
            except:
                end = text.find('<div>5)', 0) + len(re.findall('<div>5\).*</div>', text)[0])
        if end < start or start < 0:
            start = text.find('<div class="user_body">', 0) + \
                    len(re.findall('<div class="user_body">', text)[0])
        q = text[start:end].replace('<div>', '').replace('</div>', '').replace('<br />', '') \
            .replace('<span style="font-weight: bold;">', '').replace('</span>', '').replace('	', '') \
            .replace('<pre>', '').replace('</pre>', '')
        splitq = q.split('\n')
        for num in range(len(splitq)):
            if not splitq[len(splitq) - num - 1].find('1)') < 0:
                select1 = splitq[len(splitq) - num - 1].replace('1) ', '').replace('\n', '')
                break
        for num in range(len(splitq)):
            if not splitq[len(splitq) - num - 1].find('2)') < 0:
                select2 = splitq[len(splitq) - num - 1].replace('2) ', '').replace('\n', '')
                break
        for num in range(len(splitq)):
            if not splitq[len(splitq) - num - 1].find('3)') < 0:
                select3 = splitq[len(splitq) - num - 1].replace('3) ', '').replace('\n', '')
                break
        for num in range(len(splitq)):
            if not splitq[len(splitq) - num - 1].find('4)') < 0:
                select4 = splitq[len(splitq) - num - 1].replace('4) ', '').replace('\n', '')
                break
        for num in range(len(splitq)):
            if not splitq[len(splitq) - num - 1].find('5)') < 0:
                select5 = splitq[len(splitq) - num - 1].replace('5) ', '').replace('\n', '')
                break

        # 解答
        try:
            ans = re.findall('【解答】.*</span></div>', text)[0].replace('</span></div>', '').replace('【解答】', '') \
                .replace('"', '').replace('\'', '')
        except:
            try:
                ans = re.findall('解答】.*</span></div>', text)[0].replace('</span></div>', '').replace('解答】', '') \
                    .replace('"', '').replace('\'', '')
            except:
                ans = re.findall('解答】.*</div>', text)[0].replace('</span></div>', '').replace('解答】', '') \
                    .replace('"', '').replace('\'', '')

        dist = {
            'title': title,
            'question': q,
            'select1': select1,
            'select2': select2,
            'select3': select3,
            'select4': select4,
            'select5': select5,
            'answer': ans,
            'url': url
        }

        with open('./json/' + str(year) + '/' + str(file_name) + '-' + str(year) + '-' + str(question) + '.json', "w",
                  encoding="utf-8") as outputFile:
            json.dump(dist, outputFile, indent=2, ensure_ascii=False)

    except Exception as e:
        print('Error：' + str(year) + '-' + str(question) + '-' + str(file_name))


def create(year, question_ipt, question_mms, question_mis):
    try:
        os.mkdir('./json')
    except FileExistsError:
        pass
    try:
        os.mkdir('./json/' + str(year))
    except FileExistsError:
        pass

    # IPT
    for num in range(question_ipt):
        question = str(num+1).zfill(2)
        url = 'https://iryoujyouhou.wiki.fc2.com/wiki/' + str(year) + '>情報処理技術系>問題と解説>' + question
        create_json(url, year, str(num+1), 'ipt')

    # MMS
    for num in range(question_mms):
        question = str(num+1).zfill(2)
        url = 'https://iryoujyouhou.wiki.fc2.com/wiki/' + str(year) + '>医学医療系>問題と解説>' + question
        create_json(url, year, str(num+1), 'mms')

    # MIS
    for num in range(question_mis):
        question = str(num+1).zfill(2)
        url = 'https://iryoujyouhou.wiki.fc2.com/wiki/' + str(year) + '>医療情報システム系>問題と解説>' + question
        create_json(url, year, str(num+1), 'mis')

if __name__ == "__main__":
    create('2011', 50, 50, 60)
    create('2012', 50, 50, 60)
    create('2013', 50, 50, 60)
    create('2014', 50, 50, 60)
    create('2015', 50, 50, 60)
    create('2016', 50, 50, 60)
    create('2017', 50, 50, 60)
    create('2018', 50, 50, 60)
    create('2019', 50, 50, 60)
    create('2021', 50, 50, 60)
