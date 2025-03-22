// generative-ui-chat/components/common/survey.tsx

'use client'
import React, { useState } from 'react';
import { Button, Radio, RadioGroup, Textarea } from "@heroui/react";

interface Question {
  id: string;
  text: string;
  type: 'radio' | 'text';
  options?: string[];
}

interface SurveyProps {
  questions: Question[];
  onSubmit: (answers: Record<string, string>) => void;
  submitButtonText?: string;
}

export const Survey: React.FC<SurveyProps> = ({
  questions,
  onSubmit,
  submitButtonText = 'Submit Survey',
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="grid gap-6 p-4 bg-content3 rounded-xl">
      {questions.map((question) => (
        <div key={question.id} className="grid gap-2">
          <h3 className="text-lg font-medium">{question.text}</h3>
          {question.type === 'radio' && question.options && (
            <RadioGroup
              orientation="vertical"
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              {question.options.map((option) => (
                <Radio key={option} value={option}>
                  {option}
                </Radio>
              ))}
            </RadioGroup>
          )}
          {question.type === 'text' && (
            <Textarea
              placeholder="Your answer"
              onChange={(e) => handleAnswer(question.id, e.target.value)}
            />
          )}
        </div>
      ))}
      <Button color="primary" onClick={handleSubmit}>
        {submitButtonText}
      </Button>
    </div>
  );
};

export const SurveyExample = () => {
  const SurveyExampleProps: SurveyProps = {
    questions: [
      {
        id: '1',
        text: 'What is your favorite color?',
        type: 'radio',
        options: ['Red', 'Green', 'Blue'],
      },
      {
        id: '2',
        text: 'What is your favorite animal?',
        type: 'text',
      },
    ],
    onSubmit: (answers: Record<string, string>) => {
      console.log('Survey answers:', answers);
    },
  };

  return <Survey questions={SurveyExampleProps.questions} onSubmit={SurveyExampleProps.onSubmit} />;
}
