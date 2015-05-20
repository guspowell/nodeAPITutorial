var userListDate = [];

$(document).ready(function() {
  populateTable();

  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

  $('#btnAddUser').on('click', addUser);

  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

  $('#userList table tbody').on('click', 'td a.linkupdateuser', populateUpdateForm);
  $('#btnUpdateUser').on('click', updateUserInfo);
});

function populateTable() {
  var tableContent = '';

  $.getJSON('/users/userlist', function(data) {
    userListData = data;

    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="'+ this.username +'">'+ this.username +'</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '<td><a href="#" class="linkupdateuser" rel="' + this._id + '">update</a></td>';
      tableContent += '<tr>';
    });

    $('#userList table tbody').html(tableContent);
  });
};

function showUserInfo(event) {
  event.preventDefault();
  var thisUserName = $(this).attr('rel');
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

  var thisUserObject = userListData[arrayPosition];

  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
};

function addUser(event) {
  event.preventDefault();

  var errorCount = 0;

  $('#addUser input').each(function(index, val) {  //function not working!
    if($(this).val() === '') { errorCount++; }
  });

  if(errorCount === 0) {
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullName').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    }

    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response ) {
      if(response.msg === '') {     // Check for successful (blank) response
        $('#addUser fieldset input').val('');   // Clear the form inputs
        populateTable();
      }
      else {  // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }
    });
  }

  else {  // If errorCount is more than 0, error out
    alert('Please Fill in all the fields');
    return false;
  }

};

function deleteUser(event) {
  event.preventDefault();
  var confirmation = confirm('Are you sure you want to delete this user?');

  if (confirmation === true) {

    console.log($(this));

    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function(response) {

      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      populateTable();

    });
  }

  else {
    return false;
  }
};

function populateUpdateForm(event) {
  event.preventDefault();
  var thisUserId = $(this).attr('rel');
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisUserId);
  var thisUserObject = userListData[arrayPosition];
  var userValues = {
    'inputUserName': thisUserObject.username,
    'inputUserEmail': thisUserObject.email,
    'inputUserFullName': thisUserObject.fullname,
    'inputUserAge': thisUserObject.age,
    'inputUserLocation': thisUserObject.location,
    'inputUserGender': thisUserObject.gender
  }
  $('#updateUser fieldset').find('input').val(function(index, value) {
    return userValues[this.id]
  });
};

function updateUserInfo(event) {
  event.preventDefault;
};
