// var url = 'https://fieldbook.headlightstg.paviasystems.com/1.0//PayItems/Bundle/';
var url = 'bundle.json';
var bundle;
console.clear();
console.log('try and get bundle');

function init() {

    AlBundle.Init(bundle);
    console.log('AlBundle Inited');
    // AlBundle.PrintItems(AlBundle._Orgs);
    // // console.log('==BidItems===');
    // AlBundle.PrintItems(AlBundle._BidItems);
    // // console.log('==LineItems===');
    // AlBundle.PrintItems(AlBundle._LineItems);

    // $('document').on('ready', function () {
        console.log('document ready');
        function resetValues () {
            $('.org-value').val('');
            $('.bi-value').val('');
            $('.li-value').val('');
            $('.results-org').html('');
            $('.results-bi').html('');
            $('.results-li').html('');
        }

        function doStuff(org, bi, li) {
            console.log('doStuff', 'org: "' + org, '" bi: ' + bi, 'li: "' + li + '"');
            AlBundle.Filter(org, bi, li);
            $('.results-org').html(AlBundle.PrintItems(AlBundle._Orgs));
            $('.results-bi').html(AlBundle.PrintItems(AlBundle._BidItems));
            $('.results-li').html(AlBundle.PrintItems(AlBundle._LineItems));

            $('a.item').click(function (e) {
                console.log('item click', e.target);

                // get parent type
                var type = $(e.target).parents('td').data('type');
                console.log(type);
                // fill in value;
                $('.' + type + '-value').val($(e.target).text());
                getSome();
            });
        }
        function getSome() {
            doStuff($('.org-value').val(),$('.bi-value').val() ,$('.li-value').val());
        }

        $('.reset').click(function () {
            resetValues();
            getSome();
        });
        $('.random-org').click(function (){
            var item = _.sample(bundle.Organizations);
            console.log('clicked random org', item);
            resetValues();
            $('.org-value').val(item.Name);
            getSome();
        });
        $('.random-bi').click(function (){
            var item = _.sample(bundle.BidItems);
            console.log('clicked random biditem', item);
            resetValues();
            $('.bi-value').val(item.Name);
            getSome();
        });
        $('.random-li').click(function (){
            var item = _.sample(bundle.LineItems);
            console.log('clicked random lineitem', item);
            resetValues();
            $('.li-value').val(item.Name);
            getSome();
        });

        $('.do-it').click(function () {
            getSome();
        });

        // show all data upfront
        getSome();

}

$('.logout').click(function (){
    $.ajax({
       type: 'GET',
       url: '/1.0/Deauthenticate/',
       // async: false,
       // contentType: "application/json",
       dataType: 'json',
       success: function (data) {
           if (data && !data.Error) {

               $('#login').removeClass('hidden');
               $('#setup').addClass('hidden');
               $('#tool').addClass('hidden');
           } else {
               alert(data.Error);
           }

       },
       error: function (e) {
           alert('error coudn\'t get bundle' );
           console.log(e);
       }
   });
});

// Check session
$.ajax({
   type: 'GET',
   url: '/1.0/CheckSession',
   dataType: 'json',
   success: function (data) {
       if (data && !data.Error) {
           if (data.LoggedIn) {
               $('#login').addClass('hidden');
               // if project in route try and get bundle itself
               $('#setup').removeClass('hidden');
               var projectId = window.location.search.indexOf('projectId=') > -1 ? window.location.search.split('?projectId=').pop() : '';
               $('input.project-id').val(projectId);
               $('.get-bundle').delay(500).click().addClass();

           }
       } else {
           alert(data.Error);
       }

   },
   error: function (e) {
       alert('error coudn\'t get bundle' );
       console.log(e);
   }
});
$('form[name="login"]').submit(function (e) {
    var formStuff = $(e.currentTarget).serializeArray();
    console.log(formStuff);
     $.ajax({
        type: 'GET',
        url: '/1.0/Authenticate/' + formStuff[1].value + '/' + formStuff[2].value,
        // async: false,
        // contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            if (data && !data.Error) {
                // console.log(data);
                alert('logged in!');
                $('#login').addClass('hidden');
                $('#setup').removeClass('hidden');
                // bundle = data;
                // init();
            } else {
                alert(data.Error);
            }

        },
        error: function (e) {
            alert('error coudn\'t get bundle' );
            console.log(e);
        }
    });
    e.preventDefault();
});

$('form[name="setup"]').submit(function (e) {
    $('#setup').addClass('loading');
    var formStuff = $(e.currentTarget).serializeArray();
    console.log(formStuff);
     $.ajax({
        type: 'GET',
        url: '/1.0/PayItems/Bundle/' + formStuff[0].value,
        // async: false,
        // contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            if (data && !data.Error) {
                $('.project-name').text(data.Project.IDProject + ' - ' + data.Project.Name);
                $('#login').addClass('hidden');
                $('#setup').addClass('hidden');
                $('#tool').removeClass('hidden');
                console.log(data);
                bundle = data;
                init();
            } else {
                alert(data.Error);
                $('#setup').removeClass('loading');
            }
        },
        error: function (e) {
            alert('error coudn\'t get bundle' );
            console.log(e);
        }
    });
    e.preventDefault();
});
