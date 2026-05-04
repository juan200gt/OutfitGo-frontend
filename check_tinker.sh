sudo docker exec laravel php artisan tinker --execute="echo DB::connection()->getConfig('host');"
