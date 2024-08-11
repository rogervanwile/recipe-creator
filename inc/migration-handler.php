<?php

if (!defined("ABSPATH")) {
    die();
}

class MigrationHandler
{
    private $migrations = [
        "2.3.0" => __DIR__ . "/migrations/migrate-2.3.0.php",
        "2.3.6" => __DIR__ . "/migrations/migrate-2.3.6.php",
    ];

    public function migrationNeeded()
    {
        $lastMigratedVersion = get_option('recipe_creator__last_successful_migration', '1.0.0');
        return $this->hasAvailableMigrations($lastMigratedVersion);
    }

    private function hasAvailableMigrations($lastMigratedVersion)
    {
        $migrations = $this->getAvailableMigrations($lastMigratedVersion);
        return count($migrations) > 0;
    }

    private function getAvailableMigrations($lastMigratedVersion)
    {
        return array_filter(
            $this->migrations,
            function ($candiateVersion) use ($lastMigratedVersion) {
                return version_compare($lastMigratedVersion, $candiateVersion, "<");
            },
            ARRAY_FILTER_USE_KEY
        );
    }

    public function runMigrations()
    {
        $lastMigratedVersion = get_option('recipe_creator__last_successful_migration', '1.0.0');


        $migrations = $this->getAvailableMigrations($lastMigratedVersion);

        if (count($migrations) === 0) {
            return false;
        }

        foreach ($migrations as $version => $migration) {
            include $migration;
            $migrationClass = "Migration_" . str_replace(".", "_", $version);
            $migrationInstance = new $migrationClass();
            $success = $migrationInstance->migrate();

            if ($success === false) {
                break;
            }

            update_option('recipe_creator__last_successful_migration', $version);
        }

        return true;
    }
}
