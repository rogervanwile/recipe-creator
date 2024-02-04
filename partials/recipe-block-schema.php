<?php if (!empty($attributes['ldJson'])) { ?>
    <script type="application/ld+json">
        <?php echo wp_json_encode($attributes['ldJson']); ?>
    </script>
<?php } ?>