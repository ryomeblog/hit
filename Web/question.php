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

$dir = './json/' . $_GET["year"] . '/';
$filelist = glob($dir . $_GET["kind"] . '*');


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
            <a href="./index.php?year=<?php echo ($_GET["year"]) ?>" class="btn btn-secondary navbar-toggler">戻る</a>
            <div class="collapse navbar-collapse">
                <a href="./index.php?year=<?php echo ($_GET["year"]) ?>" class="btn btn-secondary">戻る</a>
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
                <?php foreach ($filelist as $filename) { ?>
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title">
                                医療情報技師試験 <?php
                                            switch ($_GET["kind"]) {
                                                case 'ipt':
                                                    echo ('情報処理技術系');
                                                    break;
                                                case 'mis':
                                                    echo ('医療情報システム系');
                                                    break;
                                                case 'mms':
                                                    echo ('医学医療系');
                                                    break;
                                            }
                                            ?> 問<?php echo (substr($filename, 21, 2)) ?>
                            </h5>
                        </div>
                        <div class="card-body">
                            <a href="./question2.php?year=<?php echo ($_GET["year"]) ?>&kind=<?php echo ($_GET["kind"]) ?>&num=<?php echo (substr($filename, 21, 2)) ?>" class="btn btn-primary">問題へ</a>
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