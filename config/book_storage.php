<?php

return [
    'driver' => env('BOOK_STORAGE_DRIVER', 'local'),
    'local_disk' => env('BOOK_STORAGE_LOCAL_DISK', 'public'),
];
