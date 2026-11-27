<?php

namespace Database\Seeders\MockData;

use Illuminate\Support\Facades\DB;

trait InsertsMockRows
{
    protected function insertIfMissing(string $table, array $identity, array $row): void
    {
        if (! DB::table($table)->where($identity)->exists()) {
            DB::table($table)->insert($row);
        }
    }
}
