<?php
?>
<html>
    <head>
        <title>Canvasser</title>
        <script src="js/canvasser.js" type="text/javascript"></script>
        <link rel="shortcut icon" href="favicon.ico" />
        <link href="css/normalize.css" rel="stylesheet" type="text/css"/>
        <link href="css/canvasser.css" rel="stylesheet" type="text/css"/>
    </head>
    <body onload='initCanvasser("tex","data/eforensics.json", "file");'>
        <?php include 'header.php';?>
        <div class="title_a">Case File Sample</div>
        <table>
            <tr>
                <td>
                    <div id='canvasholder' style="float:left"></div>
                </td>
            </tr>
    </body>
</html>