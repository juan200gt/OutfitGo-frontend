sudo docker exec laravel php artisan tinker --execute="echo \"DB: \" . DB::connection()->getDatabaseName();"
