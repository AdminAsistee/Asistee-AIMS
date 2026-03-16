<?php

/**
 * clear_photos.php
 * Run from the backend/ directory:
 *   C:\Users\amrca\Documents\php83\php.exe clear_photos.php
 *
 * Does two things:
 *  1. Truncates the property_photos table in MySQL
 *  2. Deletes all uploaded files under public/uploads/photos/
 */

// ── Load .env manually ──────────────────────────────────────────────────────
$envFile = __DIR__ . '/.env';
if (!file_exists($envFile)) {
    die("ERROR: .env not found at {$envFile}\n");
}
foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
    [$key, $val] = explode('=', $line, 2);
    $_ENV[trim($key)] = trim($val, " \t\n\r\0\x0B\"'");
}

$host   = $_ENV['DB_HOST']     ?? '127.0.0.1';
$port   = $_ENV['DB_PORT']     ?? '3306';
$dbName = $_ENV['DB_DATABASE'] ?? '';
$user   = $_ENV['DB_USERNAME'] ?? '';
$pass   = $_ENV['DB_PASSWORD'] ?? '';

// ── Connect ─────────────────────────────────────────────────────────────────
try {
    $pdo = new PDO("mysql:host={$host};port={$port};dbname={$dbName};charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅  Connected to database: {$dbName}\n";
} catch (PDOException $e) {
    die("❌  DB connection failed: " . $e->getMessage() . "\n");
}

// ── 1. Truncate property_photos table ───────────────────────────────────────
$pdo->exec('SET FOREIGN_KEY_CHECKS=0');
$deleted = $pdo->exec('TRUNCATE TABLE property_photos');
$pdo->exec('SET FOREIGN_KEY_CHECKS=1');
echo "✅  property_photos table truncated.\n";

// ── 2. Delete uploaded files from disk ──────────────────────────────────────
$uploadsDir = __DIR__ . '/public/uploads/photos';

if (!is_dir($uploadsDir)) {
    echo "ℹ️   No uploads directory found at: {$uploadsDir} — nothing to delete.\n";
} else {
    $count = 0;

    // Iterate over each location subfolder
    foreach (new DirectoryIterator($uploadsDir) as $locationDir) {
        if ($locationDir->isDot() || !$locationDir->isDir()) continue;

        foreach (new DirectoryIterator($locationDir->getPathname()) as $file) {
            if ($file->isDot() || $file->isDir()) continue;
            unlink($file->getPathname());
            $count++;
        }
        // Remove now-empty subfolder
        @rmdir($locationDir->getPathname());
    }

    echo "✅  Deleted {$count} photo file(s) from disk.\n";
    echo "    Path: {$uploadsDir}\n";
}

echo "\n🎉  All done! You can now test a fresh photo upload.\n";
