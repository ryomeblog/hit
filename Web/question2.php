<?php
session_start();
if (empty($_SESSION['score'])) {
    $_SESSION['score'] = 0;
}
if (empty($_SESSION['total'])) {
    $_SESSION['total'] = 0;
}
if (empty($_GET["year"])) {
    $_GET["year"] = '2021';
}
if (empty($_GET["kind"])) {
    $_GET["kind"] = 'ipt';
}
if (empty($_GET["num"])) {
    $_GET["num"] = '01';
}

$result = null;
$jsonUrl = './json/' . $_GET["year"] . '/' . $_GET["kind"] . '-' . $_GET["year"] . '-' . $_GET["num"] . '.json';

if (file_exists($jsonUrl)) {
    $json = file_get_contents($jsonUrl);
    $json = mb_convert_encoding($json, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
    $obj = json_decode($json, true);

    if (strpos($obj["answer"], ',')) {
        $answers = explode(",", $obj["answer"]);
        if (!empty($_GET["select"])) {
            $ansFlg = true;
            foreach ($answers as $answer) {
                $flg = false;
                foreach ($_GET["select"] as $select) {
                    if ($answer == $select) {
                        $flg = true;
                    }
                }
                $ansFlg = $ansFlg && $flg;
            }
            if ($ansFlg) {
                $_SESSION['score'] = $_SESSION['score'] + 1;
                $_SESSION['total'] = $_SESSION['total'] + 1;
                $result = '<div class="alert alert-success" role="alert">正解です。</div>';
            } else {
                $_SESSION['total'] = $_SESSION['total'] + 1;
                $result = '<div class="alert alert-danger" role="alert">不正解です。</div>';
            }
        }
    } else {
        if (!empty($_GET["select"])) {
            if ($_GET["select"] == $obj["answer"]) {
                $_SESSION['score'] = $_SESSION['score'] + 1;
                $_SESSION['total'] = $_SESSION['total'] + 1;
                $result = '<div class="alert alert-success" role="alert">正解です。</div>';
            } else {
                $_SESSION['total'] = $_SESSION['total'] + 1;
                $result = '<div class="alert alert-danger" role="alert">不正解です。</div>';
            }
        }
    }

    $dir = './json/' . $_GET["year"] . '/';
    $filelist = glob($dir . $_GET["kind"] . '*');
    $nextFlg = false;
    $nextBtnFlg = false;
    $nextNum = '01';

    foreach ($filelist as $filename) {
        if ($nextFlg) {
            $nextBtnFlg = true;
            $nextNum = substr($filename, 21, 2);
            break;
        }
        if (strpos($filename, $_GET["num"] . '.json')) {
            $nextFlg = true;
        }
    }
    $backFlg = false;
    $backBtnFlg = false;
    $backNum = '01';

    foreach (array_reverse($filelist) as $filename) {
        if ($backFlg) {
            $backBtnFlg = true;
            $backNum = substr($filename, 21, 2);
            break;
        }
        if (strpos($filename, $_GET["num"] . '.json')) {
            $backFlg = true;
        }
    }
} else {
}

?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <title>医療情報技師試験対策</title>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="./index.php">医療情報技師試験対策サイト</a>
            <a class="navbar-toggler btn btn-secondary" href="./question.php?year=<?php echo ($_GET["year"]) ?>&kind=<?php echo ($_GET["kind"]) ?>">戻る</a>
            <div class="collapse navbar-collapse">
                <a class="btn btn-secondary" href="./question.php?year=<?php echo ($_GET["year"]) ?>&kind=<?php echo ($_GET["kind"]) ?>">戻る</a>
            </div>

            <ul class="navbar-nav">
                <li class="nav-item">

                    <button type="button" class="btn btn-success">
                        正解数： <span class="badge bg-secondary"><?php echo ($_SESSION['score']); ?>問</span>
                    </button>
                    <button type="button" class="btn btn-info">
                        トータル： <span class="badge bg-secondary"><?php echo ($_SESSION['total']); ?>問</span>
                    </button>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">
                            医療情報技師試験 <?php
                                        switch ($_GET["kind"]) {
                                            case 'ipt':
                                                echo ('情報処理技術系');
                                                break;
                                            case 'mis':
                                                echo ('医学医療系');
                                                break;
                                            case 'mms':
                                                echo ('医療情報システム系');
                                                break;
                                        }
                                        ?> 問<?php echo ($_GET["num"]) ?>
                        </h5>
                        <?php if ($nextBtnFlg) { ?>
                            <a href="./question2.php?year=<?php echo ($_GET["year"]) ?>&kind=<?php echo ($_GET["kind"]) ?>&num=<?php echo ($nextNum) ?>" class="btn btn-primary float-end">次の問題へ</a>
                        <?php } ?>
                        <?php if ($backBtnFlg) { ?>
                            <a href="./question2.php?year=<?php echo ($_GET["year"]) ?>&kind=<?php echo ($_GET["kind"]) ?>&num=<?php echo ($backNum) ?>" class="btn btn-secondary float-end">前の問題へ</a>
                        <?php } ?>
                    </div>
                    <div class="card-body">
                        <?php if (!empty($result)) {
                            echo ($result);
                        } ?>
                        <?php echo "<p>問題：" . nl2br($obj["question"]) . "</p>" ?>
                        <br />
                        <?php if (strpos($obj["answer"], ',')) { ?>
                            <form action="question2.php" method="get">
                                <input type="checkbox" class="btn-check" id="btn-check-outlined" autocomplete="off">

                                <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off" name="select[]" value="1">
                                <label for="btncheck1" class="btn btn-outline-primary">1: <?php echo ($obj["select1"]) ?></label>

                                <input type="checkbox" class="btn-check" id="btncheck2" autocomplete="off" name="select[]" value="2">
                                <label for="btncheck2" class="btn btn-outline-primary">2: <?php echo ($obj["select2"]) ?></label>

                                <input type="checkbox" class="btn-check" id="btncheck3" autocomplete="off" name="select[]" value="3">
                                <label for="btncheck3" class="btn btn-outline-primary">3: <?php echo ($obj["select3"]) ?></label>

                                <input type="checkbox" class="btn-check" id="btncheck4" autocomplete="off" name="select[]" value="4">
                                <label for="btncheck4" class="btn btn-outline-primary">4: <?php echo ($obj["select4"]) ?></label>

                                <input type="checkbox" class="btn-check" id="btncheck5" autocomplete="off" name="select[]" value="5">
                                <label for="btncheck5" class="btn btn-outline-primary">5: <?php echo ($obj["select5"]) ?></label>

                                <input name="year" type="hidden" value="<?php echo ($_GET["year"]) ?>">
                                <input name="kind" type="hidden" value="<?php echo ($_GET["kind"]) ?>">
                                <input name="num" type="hidden" value="<?php echo ($_GET["num"]) ?>">

                                <br />
                                <br />
                                <button type="submit" class="btn btn-primary">解答</button>
                            </form>
                        <?php } else { ?>
                            <a href="./question2.php?year=<?php echo ($_GET["year"]) ?>&kind=<?php echo ($_GET["kind"]) ?>&num=<?php echo ($_GET["num"]) ?>&select=1" class="btn btn-primary">1: <?php echo ($obj["select1"]) ?></a>
                            <a href="./question2.php?year=<?php echo ($_GET["year"]) ?>&kind=<?php echo ($_GET["kind"]) ?>&num=<?php echo ($_GET["num"]) ?>&select=2" class="btn btn-primary">2: <?php echo ($obj["select2"]) ?></a>
                            <a href="./question2.php?year=<?php echo ($_GET["year"]) ?>&kind=<?php echo ($_GET["kind"]) ?>&num=<?php echo ($_GET["num"]) ?>&select=3" class="btn btn-primary">3: <?php echo ($obj["select3"]) ?></a>
                            <a href="./question2.php?year=<?php echo ($_GET["year"]) ?>&kind=<?php echo ($_GET["kind"]) ?>&num=<?php echo ($_GET["num"]) ?>&select=4" class="btn btn-primary">4: <?php echo ($obj["select4"]) ?></a>
                            <a href="./question2.php?year=<?php echo ($_GET["year"]) ?>&kind=<?php echo ($_GET["kind"]) ?>&num=<?php echo ($_GET["num"]) ?>&select=5" class="btn btn-primary">5: <?php echo ($obj["select5"]) ?></a>
                        <?php } ?>
                    </div>
                </div>
                <?php if (!empty($result)) { ?>
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">答え</h5>
                        </div>
                        <div class="card-body">
                            <?php echo $obj["answer"] ?><br />
                            <br />
                            解説は<a href="<?php echo $obj["url"] ?>">こちら</a>
                        </div>
                    </div>
                <?php } ?>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>