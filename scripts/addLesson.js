$('td').mouseenter(function () {
    let template = $("#add-template");
    let btn = template.clone();
    btn.removeClass('d-none')
    btn.find('#button-add-lesson').click(function (){

    })
    $(this).append(btn)
})

$('td').mouseleave(function () {
    $(this).find($('.button-add')).remove();
})