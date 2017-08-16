//an object for a Quiz, which wll contain Question obect
var Quiz = function(quiz_name){
  this.quiz_name = quiz_name;
  this.questions = [];
}

Quiz.prototype.add_question = function(question){
  var index_to_add_question = Math.floor(Math.random()*this.questions.length);
  this.questions.splice(index_to_add_question, 0, questions);
}

Quiz.prototype.render = function(container){
  var self = this;
  $('#quiz-result').hide();
}

question_container = $('<div>').attr('class', 'question').insertAfter('#quiz-name');

function change_question(){
  self.questions[current_question_index].render(question_container);
}

$('#pre').click(function(){
  
});

$('#next').click(function(){

});
