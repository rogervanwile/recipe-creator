<?php

use WP_Cypress\Seeder\Seeder;

class ValidLicenseSeeder extends Seeder
{
    public function run()
    {
        update_option("recipe_creator__license_key", "I_AM_A_VALID_LICENSE");
    }
}
