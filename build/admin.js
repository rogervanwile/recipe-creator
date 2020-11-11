(function ($) {
  $(function () {
    $(".recipe-manager-pro--color-picker").each(function () {
      var defaultValue = $(this).attr("data-default-value") || null;
      $(this).wpColorPicker({
        defaultColor: defaultValue,
      });
    });
  });
})(jQuery);
