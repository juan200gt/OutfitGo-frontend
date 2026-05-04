sudo docker exec laravel php artisan tinker --execute="echo json_encode(DB::select('SHOW TABLES'));"
