<?php if (!empty($attributes['ldJson'])) { ?>
    <script type="application/ld+json">
        <?php echo esc_js($attributes['ldJson']); ?>
    </script>
<?php } ?>