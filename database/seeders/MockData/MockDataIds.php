<?php

namespace Database\Seeders\MockData;

final class MockDataIds
{
    public const COUNT = 20;

    public static function store(int $number): string
    {
        return 'STR-' . self::suffix($number);
    }

    public static function seller(int $number): string
    {
        return 'SELLER-' . self::suffix($number);
    }

    public static function user(int $number): string
    {
        return 'USER-' . self::suffix($number);
    }

    public static function buyerFor(int $number): string
    {
        return self::user((($number - 1) % 9) + 2);
    }

    public static function product(int $number): string
    {
        return 'PDT-' . self::suffix($number);
    }

    public static function order(int $number): string
    {
        return 'ORD-' . self::suffix($number);
    }

    public static function variant(int $number): string
    {
        return 'VRT-' . self::suffix($number);
    }

    public static function business(int $number): string
    {
        return sprintf('BUS%03d', $number);
    }

    public static function category(int $number): string
    {
        return sprintf('C%03d', $number);
    }

    private static function suffix(int $number): string
    {
        return sprintf('%02d', $number);
    }
}
