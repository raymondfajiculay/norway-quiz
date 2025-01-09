<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Quiz;
use Illuminate\Http\Request;

class AnswerController extends Controller
{
    public function store(Request $request) {
        $fields = $request->validate([
            'participant_id' => 'required',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required',
            'answers.*.answer' => 'required',
            'answers.*.test_type' => 'required'
        ]);

        $participant_id = $fields['participant_id'];
        $answers = $fields['answers'];

        foreach ($answers as $answerData) {
            Answer::create([
                'participant_id' => $participant_id,
                'question_id' => $answerData['question_id'],
                'answer' => $answerData['answer'],
                'test_type' => $answerData['test_type']
            ]);
        }

        return response()->json(['message' => 'Answers saved successfully'], 201);
    }
    
    public function dashboard(Request $request, $slug)
    {
        $sex = $request->query('sex');
        $startAge = $request->query('startAge');
        $endAge = $request->query('endAge');
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');

    
        // Retrieve the quiz by slug and eager load participants with their answers (filtered by test_type) and questions
        $quiz = Quiz::where('slug', $slug)
            ->with([
                'participants' => function ($query) use ($sex, $startAge, $endAge, $startDate, $endDate) {
                    // Apply gender filter if provided and not empty
                    if (!empty($sex)) {
                        $query->where('biological_sex', $sex);
                    }

                    // Apply age range filter based on provided parameters
                    if (!empty($startAge) && !empty($endAge)) {
                        // Both start and end age provided
                        $query->whereBetween('age', [$startAge, $endAge]);
                    } elseif (!empty($startAge)) {
                        // Only start age provided
                        $query->where('age', '>=', $startAge);
                    } elseif (!empty($endAge)) {
                        // Only end age provided
                        $query->where('age', '<=', $endAge);
                    }

                     // Apply date range filter based on provided parameters
                    if (!empty($startDate) && !empty($endDate)) {
                        // Both start and end date provided
                        $query->whereBetween('created_at', [$startDate, $endDate]);
                    } elseif (!empty($startDate)) {
                        // Only start date provided
                        $query->where('created_at', '>=', $startDate);
                    } elseif (!empty($endDate)) {
                        // Only end date provided
                        $query->where('created_at', '<=', $endDate);
                    }

                    // Apply answer filters for pre and post tests
                    $query->whereHas('answers', function ($query) {
                        $query->whereIn('test_type', ['Pre Test', 'Post Test']);
                    });
                },
                'questions' // Eager load questions without filtering
            ])
            ->first();
    
        // Check if the quiz exists
        if (!$quiz) {
            return response()->json(['error' => 'Quiz not found'], 404);
        }
    
        // Process answers and calculate match percentages for pre-test and post-test
        $participants = $quiz->participants->map(function ($participant) use ($quiz) {
            // Group answers by test_type and question_id
            $groupedAnswers = $participant->answers->groupBy('test_type')
                ->map(function ($answers) {
                    return $answers->keyBy('question_id')->pluck('answer', 'question_id');
                });
    
            // Add grouped answers to the participant data
            $participant->grouped_answers = $groupedAnswers;
    
            return $participant;
        });
    
        // Calculate the match percentage for each test type
        $calculateMatchPercentage = function ($testType) use ($quiz, $participants) {
            $totalQuestions = $quiz->questions->count();
            $totalMatches = 0;
            $totalParticipants = $participants->count();
    
            // Iterate over participants to calculate matches
            foreach ($participants as $participant) {
                foreach ($quiz->questions as $index => $question) {
                    $answer = $participant->grouped_answers[$testType][$question->id] ?? null;
                    if ($answer === $question->answer) {
                        $totalMatches++;
                    }
                }
            }
    
            return $totalParticipants > 0
                ? number_format(($totalMatches / ($totalQuestions * $totalParticipants)) * 100, 2)
                : 0;
        };
    
        // Calculate the correct answer percentage for each question
        $calculateQuestionCorrectPercentage = function ($testType) use ($quiz, $participants) {
            $questionCorrectPercentages = [];
    
            foreach ($quiz->questions as $question) {
                $correctCount = 0;
                $totalParticipants = $participants->count();
    
                foreach ($participants as $participant) {
                    $answer = $participant->grouped_answers[$testType][$question->id] ?? null;
                    if ($answer === $question->answer) {
                        $correctCount++;
                    }
                }
    
                // Calculate the percentage of correct answers for the current question
                $questionCorrectPercentages[] = [
                    'question' => $question->question_text,
                    'correctAnswer' => $totalParticipants > 0
                        ? number_format(($correctCount / $totalParticipants) * 100, 2)
                        : 0
                ];
            }
    
            return $questionCorrectPercentages;
        };
    
        // Calculate the pre-test and post-test scores
        $preTestScore = $calculateMatchPercentage('Pre Test');
        $postTestScore = $calculateMatchPercentage('Post Test');
    
        // Calculate the correct answer percentage for each question for both pre-test and post-test
        $preTestQuestionPercentages = $calculateQuestionCorrectPercentage('Pre Test');
        $postTestQuestionPercentages = $calculateQuestionCorrectPercentage('Post Test');
    
        // Combine the pre-test and post-test question percentages
        $questionsWithPercentages = $quiz->questions->map(function ($question) use ($preTestQuestionPercentages, $postTestQuestionPercentages) {
            // Find the correct percentage for the question for both tests
            $preTest = collect($preTestQuestionPercentages)->firstWhere('question', $question->question_text);
            $postTest = collect($postTestQuestionPercentages)->firstWhere('question', $question->question_text);
    
            return [
                'question' => $question->question_text,
                'preTestCorrect' => $preTest ? $preTest['correctAnswer'] : 0,
                'postTestCorrect' => $postTest ? $postTest['correctAnswer'] : 0,
            ];
        });
    
        // Return the processed data
        return response()->json([
            'pre_test_score' => $preTestScore,
            'post_test_score' => $postTestScore,
            'questions' => $questionsWithPercentages, // Include the correct answer percentages for each question
        ]);
    }
    
}
