<?php

return [
    'storage_account_name' => env('AZURE_STORAGE_ACCOUNT_NAME'),
    'storage_account_key' => env('AZURE_STORAGE_ACCOUNT_KEY'),
    'storage_container' => env('AZURE_STORAGE_CONTAINER', 'ebooks'),
];