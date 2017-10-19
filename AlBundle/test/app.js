// var url = 'https://fieldbook.headlightstg.paviasystems.com/1.0//PayItems/Bundle/';
var url = 'bundle.json';
var bundle;
var user;
console.clear();
console.log('try and get bundle');

function init() {
    var bundleIntegrity = [];
    $('.gritty').html('').hide();
    // check bundle for integrity

    // Overwrite PrintItems specifically for this
    AlBundle.PrintItems = function(pItems)
    {
        var stuff = [];
        pItems.forEach(function(i)
        {
                // console.log(i.Name);
                stuff.push('<a href="#" class="item" on-click="fillValue(this)">' + i.Name + '</span>');
        });
        return stuff.join('<br/>');
    };
    AlBundle.Init(bundle);

    _.each(AlBundle._integrity, function (isValid, key) {
        console.log(isValid, key);
        if (!isValid) {
            bundleIntegrity.push(key);
        }
    });
    if (bundleIntegrity.length) {
        $('.gritty').html('<h5>Bundle <strong>' + bundleIntegrity.join(', ') + '</strong> are invalid. Something is up with this bundle.</h5>').show();
    }
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
            $('.eq-value').val('');

            $('.results-org').html('');
            $('.results-bi').html('');
            $('.results-li').html('');
            $('.results-eq').html('');
        }

        function doStuff(org, bi, li, eq) {
            console.log('doStuff', 'org: "' + org, '" bi: "' + bi, '" li: "' + li + '" eq: "' + eq + '"');
            AlBundle.Filter(org, bi, li, eq);
            $('.results-org').html(AlBundle.PrintItems(AlBundle._Orgs));
            $('.results-bi').html(AlBundle.PrintItems(AlBundle._BidItems));
            $('.results-li').html(AlBundle.PrintItems(AlBundle._LineItems));
            $('.results-eq').html(AlBundle.PrintItems(AlBundle._Equipment));

            $('a.item').click(function (e) {
                console.log('item click', e.target);

                // get parent type
                var type = $(e.target).parents('td').data('type');
                console.log(type);
                // fill in value;
                $('.' + type + '-value').val($(e.target).text());
                getSome();
                e.preventDefault();
            });
        }
        function getSome() {
            doStuff($('.org-value').val(), $('.bi-value').val(), $('.li-value').val(), $('.eq-value').val());
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
        $('.random-eq').click(function (){
            if (bundle.Equipment && bundle.Equipment.length) {
                var item = _.sample(bundle.Equipment);
                console.log('clicked random equipment', item);
                resetValues();
                $('.eq-value').val(item.Name);
                getSome();
            }
        });

        $('.do-it').click(function () {
            getSome();
        });

        // show all data upfront
        getSome();

}

$('.logout').click(function (e) {
    $.ajax({
       type: 'GET',
       url: '/1.0/Deauthenticate',
       // async: false,
       // contentType: "application/json",
    //    dataType: 'json',
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
   e.preventDefault();
});

function getProjects() {
    var projectsWrapper = $('.project-results');
    $.ajax({
       type: 'GET',
       url: '/1.0/ProjectSelect/FilteredTo/FBV~IDCustomer~EQ~' + user.CustomerID + '',
       dataType: 'json',
       success: function (data) {
           if (data && !data.Error) {
               _.map(_.sortBy(data, 'Hash'), function (project) {
                   var row = '<tr class="project" data-project-id="' + project.Hash + '"><td class="project-id">' + project.Hash + '</td><td class="project-name">' + project.Value + '</td></tr>';
                   projectsWrapper.append(row);
               });
               $('.project').click(function (e) {
                   var projectId = $(e.target).closest('tr').data('projectId');
                //    console.log(projectId);
                   $('input.project-id').val(projectId);
                   $('.get-bundle').delay(500).click();
               });
           } else {
               alert(data.Error);
           }

       },
       error: function (e) {
           alert('error coudn\'t get bundle' );
           console.log(e);
       }
    });
}
// Check session
$.ajax({
   type: 'GET',
   url: '/1.0/CheckSession',
   dataType: 'json',
   success: function (data) {
       if (data && !data.Error) {
           if (data.LoggedIn) {
               user = data;
               $('#login').addClass('hidden');
               // if project in route try and get bundle itself
               $('#setup').removeClass('hidden');
               var projectId = window.location.search.indexOf('projectId=') > -1 ? window.location.search.split('?projectId=').pop() : '';
               $('input.project-id').val(projectId);
               if (projectId) {
                   $('.get-bundle').delay(500).click();
               } else {
                   getProjects();
               }

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
    e.preventDefault();
    console.log(formStuff);
     $.ajax({
        type: 'POST',
        url: '/1.0/Authenticate',
        data: {
            'UserName': formStuff[0].value,
            'Password': formStuff[1].value
        },
        dataType: 'json',
        success: function (data) {
            if (data && !data.Error) {
                // alert('logged in!');
                user = data;
                $('#login').addClass('hidden');
                $('#setup').removeClass('hidden');
                getProjects();
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

$('.change-project').click(function (e) {
    e.preventDefault();
    // show project screen again
    $('#setup').removeClass('hidden loading');
    $('#tool').addClass('hidden');
    bundle = undefined;
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
