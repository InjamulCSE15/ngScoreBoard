var app = angular.module("scoreboardApp", []);

app.controller("scoreboardController", function ($scope, $interval, $timeout) {

  $scope.isStart = false;
  $scope.isBackBtn = false;
  $scope.quizBoardScreen = false;
  $scope.qSetup = {};
  $scope.qSetup.questionCount = 10;
  $scope.qSetup.examinee = 0;
  $scope.qSetup.timer = 10;
  $scope.examineeList = [];

  // Sync the list of examinees
  $scope.examineeInfo = function () {
    var count = $scope.qSetup.examinee;
    if (!count || count < 1) return;
    var currentLength = $scope.examineeList.length;
    if (count > currentLength) {
      for (var i = currentLength; i < count; i++) {
        $scope.examineeList.push({ name: '', marks: 0 }); // Added marks property here
      }
    } else {
      $scope.examineeList.splice(count);
    }
  };

  // Marks buttons on individual cards
  $scope.adjustMarks = function (person, amount) {
    // Prevent adding marks if name is missing
    if (amount > 0 && (!person.name || !person.name.trim())) {
      $scope.errAlert = true; // show
      $scope.alertMsg = "Please enter a name before adding marks.";
      $scope.showTempError();
      return;
    }
    person.marks += amount;
    // Prevent negative marks if desired
    if (person.marks < 0) person.marks = 0;
  };

  $scope.quizSetup = function () {
    $scope.isBackBtn = true;
    $scope.quizBoardScreen = true;
  };


  // Ensure timerInterval is declared in the controller scope (but not on $scope)
  var timerInterval;
  $scope.countDown = 0; // Initialize
  $scope.startQuiz = function () {
    if ($scope.isStart) return;
    $scope.isStart = true;
    // 1. Set the countdown immediately so the UI doesn't look blank
    $scope.countDown = $scope.qSetup.timer;

    if (angular.isDefined(timerInterval)) {
      $interval.cancel(timerInterval);
    }

    // 2. Start the interval
    timerInterval = $interval(function () {
      if ($scope.countDown > 0) {
        $scope.countDown--;
      } else {
        $scope.stopTimer();
      }
    }, 1000);
  };

  $scope.stopTimer = function () {
    if (angular.isDefined(timerInterval)) {
      $interval.cancel(timerInterval);
      timerInterval = undefined;
    }
    alert("Time's up!")
    $scope.isStart = false;
    $scope.countDown = 0; // Reset
  };

  $scope.resultScreen = false;
  $scope.sortedExaminees = [];

  $scope.publishResult = function () {
    // Stop timer if it's still running
    if ($scope.isStart) $scope.stopTimer();

    // Clone and sort the list: Highest marks first (Descending)
    // Note: Use (b.marks - a.marks) for high-to-low ranking
    $scope.sortedExaminees = angular.copy($scope.examineeList).sort(function (a, b) {
      return b.marks - a.marks;
    });

    // Switch screens
    $scope.quizBoardScreen = false;
    $scope.resultScreen = true;
  };

  // Reset function to go back to setup or board
  $scope.resetQuiz = function () {
    $scope.resultScreen = false;
    $scope.quizBoardScreen = false; // Goes back to Setup
  };

  $scope.hasAnyMarks = function () {
    // Returns true if at least one person has marks > 0
    return $scope.examineeList.some(function (person) {
      return person.marks > 0;
    });
  };
  $scope.errAlert = false; // hide
  $scope.alertMsg = '';
  $scope.showTempError = function () {
    $scope.errAlert = true;
    $timeout(function () {
      $scope.errAlert = false;
      $scope.alertMsg = '';
    }, 2500);
  };


});