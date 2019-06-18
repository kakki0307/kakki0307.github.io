<?php
for($i=0;$i < 100; $i++){
  $json_data["image"][$i]="../../img/icon/icon.png";
}
echo json_encode($json_data);
