<?php
session_start();
if (empty($_SESSION['score'])) {
    $_SESSION['score'] = 0;
}
if (empty($_SESSION['total'])) {
    $_SESSION['total'] = 0;
}
if (!empty($_POST['reset'])) {
    $_SESSION['score'] = 0;
    $_SESSION['total'] = 0;
}

$dir = './json/';
$dirlist = glob($dir . '*', GLOB_ONLYDIR);


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
            <form action="./index.php" method="post" class="navbar-toggler">
                <input name="reset" type="hidden" value="reset">
                <button type="submit" class="btn btn-secondary">リセット</button>
            </form>

            <ul class="navbar-nav">
                <li class="nav-item collapse navbar-collapse">
                    <form action="./index.php" method="post">
                        <input name="reset" type="hidden" value="reset">
                        <button type="submit" class="btn btn-secondary">リセット</button>
                    </form>
                </li>
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
                        <h5 class="card-title">このサイトについて</h5>
                    </div>
                    <div class="card-body">
                        このサイトは医療情報技師の勉強をするために作りました。<br />
                        以下のサイトを参考にして作っています。<br />
                        <br />
                        <a href="https://iryoujyouhou.wiki.fc2.com/wiki/トップページ"> https://iryoujyouhou.wiki.fc2.com/wiki/トップページ</a>
                    </div>
                </div>
                <br />
                <?php foreach (array_reverse($dirlist) as $dirname) { ?>
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title"><?php echo (substr($dirname, -4)) ?>年度 医療情報技師試験対策</h5>
                        </div>
                        <div class="card-body">
                            <a href="./question.php?year=<?php echo (substr($dirname, -4)) ?>&kind=ipt" class="btn btn-primary">情報処理技術系</a>
                            <a href="./question.php?year=<?php echo (substr($dirname, -4)) ?>&kind=mis" class="btn btn-warning">医学医療系</a>
                            <a href="./question.php?year=<?php echo (substr($dirname, -4)) ?>&kind=mms" class="btn btn-success">医療情報システム系</a>
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